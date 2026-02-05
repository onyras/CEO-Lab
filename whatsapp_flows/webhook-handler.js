const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const config = require('./config');
const { processInteractiveResponse } = require('./webhook-interactive-handler');

const app = express();
app.use(express.json());

// Initialize Supabase client
const supabase = createClient(config.supabase.url, config.supabase.key);

/**
 * Webhook verification endpoint (required by Meta)
 * GET /webhook
 */
app.get(config.webhook.path, (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('📞 Webhook verification request received');

  // Check if mode and token are correct
  if (mode === 'subscribe' && token === config.webhook.verifyToken) {
    console.log('✅ Webhook verified successfully');
    res.status(200).send(challenge);
  } else {
    console.error('❌ Webhook verification failed');
    res.sendStatus(403);
  }
});

/**
 * Webhook endpoint for receiving messages
 * POST /webhook
 */
app.post(config.webhook.path, async (req, res) => {
  console.log('📨 Webhook message received');

  // Always respond 200 immediately to acknowledge receipt
  res.sendStatus(200);

  try {
    const body = req.body;

    // Validate webhook payload
    if (!body.object || body.object !== 'whatsapp_business_account') {
      console.log('⚠️ Not a WhatsApp webhook');
      return;
    }

    // Extract message data
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;

    if (!messages || messages.length === 0) {
      console.log('⚠️ No messages in webhook');
      return;
    }

    // Process each message
    for (const message of messages) {
      await processMessage(message, value);
    }

  } catch (error) {
    console.error('💥 Error processing webhook:', error);
    // Don't throw - we already sent 200 response
  }
});

/**
 * Process individual message from webhook
 */
async function processMessage(message, value) {
  const messageType = message.type;
  const from = message.from; // User's WhatsApp number

  console.log(`Processing ${messageType} message from ${from}`);

  // Handle interactive button/list responses
  if (messageType === 'interactive') {
    if (message.interactive.type === 'button_reply' || message.interactive.type === 'list_reply') {
      await processInteractiveResponse(message, value);
    } else if (message.interactive.type === 'nfm_reply') {
      await processFlowResponse(message, value);
    }
  }
  // Handle text message responses (fallback)
  else if (messageType === 'text') {
    await processTextResponse(message, value);
  } else {
    console.log(`Ignoring message type: ${messageType}`);
  }
}

/**
 * Process Flow response (user submitted answers)
 */
