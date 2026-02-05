# CEO Lab - WhatsApp Dynamic Flows

## Overview
Automated system that sends personalized 3-question weekly check-ins to CEO Lab users via WhatsApp.

## How It Works

### User Journey
1. User completes baseline assessment on CEO Lab platform
2. Selects 3 focus areas (e.g., "Energy Management", "Trust Formula", "Strategic Clarity")
3. Every Monday at 9am, receives WhatsApp message with Flow
4. Opens Flow → Answers 3 personalized questions → Submits
5. Responses automatically saved to database
6. Dashboard updates with new data point

### Technical Flow
```
[CEO Lab DB] → [Cron Job] → [Flow Generator] → [WhatsApp API] → [User]
                                                                      ↓
[Dashboard] ← [Database] ← [Webhook Handler] ← [WhatsApp] ← [User Submits]
```

## Files

### Core Components
- `flow-generator.js` - Generates personalized Flow JSON for each user
- `send-weekly.js` - Cron job that sends flows to all active users
- `webhook-handler.js` - Receives and processes user responses
- `config.js` - Configuration and credentials
- `package.json` - Dependencies

### Database
- `database-schema.sql` - Tables for user questions and responses

### Documentation
- `SETUP.md` - Deployment instructions
- `API.md` - WhatsApp API reference

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create `.env` file:
```
WHATSAPP_ACCESS_TOKEN=your_token_here
WHATSAPP_PHONE_NUMBER_ID=your_phone_id_here
WHATSAPP_BUSINESS_ACCOUNT_ID=your_account_id_here
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
WEBHOOK_VERIFY_TOKEN=your_custom_verify_token
```

### 3. Set Up Database
```bash
# Run database migration
psql your_database < database-schema.sql
```

### 4. Test Flow Generation
```bash
# Generate test flow for a user
node flow-generator.js test
```

### 5. Deploy Webhook
```bash
# Deploy to Vercel
vercel deploy
```

### 6. Schedule Weekly Sends
```bash
# Set up cron job (Vercel Cron or local cron)
# Runs every Monday at 9am
0 9 * * 1 node send-weekly.js
```

## Configuration

### WhatsApp Credentials
From your Meta Developer setup:
- **Access Token:** Get from App Dashboard → WhatsApp → API Setup
- **Phone Number ID:** Your WhatsApp Business phone number ID
- **Business Account ID:** Your WhatsApp Business Account ID

### Webhook Setup
1. Deploy `webhook-handler.js` to public endpoint
2. Configure in Meta App Dashboard → WhatsApp → Configuration
3. Set Callback URL: `https://your-domain.com/webhook`
4. Subscribe to `messages` events

## Testing

### Test Flow Generation
```bash
node flow-generator.js --user-id=test-user-123
```

### Test Webhook Locally
```bash
# Use ngrok to expose localhost
ngrok http 3000

# Update webhook URL in Meta dashboard to ngrok URL
# Send test message via WhatsApp
```

### Test End-to-End
1. Add your phone number as test recipient in WhatsApp Manager
2. Create test user in database with 3 questions
3. Run: `node send-weekly.js --test`
4. Check WhatsApp for Flow
5. Submit answers
6. Verify webhook received and saved data

## Production Deployment

### Hosting Options

**Option A: Vercel (Recommended)**
- Serverless functions for webhook
- Vercel Cron for weekly sends
- Free tier sufficient for 100-500 users
- Deploy: `vercel deploy --prod`

**Option B: Railway**
- Always-on Node.js server
- Built-in cron scheduling
- $5/month
- Deploy: Connect GitHub repo

**Option C: AWS Lambda**
- Serverless functions
- EventBridge for scheduling
- Free tier covers most usage
- More setup required

### Monitoring
- Check logs daily for errors
- Monitor completion rates in dashboard
- Set up alerts for failed sends

## Cost Breakdown

### WhatsApp
- Free tier: 1,000 conversations/month
- 100 users × 4 weeks = 400 conversations/month
- **Cost: $0**

### Hosting
- Vercel: Free tier
- Railway: $5/month
- **Cost: $0-5/month**

### Total
**$0-5/month for 100 users**

## Troubleshooting

### Flows Not Sending
1. Check WhatsApp access token is valid
2. Verify phone number ID is correct
3. Check user is subscribed (not blocked)
4. Review API error responses

### Webhook Not Receiving
1. Verify webhook URL is publicly accessible
2. Check verify token matches Meta configuration
3. Ensure `messages` event is subscribed
4. Check webhook logs for errors

### Responses Not Saving
1. Check database connection
2. Verify response parsing logic
3. Check for validation errors
4. Review database logs

## API Reference

See `API.md` for detailed WhatsApp API documentation.

## Support

For issues or questions:
1. Check logs in `logs/` directory
2. Review WhatsApp API documentation
3. Test with single user first
4. Contact Niko for product questions
