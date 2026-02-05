const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const config = require('./config');

const supabase = createClient(config.supabase.url, config.supabase.key);

/**
 * Send first question with interactive buttons
 */
async function sendFirstQuestion(user) {
  const url = `${config.whatsapp.baseUrl}/${config.whatsapp.apiVersion}/${config.whatsapp.phoneNumberId}/messages`;

  // Get answer options for first question based on category
  const options = getAnswerOptions(user.category_1, user.question_1);

  let payload;

  if (options.length <= 3) {
    // Use button message (up to 3 buttons)
    payload = {
      messaging_product: 'whatsapp',
      to: user.whatsapp_number,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: {
          text: `📊 *Week ${user.week_number} Check-in* (${user.quarter})\n\n*Question 1/3: ${user.category_1}*\n${user.question_1}`
        },
        action: {
          buttons: options.map((opt, idx) => ({
            type: 'reply',
            reply: {
              id: `q1_${idx}_${user.id}_${user.week_number}`,
              title: opt
            }
          }))
        }
      }
    };
  } else {
    // Use list message (up to 10 options)
    payload = {
      messaging_product: 'whatsapp',
      to: user.whatsapp_number,
      type: 'interactive',
      interactive: {
        type: 'list',
        body: {
          text: `📊 *Week ${user.week_number} Check-in* (${user.quarter})\n\n*Question 1/3: ${user.category_1}*\n${user.question_1}`
        },
        action: {
          button: 'Select Answer',
          sections: [{
            title: 'Your Answer',
            rows: options.map((opt, idx) => ({
              id: `q1_${idx}_${user.id}_${user.week_number}`,
              title: opt,
              description: ''
            }))
          }]
        }
      }
    };
  }

  const response = await axios.post(url, payload, {
    headers: {
      'Authorization': `Bearer ${config.whatsapp.accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  // Initialize response tracking
  await supabase
    .from('weekly_response_progress')
    .upsert({
      user_id: user.id,
      week_number: user.week_number,
      quarter: user.quarter,
      current_question: 1,
      answer_1: null,
      answer_2: null,
      answer_3: null,
      started_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,week_number,quarter'
    });

  return response.data;
}

/**
 * Send next question based on progress
 */
async function sendNextQuestion(userId, weekNumber, quarter, questionNumber, user) {
  const url = `${config.whatsapp.baseUrl}/${config.whatsapp.apiVersion}/${config.whatsapp.phoneNumberId}/messages`;

  const categoryKey = `category_${questionNumber}`;
  const questionKey = `question_${questionNumber}`;

  const category = user[categoryKey];
  const questionText = user[questionKey];
  const options = getAnswerOptions(category, questionText);

  let payload;

  if (options.length <= 3) {
    payload = {
      messaging_product: 'whatsapp',
      to: user.whatsapp_number,
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
    };
  } else {
    payload = {
      messaging_product: 'whatsapp',
      to: user.whatsapp_number,
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
    };
  }

  const response = await axios.post(url, payload, {
    headers: {
      'Authorization': `Bearer ${config.whatsapp.accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  return response.data;
}

/**
 * Get answer options based on question category and text
 */
function getAnswerOptions(category, questionText) {
  // Define common answer patterns
  if (questionText.toLowerCase().includes('how many hours')) {
    return ['0-5 hours', '5-10 hours', '10-15 hours', '15+ hours'];
  }

  if (questionText.toLowerCase().includes('did you')) {
    return ['Yes', 'No', 'Partially'];
  }

  if (questionText.toLowerCase().includes('commitments')) {
    return ['All kept', 'Most kept', 'Some broken', 'Many broken'];
  }

  if (questionText.toLowerCase().includes('how many times')) {
    return ['0 times', '1-3 times', '4-7 times', '8+ times'];
  }

  if (questionText.toLowerCase().includes('how many days')) {
    return ['0 days', '1-3 days', '4-5 days', '6-7 days'];
  }

  if (questionText.toLowerCase().includes('how fast') || questionText.toLowerCase().includes('how long')) {
    return ['Immediately', 'Within hours', 'Within days', 'Within weeks'];
  }

  if (questionText.toLowerCase().includes('more questions or') || questionText.toLowerCase().includes('questions or answers')) {
    return ['More questions', 'More answers', 'Balanced'];
  }

  if (questionText.toLowerCase().includes('what %') || questionText.toLowerCase().includes('percentage')) {
    return ['0-25%', '25-50%', '50-75%', '75-100%'];
  }

  // Default options
  return ['Option 1', 'Option 2', 'Option 3'];
}

module.exports = {
  sendFirstQuestion,
  sendNextQuestion,
  getAnswerOptions
};