async function processFlowResponse(message, value) {
  try {
    const flowResponse = message.interactive.nfm_reply;
    const responseJson = JSON.parse(flowResponse.response_json);

    console.log('📊 Flow response:', responseJson);

    // Extract data from flow response
    const answers = responseJson.flow_token; // Contains user_id and week_number
    const formData = responseJson;

    // Parse flow token to get user info
    const tokenParts = flowResponse.flow_token.split('_'); // Format: user_123_week_1
    const userId = tokenParts[1];
    const weekNumber = parseInt(tokenParts[3]);

    // Get user's current quarter
    const { data: userData, error: userError } = await supabase
      .from(config.tables.weeklyQuestions)
      .select('quarter')
      .eq('user_id', userId)
      .single();

    if (userError) {
      throw new Error(`Failed to fetch user data: ${userError.message}`);
    }

    // Save responses to database
    const { error: saveError } = await supabase
      .from(config.tables.weeklyResponses)
      .insert({
        user_id: userId,
        week_number: weekNumber,
        quarter: userData.quarter,
        answer_1: formData.answer_1,
        answer_2: formData.answer_2,
        answer_3: formData.answer_3,
        submitted_at: new Date().toISOString(),
        whatsapp_message_id: message.id
      });

    if (saveError) {
      throw new Error(`Failed to save responses: ${saveError.message}`);
    }

    // Update user's streak
    await updateUserStreak(userId);

    // Send confirmation message
    await sendConfirmationMessage(message.from, weekNumber, userData.quarter);

    console.log(`✅ Saved responses for user ${userId}, week ${weekNumber}`);

  } catch (error) {
    console.error('Error processing flow response:', error);
    // Log error to database for debugging
    await logError({
      type: 'flow_response_error',
      message_id: message.id,
      from: message.from,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Update user's weekly streak
 */
async function updateUserStreak(userId) {
  // Get last response date
  const { data: lastResponse } = await supabase
    .from(config.tables.weeklyResponses)
    .select('submitted_at')
    .eq('user_id', userId)
    .order('submitted_at', { ascending: false })
    .limit(2);

  if (!lastResponse || lastResponse.length < 2) {
    // First response or second response, set streak to 1 or 2
    await supabase
      .from(config.tables.weeklyQuestions)
      .update({ streak_weeks: lastResponse?.length || 1 })
      .eq('user_id', userId);
    return;
  }

  // Check if responses are consecutive weeks
  const last = new Date(lastResponse[0].submitted_at);
  const previous = new Date(lastResponse[1].submitted_at);
  const daysDiff = Math.floor((last - previous) / (1000 * 60 * 60 * 24));

  // If within 7-14 days, increment streak
  if (daysDiff >= 7 && daysDiff <= 14) {
    await supabase.rpc('increment_streak', { user_id_param: userId });
  } else {
    // Reset streak if gap is too large
    await supabase
      .from(config.tables.weeklyQuestions)
      .update({ streak_weeks: 1 })
      .eq('user_id', userId);
  }
}

/**
 * Process text message response (user answering questions)
 */
async function processTextResponse(message, value) {
  try {
    const from = message.from; // User's WhatsApp number
    const messageText = message.text.body;

    console.log('📝 Text response from:', from);
    console.log('Message:', messageText);

    // Find user by WhatsApp number
    const { data: users, error: userError } = await supabase
      .from(config.tables.users)
      .select('id, name')
      .eq('whatsapp_number', `+${from}`)
      .single();

    if (userError || !users) {
      console.log('⚠️ User not found with number:', from);
      return;
    }

    // Get user's current quarter
    const { data: questions, error: qError } = await supabase
      .from(config.tables.weeklyQuestions)
      .select('quarter, quarter_start_date')
      .eq('user_id', users.id)
      .eq('active', true)
      .single();

    if (qError || !questions) {
      console.log('⚠️ No active questions found for user');
      return;
    }

    // Calculate current week number
    const quarterStart = new Date(questions.quarter_start_date);
    const now = new Date();
    const diffTime = Math.abs(now - quarterStart);
    const weekNumber = Math.min(Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7)), 13);

    // Parse answers from message
    const answers = parseAnswers(messageText);

    if (!answers || answers.length < 3) {
      // Not enough answers, send reminder
      await sendReminderMessage(from, users.name);
      return;
    }

    // Save responses to database
    const { error: saveError } = await supabase
      .from(config.tables.weeklyResponses)
      .upsert({
        user_id: users.id,
        week_number: weekNumber,
        quarter: questions.quarter,
        answer_1: answers[0],
        answer_2: answers[1],
        answer_3: answers[2],
        submitted_at: new Date().toISOString(),
        whatsapp_message_id: message.id
      }, {
        onConflict: 'user_id,week_number,quarter'
      });

    if (saveError) {
      throw new Error(`Failed to save responses: ${saveError.message}`);
    }

    // Update user's streak
    await updateUserStreak(users.id);

    // Send confirmation message
    await sendConfirmationMessage(from, weekNumber, questions.quarter, users.name);

    console.log(`✅ Saved responses for ${users.name}, week ${weekNumber}`);

  } catch (error) {
    console.error('Error processing text response:', error);
    await logError({
      type: 'text_response_error',
      message_id: message.id,
      from: message.from,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Parse answers from message text
 */
function parseAnswers(messageText) {
  const lines = messageText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  // Try numbered format (1. 2. 3.)
  const numberedAnswers = lines
    .filter(line => /^[123][\.\)]\s*/.test(line))
    .map(line => line.replace(/^[123][\.\)]\s*/, '').trim());

  if (numberedAnswers.length >= 3) {
    return numberedAnswers.slice(0, 3);
  }

  // Take first 3 lines
  if (lines.length >= 3) {
    return lines.slice(0, 3);
  }

  return null;
}

/**
 * Send reminder if format is wrong
 */
async function sendReminderMessage(to, name) {
  const axios = require('axios');
  const url = `${config.whatsapp.baseUrl}/${config.whatsapp.apiVersion}/${config.whatsapp.phoneNumberId}/messages`;

  const message = {
    messaging_product: 'whatsapp',
    to: to,
    type: 'text',
    text: {
      body: `Hi ${name.split(' ')[0]}! 👋\n\nPlease answer all 3 questions in this format:\n\n1. [your answer]\n2. [your answer]\n3. [your answer]\n\nThanks!`
    }
  };

  try {
    await axios.post(url, message, {
      headers: {
        'Authorization': `Bearer ${config.whatsapp.accessToken}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Failed to send reminder:', error.message);
  }
}

/**
 * Send confirmation message to user
 */
async function sendConfirmationMessage(to, weekNumber, quarter, name) {
  const axios = require('axios');

  const url = `${config.whatsapp.baseUrl}/${config.whatsapp.apiVersion}/${config.whatsapp.phoneNumberId}/messages`;

  const message = {
    messaging_product: 'whatsapp',
    to: to,
    type: 'text',
    text: {
      body: `✅ *Week ${weekNumber} complete!*\n\nThanks ${name.split(' ')[0]}! Your responses have been saved.\n\nView progress: https://ceolab.app/dashboard\n\nKeep going! 🔥`
    }
  };

  try {
    await axios.post(url, message, {
      headers: {
        'Authorization': `Bearer ${config.whatsapp.accessToken}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Failed to send confirmation:', error.message);
  }
}

/**
 * Log errors to database for debugging
 */
async function logError(errorData) {
  await supabase
    .from('webhook_errors')
    .insert(errorData);
}

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

/**
 * Start server
 */
const PORT = config.webhook.port;
app.listen(PORT, () => {
  console.log(`🚀 Webhook server running on port ${PORT}`);
  console.log(`📍 Webhook URL: http://localhost:${PORT}${config.webhook.path}`);
  console.log(`🔐 Verify token: ${config.webhook.verifyToken}`);
});

module.exports = app;
