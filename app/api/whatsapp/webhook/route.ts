import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import axios from 'axios'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

const config = {
  webhook: {
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || 'my_verify_token_123'
  },
  whatsapp: {
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN!,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID!,
    baseUrl: 'https://graph.facebook.com',
    apiVersion: 'v21.0'
  }
}

/**
 * Webhook verification endpoint (required by Meta)
 * GET /api/whatsapp/webhook
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  console.log('📞 Webhook verification request received')

  if (mode === 'subscribe' && token === config.webhook.verifyToken) {
    console.log('✅ Webhook verified successfully')
    return new NextResponse(challenge, { status: 200 })
  } else {
    console.error('❌ Webhook verification failed')
    return NextResponse.json({ error: 'Verification failed' }, { status: 403 })
  }
}

/**
 * Webhook endpoint for receiving messages
 * POST /api/whatsapp/webhook
 */
export async function POST(request: NextRequest) {
  console.log('📨 Webhook message received')

  try {
    const body = await request.json()

    // Validate webhook payload
    if (!body.object || body.object !== 'whatsapp_business_account') {
      console.log('⚠️ Not a WhatsApp webhook')
      return NextResponse.json({ received: true }, { status: 200 })
    }

    // Extract message data
    const entry = body.entry?.[0]
    const changes = entry?.changes?.[0]
    const value = changes?.value
    const messages = value?.messages

    if (!messages || messages.length === 0) {
      console.log('⚠️ No messages in webhook')
      return NextResponse.json({ received: true }, { status: 200 })
    }

    // Process each message (async, don't wait)
    for (const message of messages) {
      processMessage(message, value).catch(error => {
        console.error('💥 Error processing message:', error)
      })
    }

    // Respond immediately
    return NextResponse.json({ received: true }, { status: 200 })

  } catch (error) {
    console.error('💥 Error processing webhook:', error)
    return NextResponse.json({ received: true }, { status: 200 })
  }
}

/**
 * Process individual message from webhook
 */
async function processMessage(message: any, value: any) {
  const messageType = message.type
  const from = message.from

  console.log(`Processing ${messageType} message from ${from}`)

  // Handle interactive button/list responses
  if (messageType === 'interactive') {
    if (message.interactive.type === 'button_reply' || message.interactive.type === 'list_reply') {
      await processInteractiveResponse(message, value)
    }
  }
}

/**
 * Process interactive button/list response
 */
