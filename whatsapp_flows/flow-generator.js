const config = require('./config');

/**
 * Generates a personalized WhatsApp Flow JSON for a user
 * Based on their 3 selected focus categories and questions
 *
 * @param {Object} user - User object with questions
 * @param {string} user.id - User ID
 * @param {string} user.name - User name
 * @param {string} user.question_1 - First personalized question
 * @param {string} user.question_2 - Second personalized question
 * @param {string} user.question_3 - Third personalized question
 * @param {number} user.week_number - Current week number (1-13)
 * @param {string} user.quarter - Current quarter (Q1, Q2, Q3, Q4)
 * @returns {Object} WhatsApp Flow JSON
 */
function generateFlow(user) {
  const flowJson = {
    version: config.flow.version,
    screens: [
      {
        id: "WEEKLY_CHECKIN",
        title: `Week ${user.week_number} Check-in`,
        data: {},
        layout: {
          type: "SingleColumnLayout",
          children: [
            // Welcome Header
            {
              type: "TextHeading",
              text: `Hi ${user.name.split(' ')[0]}! 👋`
            },
            {
              type: "TextSubheading",
              text: `Quick check-in for ${user.quarter} focus areas`
            },

            // Form Container
            {
              type: "Form",
              name: "weekly_checkin_form",
              children: [
                // Question 1
                {
                  type: "TextInput",
                  name: "answer_1",
                  label: user.question_1,
                  "input-type": "text",
                  required: true,
                  "helper-text": getHelperText(user.category_1)
                },

                // Question 2
                {
                  type: "TextInput",
                  name: "answer_2",
                  label: user.question_2,
                  "input-type": "text",
                  required: true,
                  "helper-text": getHelperText(user.category_2)
                },

                // Question 3
                {
                  type: "TextInput",
                  name: "answer_3",
                  label: user.question_3,
                  "input-type": "text",
                  required: true,
                  "helper-text": getHelperText(user.category_3)
                },

                // Submit Footer
                {
                  type: "Footer",
                  label: "Submit",
                  "on-click-action": {
                    name: "complete",
                    payload: {
                      user_id: user.id,
                      week_number: user.week_number,
                      quarter: user.quarter,
                      timestamp: new Date().toISOString()
                    }
                  }
                }
              ]
            }
          ]
        }
      },

      // Confirmation Screen
      {
        id: "CONFIRMATION",
        title: "All Done! ✅",
        terminal: true,
        data: {},
        layout: {
          type: "SingleColumnLayout",
          children: [
            {
              type: "TextHeading",
              text: "Week ${week_number} complete!"
            },
            {
              type: "TextBody",
              text: "Your responses have been saved. Keep going! 🔥"
            },
            {
              type: "TextBody",
              text: `${user.streak_weeks || 1}-week streak`
            },
            {
              type: "Footer",
              label: "View Dashboard",
              "on-click-action": {
                name: "navigate",
                next: {
                  type: "external_link",
                  url: `https://ceolab.app/dashboard`
                }
              }
            }
          ]
        }
      }
    ]
  };

  return flowJson;
}

/**
 * Get helper text for a question based on category
 * Provides context on what kind of answer is expected
 */
function getHelperText(category) {
  const helperTexts = {
    'Energy Management': 'Enter number of hours',
    'Purpose & Direction': 'Yes/No or percentage',
    'Self-Awareness': 'Enter a number',
    'Leading above the Line': 'Blame/Curiosity/Mixed',
    'Emotional Intelligence': 'Enter a number',
    'Grounded Presence': 'Enter number of days (0-7)',
    'Trust Formula': 'X kept, Y broken',
    'Psychological Safety': 'Immediately/Hours/Days/Weeks',
    'Multiplier Behavior': 'More questions/More answers/Balanced',
    'Communication Rhythm': 'Yes/No',
    'Team Health': 'Yes/No/Somewhat',
    'Accountability & Delegation': 'Enter percentage',
    'Strategic Clarity': 'Yes/No',
    'Culture as System': 'Yes/No',
    'Three Transitions': 'Enter percentage ON vs IN',
    'Systems Thinking': 'Patterns/Incidents',
    'Organizational Design': 'Supported/Hindered/Neutral',
    'Board & Governance': 'Yes/No'
  };

  return helperTexts[category] || 'Enter your answer';
}

/**
 * Validate flow JSON structure
 * Ensures all required fields are present
 */
function validateFlow(flowJson) {
  if (!flowJson.version) throw new Error('Flow version is required');
  if (!flowJson.screens || flowJson.screens.length === 0) {
    throw new Error('Flow must have at least one screen');
  }

  const firstScreen = flowJson.screens[0];
  if (!firstScreen.id || !firstScreen.title) {
    throw new Error('Screen must have id and title');
  }

  return true;
}

/**
 * Test function - generates sample flow for testing
 */
function generateTestFlow() {
  const testUser = {
    id: 'test-user-123',
    name: 'Test User',
    question_1: 'This week, how many hours of Deep Work did you complete?',
    question_2: 'How many commitments did you keep vs. break this week?',
    question_3: 'Did you review your strategy this week?',
    category_1: 'Energy Management',
    category_2: 'Trust Formula',
    category_3: 'Strategic Clarity',
    week_number: 1,
    quarter: 'Q1',
    streak_weeks: 1
  };

  const flow = generateFlow(testUser);
  validateFlow(flow);

  console.log('Test Flow Generated:');
  console.log(JSON.stringify(flow, null, 2));

  return flow;
}

// Run test if called directly
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.includes('test')) {
    generateTestFlow();
  }
}

module.exports = {
  generateFlow,
  validateFlow,
  generateTestFlow
};
