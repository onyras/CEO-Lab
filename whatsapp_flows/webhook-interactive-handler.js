const { createClient } = require('@supabase/supabase-js');
const { sendNextQuestion } = require('./send-weekly-interactive');
const config = require('./config');

const supabase = createClient(config.supabase.url, config.supabase.key);

/**
 * Process interactive button/list response
 */
async function processInteractiveResponse(message, value) {
  try {
    const from = message.from;
    const interactiveType = message.interactive.type;

    let buttonId, buttonTitle;

    if (interactiveType === 'button_reply') {
      buttonId = message.interactive.button_reply.id;
      buttonTitle = message.interactive.button_reply.title;
    } else if (interactiveType === 'list_reply') {
      buttonId = message.interactive.list_reply.id;
      buttonTitle = message.interactive.list_reply.title;
    }

    console.log('🔘 Button click from:', from);
    console.log('Button ID:', buttonId);
    console.log('Answer:', buttonTitle);

    // Parse button ID: q1_0_userId_weekNumber
    const parts = buttonId.split('_');
    const questionNum = parseInt(parts[0].replace('q', ''));
    const userId = parts[2];
    const weekNumber = parseInt(parts[3]);

    // Get user and progress
    const { data: progress, error: progressError } = await supabase
      .from('weekly_response_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('week_number', weekNumber)
      .single();

    if (progressError || !progress) {
      console.log('⚠️ Progress not found');
      return;
    }

    // Save answer
    const answerField = `answer_${questionNum}`;
    const updateData = {
      [answerField]: buttonTitle,
      current_question: questionNum + 1
    };

    await supabase
      .from('weekly_response_progress')
      .update(updateData)
      .eq('user_id', userId)
      .eq('week_number', weekNumber)
      .eq('quarter', progress.quarter);

    // Check if all questions answered
    if (questionNum === 3) {
      // Save final responses
      await saveFinalResponses(userId, weekNumber, progress.quarter, {
        answer_1: questionNum === 1 ? buttonTitle : progress.answer_1,
        answer_2: questionNum === 2 ? buttonTitle : progress.answer_2,
        answer_3: buttonTitle
      });

      // Mark progress as complete
      await supabase
        .from('weekly_response_progress')
        .update({ completed_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('week_number', weekNumber)
        .eq('quarter', progress.quarter);

      // Send confirmation
      await sendCompletionConfirmation(from, weekNumber, progress.quarter);

      console.log(`✅ All answers saved for user ${userId}, week ${weekNumber}`);
    } else {
      // Send next question
      const { data: userInfo } = await supabase
        .from('user_weekly_questions')
        .select('*')
        .eq('user_id', userId)
        .eq('quarter', progress.quarter)
        .single();

      if (userInfo) {
        const user = {
          ...userInfo,
          whatsapp_number: from,
          week_number: weekNumber
        };

        await sendNextQuestion(userId, weekNumber, progress.quarter, questionNum + 1, user);
        console.log(`📤 Sent question ${questionNum + 1} to user`);
      }
    }

  } catch (error) {
    console.error('Error processing interactive response:', error);
  }
}

/**
 * Save final responses to main table
 */
async function saveFinalResponses(userId, weekNumber, quarter, answers) {
  await supabase
    .from(config.tables.weeklyResponses)
    .upsert({
      user_id: userId,
      week_number: weekNumber,
      quarter: quarter,
      answer_1: answers.answer_1,
      answer_2: answers.answer_2,
      answer_3: answers.answer_3,
      submitted_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,week_number,quarter'
    });

  // Update streak
  await supabase.rpc('increment_streak', { user_id_param: userId });
}

/**
 * Send completion confirmation
 */
async function sendCompletionConfirmation(to, weekNumber, quarter) {
  const axios = require('axios');
  const url = `${config.whatsapp.baseUrl}/${config.whatsapp.apiVersion}/${config.whatsapp.phoneNumberId}/messages`;

  const message = {
    messaging_product: 'whatsapp',
    to: to,
    type: 'text',
    text: {
      body: `✅ *Week ${weekNumber} complete!*\n\nAll 3 questions answered. Your responses have been saved!\n\nView progress: https://ceolab.app/dashboard\n\nKeep going! 🔥`
    }
  };

  await axios.post(url, message, {
    headers: {
      'Authorization': `Bearer ${config.whatsapp.accessToken}`,
      'Content-Type': 'application/json'
    }
  });
}

module.exports = {
  processInteractiveResponse
};