async function processInteractiveResponse(message: any, value: any) {
  try {
    const from = message.from
    const interactiveType = message.interactive.type

    let buttonId: string, buttonTitle: string

    if (interactiveType === 'button_reply') {
      buttonId = message.interactive.button_reply.id
      buttonTitle = message.interactive.button_reply.title
    } else if (interactiveType === 'list_reply') {
      buttonId = message.interactive.list_reply.id
      buttonTitle = message.interactive.list_reply.title
    } else {
      return
    }

    console.log('🔘 Button click from:', from)
    console.log('Button ID:', buttonId)
    console.log('Answer:', buttonTitle)

    // Parse button ID: q1_0_userId_weekNumber
    const parts = buttonId.split('_')
    const questionNum = parseInt(parts[0].replace('q', ''))
    const userId = parts[2]
    const weekNumber = parseInt(parts[3])

    // Get user and progress
    const { data: progress, error: progressError } = await supabase
      .from('weekly_response_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('week_number', weekNumber)
      .single()

    if (progressError || !progress) {
      console.log('⚠️ Progress not found')
      return
    }

    // Save answer
    const answerField = `answer_${questionNum}`
    const updateData = {
      [answerField]: buttonTitle,
      current_question: questionNum + 1
    }

    await supabase
      .from('weekly_response_progress')
      .update(updateData)
      .eq('user_id', userId)
      .eq('week_number', weekNumber)
      .eq('quarter', progress.quarter)

    // Check if all questions answered
    if (questionNum === 3) {
      // Save final responses
      await supabase
        .from('weekly_responses')
        .upsert({
          user_id: userId,
          week_number: weekNumber,
          quarter: progress.quarter,
          answer_1: progress.answer_1,
          answer_2: progress.answer_2,
          answer_3: buttonTitle,
          submitted_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,week_number,quarter'
        })

      // Mark progress as complete
      await supabase
        .from('weekly_response_progress')
        .update({ completed_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('week_number', weekNumber)
        .eq('quarter', progress.quarter)

      // Update streak
      await supabase.rpc('increment_streak', { user_id_param: userId })

      // Send confirmation
      await sendCompletionConfirmation(from, weekNumber, progress.quarter)

      console.log(`✅ All answers saved for user ${userId}, week ${weekNumber}`)
    } else {
      // Send next question
      const { data: userInfo } = await supabase
        .from('user_weekly_questions')
        .select('*')
        .eq('user_id', userId)
        .eq('quarter', progress.quarter)
        .single()

      if (userInfo) {
        await sendNextQuestion(from, userId, weekNumber, progress.quarter, questionNum + 1, userInfo)
        console.log(`📤 Sent question ${questionNum + 1} to user`)
      }
    }

  } catch (error) {
    console.error('Error processing interactive response:', error)
  }
}

/**
 * Send next question based on progress
 */
async function sendNextQuestion(
  to: string,
  userId: string,
  weekNumber: number,
  quarter: string,
  questionNumber: number,
  user: any
) {
  const url = `${config.whatsapp.baseUrl}/${config.whatsapp.apiVersion}/${config.whatsapp.phoneNumberId}/messages`

  const categoryKey = `category_${questionNumber}`
  const questionKey = `question_${questionNumber}`

  const category = user[categoryKey]
  const questionText = user[questionKey]
  const options = getAnswerOptions(category, questionText)

  let payload: any

  if (options.length <= 3) {
    payload = {
      messaging_product: 'whatsapp',
      to: to,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: {
          text: `*Question ${questionNumber}/3: ${category}*\n${questionText}`
        },
        action: {
          buttons: options.map((opt, idx) => ({
            type: 'reply',
            reply: {
              id: `q${questionNumber}_${idx}_${userId}_${weekNumber}`,
              title: opt
            }
          }))
        }
      }
    }
  } else {
    payload = {
      messaging_product: 'whatsapp',
      to: to,
      type: 'interactive',
      interactive: {
        type: 'list',
        body: {
          text: `*Question ${questionNumber}/3: ${category}*\n${questionText}`
        },
        action: {
          button: 'Select Answer',
          sections: [{
            title: 'Your Answer',
            rows: options.map((opt, idx) => ({
              id: `q${questionNumber}_${idx}_${userId}_${weekNumber}`,
              title: opt,
              description: ''
            }))
          }]
        }
      }
    }
  }

  await axios.post(url, payload, {
    headers: {
      'Authorization': `Bearer ${config.whatsapp.accessToken}`,
      'Content-Type': 'application/json'
    }
  })
}

/**
 * Get answer options based on question category and text
 */
function getAnswerOptions(category: string, questionText: string): string[] {
  const lowerText = questionText.toLowerCase()

  if (lowerText.includes('how many hours')) {
    return ['0-5 hours', '5-10 hours', '10-15 hours', '15+ hours']
  }

  if (lowerText.includes('did you')) {
    return ['Yes', 'No', 'Partially']
  }

  if (lowerText.includes('commitments')) {
    return ['All kept', 'Most kept', 'Some broken', 'Many broken']
  }

  if (lowerText.includes('how many times')) {
    return ['0 times', '1-3 times', '4-7 times', '8+ times']
  }

  if (lowerText.includes('how many days')) {
    return ['0 days', '1-3 days', '4-5 days', '6-7 days']
  }

  if (lowerText.includes('how fast') || lowerText.includes('how long')) {
    return ['Immediately', 'Within hours', 'Within days', 'Within weeks']
  }

  if (lowerText.includes('more questions or') || lowerText.includes('questions or answers')) {
    return ['More questions', 'More answers', 'Balanced']
  }

  if (lowerText.includes('what %') || lowerText.includes('percentage')) {
    return ['0-25%', '25-50%', '50-75%', '75-100%']
  }

  return ['Option 1', 'Option 2', 'Option 3']
}

/**
 * Send completion confirmation
 */
async function sendCompletionConfirmation(to: string, weekNumber: number, quarter: string) {
  const url = `${config.whatsapp.baseUrl}/${config.whatsapp.apiVersion}/${config.whatsapp.phoneNumberId}/messages`

  const message = {
    messaging_product: 'whatsapp',
    to: to,
    type: 'text',
    text: {
      body: `✅ *Week ${weekNumber} complete!*\n\nAll 3 questions answered. Your responses have been saved!\n\nView progress: https://ceolab.app/dashboard\n\nKeep going! 🔥`
    }
  }

  await axios.post(url, message, {
    headers: {
      'Authorization': `Bearer ${config.whatsapp.accessToken}`,
      'Content-Type': 'application/json'
    }
  })
}
