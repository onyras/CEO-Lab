// Add this to webhook-handler.js after processFlowResponse function

/**
 * Process text message response (user answering questions)
 */
async function processTextResponse(message, value) {
  try {
    const from = message.from.replace('whatsapp:', ''); // Remove prefix if present
    const fromClean = from.startsWith('+') ? from : `+${from}`;
    const messageText = message.text.body;

    console.log('📝 Text response from:', fromClean);
    console.log('Message:', messageText);

    // Find user by WhatsApp number
    const { data: users, error: userError } = await supabase
      .from(config.tables.users)
      .select('id, name')
      .eq('whatsapp_number', fromClean)
      .single();

    if (userError || !users) {
      console.log('⚠️ User not found with number:', fromClean);
      return;
    }

    // Get user's current quarter and week
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
    // Format: "1. answer\n2. answer\n3. answer"
    const answers = parseAnswers(messageText);

    if (!answers || answers.length < 3) {
      // Not enough answers, send reminder
      await sendReminderMessage(fromClean, users.name);
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
    await sendConfirmationMessage(fromClean, weekNumber, questions.quarter, users.name);

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
 * Supports formats:
 * - "1. answer\n2. answer\n3. answer"
 * - "answer1\nanswer2\nanswer3"
 */
function parseAnswers(messageText) {
  const lines = messageText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  // Try numbered format first (1. 2. 3.)
  const numberedAnswers = lines
    .filter(line => /^[123][\.\)]\s*/.test(line))
    .map(line => line.replace(/^[123][\.\)]\s*/, '').trim());

  if (numberedAnswers.length >= 3) {
    return numberedAnswers.slice(0, 3);
  }

  // Otherwise take first 3 non-empty lines
  if (lines.length >= 3) {
    return lines.slice(0, 3);
  }

  return null;
}

/**
 * Send reminder if answers not in correct format
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
 * Update confirmation message to include name
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

module.exports = {
  processTextResponse,
  parseAnswers
};
