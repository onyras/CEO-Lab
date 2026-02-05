require('dotenv').config();

module.exports = {
  // WhatsApp Configuration
  whatsapp: {
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID,
    apiVersion: 'v18.0',
    baseUrl: 'https://graph.facebook.com'
  },

  // Supabase Configuration
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY
  },

  // Webhook Configuration
  webhook: {
    port: process.env.PORT || 3000,
    verifyToken: process.env.WEBHOOK_VERIFY_TOKEN || 'ceo_lab_verify_token_2026',
    path: '/webhook'
  },

  // Scheduling Configuration
  schedule: {
    // Run every Monday at 9:00 AM
    cron: '0 9 * * 1',
    timezone: 'Europe/Berlin'
  },

  // Flow Configuration
  flow: {
    version: '7.3',
    name: 'CEO Lab Weekly Check-in',
    categories: ['APPOINTMENT_BOOKING'], // Flow category
    // Flow will be created dynamically per user
  },

  // Database Tables
  tables: {
    users: 'users',
    weeklyQuestions: 'user_weekly_questions',
    weeklyResponses: 'weekly_responses',
    assessments: 'baseline_responses'
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    directory: './logs'
  },

  // Feature Flags
  features: {
    dryRun: process.env.DRY_RUN === 'true', // Test mode, don't actually send
    testMode: process.env.TEST_MODE === 'true' // Send only to test users
  },

  // Test Users (for testing before production)
  testUsers: process.env.TEST_USERS ? process.env.TEST_USERS.split(',') : []
};
