const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const config = require('./config');
const { generateFlow, validateFlow } = require('./flow-generator');

// Initialize Supabase client
const supabase = createClient(config.supabase.url, config.supabase.key);

/**
 * Main function to send weekly flows to all active users
 */
async function sendWeeklyFlows() {
  console.log('🚀 Starting weekly flow send...');
  console.log(`Time: ${new Date().toISOString()}`);

  try {
    // 1. Fetch all active users with their weekly questions
    const users = await fetchActiveUsers();
    console.log(`📊 Found ${users.length} active users`);

    if (users.length === 0) {
      console.log('✅ No active users to send to');
      return;
    }

    // 2. Send flow to each user
    const results = {
      success: [],
      failed: []
    };

    for (const user of users) {
      try {
        await sendFlowToUser(user);
        results.success.push(user.id);
        console.log(`✅ Sent to ${user.name} (${user.whatsapp_number})`);
      } catch (error) {
        results.failed.push({ user: user.id, error: error.message });
        console.error(`❌ Failed to send to ${user.name}:`, error.message);
      }

      // Rate limiting: Wait 100ms between sends
      await sleep(100);
    }

    // 3. Log results
    console.log('\n📈 Send Summary:');
    console.log(`✅ Success: ${results.success.length}`);
    console.log(`❌ Failed: ${results.failed.length}`);

    if (results.failed.length > 0) {
      console.log('\nFailed sends:');
      results.failed.forEach(f => console.log(`  - ${f.user}: ${f.error}`));
    }

    // 4. Save send log to database
    await logSendResults(results);

    console.log('\n🎉 Weekly send complete!');

  } catch (error) {
    console.error('💥 Fatal error during weekly send:', error);
    throw error;
  }
}

/**
 * Fetch all active users who should receive weekly check-ins
 */
async function fetchActiveUsers() {
  const { data, error } = await supabase
    .from(config.tables.weeklyQuestions)
    .select(`
      *,
      users:user_id (
        id,
        name,
        whatsapp_number,
        email
      )
    `)
    .eq('active', true);

  if (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }

  // Transform data into user objects with questions
  const users = data.map(record => ({
    id: record.user_id,
    name: record.users.name,
    whatsapp_number: record.users.whatsapp_number,
    email: record.users.email,
    quarter: record.quarter,
    week_number: calculateWeekNumber(record.quarter_start_date),
    category_1: record.category_1,
    category_2: record.category_2,
    category_3: record.category_3,
    question_1: record.question_1,
    question_2: record.question_2,
    question_3: record.question_3,
    streak_weeks: record.streak_weeks || 0
  }));

  // Filter out users in test mode if not TEST_MODE
  if (!config.features.testMode) {
    return users.filter(u => !config.testUsers.includes(u.id));
  }

  // In test mode, only send to test users
  if (config.features.testMode) {
    return users.filter(u => config.testUsers.includes(u.id));
  }

  return users;
}

/**
 * Send interactive message with 3 personalized questions to user
 */
async function sendFlowToUser(user) {
  // 1. In dry-run mode, just log instead of sending
  if (config.features.dryRun) {
    console.log(`[DRY RUN] Would send to ${user.whatsapp_number}`);
    console.log(`Questions: ${user.question_1}, ${user.question_2}, ${user.question_3}`);
    return;
  }

  // 2. Create message with personalized questions
  const messageText = `📊 *CEO Lab - Week ${user.week_number} Check-in*

Hi ${user.name.split(' ')[0]}! Time for your weekly check-in (${user.quarter}).

*Please answer these 3 questions:*

*1️⃣ ${user.category_1}*
${user.question_1}

*2️⃣ ${user.category_2}*
${user.question_2}

*3️⃣ ${user.category_3}*
${user.question_3}

_Reply with your answers in this format:_
1. [your answer]
2. [your answer]
3. [your answer]

Or reply to each question separately. Thanks! 🙏`;

  // 3. Send via WhatsApp Cloud API
  const url = `${config.whatsapp.baseUrl}/${config.whatsapp.apiVersion}/${config.whatsapp.phoneNumberId}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    to: user.whatsapp_number,
    type: 'text',
    text: {
      body: messageText
    }
  };

  const response = await axios.post(url, payload, {
    headers: {
      'Authorization': `Bearer ${config.whatsapp.accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (response.status !== 200) {
    throw new Error(`WhatsApp API error: ${response.status} ${response.statusText}`);
  }

  // 4. Log successful send
  await logSuccessfulSend(user);

  return response.data;
}

/**
 * Calculate current week number based on quarter start date
 */
function calculateWeekNumber(quarterStartDate) {
  const start = new Date(quarterStartDate);
  const now = new Date();
  const diffTime = Math.abs(now - start);
  const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
  return Math.min(diffWeeks, 13); // Max 13 weeks per quarter
}

/**
 * Log successful send to database
 */
async function logSuccessfulSend(user) {
  const { error } = await supabase
    .from('weekly_send_log')
    .insert({
      user_id: user.id,
      week_number: user.week_number,
      quarter: user.quarter,
      sent_at: new Date().toISOString(),
      status: 'sent'
    });

  if (error) {
    console.warn(`Failed to log send for user ${user.id}:`, error.message);
  }
}

/**
 * Log send results summary to database
 */
async function logSendResults(results) {
  const { error } = await supabase
    .from('weekly_send_summary')
    .insert({
      sent_at: new Date().toISOString(),
      total_users: results.success.length + results.failed.length,
      successful: results.success.length,
      failed: results.failed.length,
      failed_details: results.failed
    });

  if (error) {
    console.warn('Failed to log send summary:', error.message);
  }
}

/**
 * Sleep helper for rate limiting
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run if called directly
if (require.main === module) {
  sendWeeklyFlows()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
}

module.exports = {
  sendWeeklyFlows,
  sendFlowToUser
};
