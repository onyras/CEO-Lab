# WhatsApp Weekly Check-In Flows

**Last Updated:** 2026-02-04

This document defines the conversational flows for WhatsApp-based weekly check-ins using Twilio.

---

## Overview

**Trigger:** Every Sunday at 9:00 AM (user's timezone)

**Duration:** ~3 minutes

**Questions:** 3 per week (user-selected focus areas)

**Technology:** Twilio WhatsApp API

---

## User Setup Flow

### Initial Opt-In (One-time)

```
[System → User]
👋 Welcome to CEO Lab!

To receive your weekly check-ins via WhatsApp, please reply with YES to opt in.

You'll get 3 quick questions every Sunday at 9 AM.
```

**User replies:** "YES" / "yes" / "Y"

```
[System → User]
✓ You're all set!

Your first weekly check-in will arrive this Sunday at 9 AM.

You can opt out anytime by replying STOP.
```

---

## Weekly Check-In Flow

### Sunday 9:00 AM - Question 1

```
[System → User]
Good morning! 🌅 Time for your weekly check-in.

Let's start with Energy Management:

📊 Q1/3: This week, how many hours of Deep Work did you complete?

Reply with a number (e.g., "12")
```

**User replies:** "12"

```
[System → User]
✓ 12 hours of deep work logged.

Moving on...
```

---

### Question 2

```
[System → User]
📊 Q2/3: How many commitments did you keep vs. break this week?

Reply with format: kept/broke (e.g., "5/1" or "all/none")
```

**User replies:** "5/1"

```
[System → User]
✓ 5 kept, 1 broke. Got it!

Last one...
```

---

### Question 3

```
[System → User]
📊 Q3/3: Did you review your strategy this week?

Reply: YES or NO
```

**User replies:** "YES"

```
[System → User]
✓ Strategy review: Yes

All done! ✅
```

---

### Completion Summary

```
[System → User]
🎉 Week 8 complete!

Quick summary:
• Deep Work: 12 hours (↑ from last week's 10)
• Commitments: 5 kept, 1 broke (83%)
• Strategy Review: Yes (✓ 3 weeks in a row)

🔥 8-week streak! Keep going!

View full insights: https://ceo-lab.vercel.app/dashboard
```

---

## Question Type Templates

### 1. Number Questions
**Example:** "How many hours of Deep Work did you complete?"

**Valid responses:**
- "12"
- "12 hours"
- "twelve"
- "0"

**Error handling:**
```
[System → User]
I didn't catch that. Please reply with a number.

Example: "8" or "8 hours"
```

---

### 2. Yes/No Questions
**Example:** "Did you hold your weekly tactical meeting?"

**Valid responses:**
- "yes" / "YES" / "y" / "Y"
- "no" / "NO" / "n" / "N"

**Error handling:**
```
[System → User]
Please reply YES or NO
```

---

### 3. Ratio Questions
**Example:** "How many commitments did you keep vs. break?"

**Valid responses:**
- "5/1"
- "5 / 1"
- "5 kept, 1 broke"
- "all" (converts to current count / 0)
- "none" (converts to 0 / current count)

**Error handling:**
```
[System → User]
Please reply with format: kept/broke

Example: "5/1" or "all/none"
```

---

### 4. Percentage Questions
**Example:** "What % of time did you spend working ON vs. IN?"

**Valid responses:**
- "70"
- "70%"
- "70/30" (ON/IN ratio)

**Error handling:**
```
[System → User]
Please reply with a percentage (0-100)

Example: "60" or "60%"
```

---

### 5. Multiple Choice Questions
**Example:** "Did you ask more questions or give more answers in meetings?"

**Valid responses:**
- "questions" / "q"
- "answers" / "a"
- "balanced" / "b"

**Error handling:**
```
[System → User]
Please choose:
- Questions
- Answers
- Balanced
```

---

## Edge Cases & Error Handling

### User Replies Out of Order

```
[User sends message while not in check-in state]

[System → User]
Hey! Your next weekly check-in is on Sunday at 9 AM.

Want to change your schedule or focus areas? Visit your dashboard:
https://ceo-lab.vercel.app/dashboard
```

---

### User Replies After Timeout (24 hours)

```
[System → User]
This week's check-in has expired. No worries!

Your next check-in will arrive Sunday at 9 AM.

🔥 Current streak: 7 weeks
```

---

### User Skips a Question

```
[No response after 1 hour]

[System → User]
Still there? 👋

Reply to continue your check-in, or I'll catch you next Sunday!
```

---

### User Replies "STOP"

```
[System → User]
You've been unsubscribed from weekly check-ins.

To re-enable, visit your dashboard:
https://ceo-lab.vercel.app/dashboard
```

---

### User Replies "HELP"

```
[System → User]
CEO Lab Weekly Check-Ins

Every Sunday at 9 AM, I'll send you 3 quick questions to track your leadership growth.

Commands:
• Reply STOP to unsubscribe
• Visit dashboard: https://ceo-lab.vercel.app/dashboard
```

---

## Conversation State Machine

```
States:
1. IDLE - Not in check-in
2. WAITING_Q1 - Expecting answer to Q1
3. WAITING_Q2 - Expecting answer to Q2
4. WAITING_Q3 - Expecting answer to Q3
5. COMPLETED - Check-in complete

Transitions:
IDLE → WAITING_Q1 (Sunday 9am trigger)
WAITING_Q1 → WAITING_Q2 (valid answer)
WAITING_Q2 → WAITING_Q3 (valid answer)
WAITING_Q3 → COMPLETED (valid answer)
COMPLETED → IDLE (summary sent)
ANY → IDLE (timeout after 24 hours)
```

---

## Database Schema Updates

```sql
-- Track WhatsApp conversation state
CREATE TABLE whatsapp_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  conversation_state TEXT DEFAULT 'IDLE',
  current_question_index INTEGER DEFAULT 0,
  week_number INTEGER,
  responses JSONB DEFAULT '{}',
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Track opt-in status
ALTER TABLE user_profiles ADD COLUMN whatsapp_phone TEXT;
ALTER TABLE user_profiles ADD COLUMN whatsapp_opted_in BOOLEAN DEFAULT FALSE;
ALTER TABLE user_profiles ADD COLUMN whatsapp_timezone TEXT DEFAULT 'UTC';
```

---

## Twilio Integration

### Setup

```typescript
// lib/twilio.ts
import twilio from 'twilio'

export const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER // e.g., 'whatsapp:+14155238886'
```

### Send Message

```typescript
async function sendWhatsAppMessage(to: string, body: string) {
  await twilioClient.messages.create({
    from: TWILIO_WHATSAPP_NUMBER,
    to: `whatsapp:${to}`,
    body: body
  })
}
```

### Webhook Endpoint

```typescript
// app/api/whatsapp/route.ts
export async function POST(request: Request) {
  const formData = await request.formData()
  const from = formData.get('From') // whatsapp:+1234567890
  const body = formData.get('Body') // User's message

  // Parse phone number
  const phoneNumber = from.replace('whatsapp:', '')

  // Get user by phone number
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('whatsapp_phone', phoneNumber)
    .single()

  if (!profile) {
    // Unknown user
    await sendWhatsAppMessage(phoneNumber,
      "I don't recognize this number. Please link it in your CEO Lab dashboard first.")
    return NextResponse.json({ status: 'ok' })
  }

  // Get conversation state
  const { data: conversation } = await supabase
    .from('whatsapp_conversations')
    .select('*')
    .eq('user_id', profile.id)
    .single()

  // Handle message based on state
  await handleConversationMessage(profile, conversation, body)

  return NextResponse.json({ status: 'ok' })
}
```

---

## Cron Job - Weekly Trigger

```typescript
// app/api/cron/weekly-checkins/route.ts
export async function GET() {
  // Get all users with whatsapp_opted_in = true
  const { data: users } = await supabase
    .from('user_profiles')
    .select('id, whatsapp_phone, whatsapp_timezone')
    .eq('whatsapp_opted_in', true)
    .eq('subscription_status', 'active')

  for (const user of users) {
    // Check if it's Sunday 9 AM in user's timezone
    const userTime = DateTime.now().setZone(user.whatsapp_timezone)

    if (userTime.weekday === 7 && userTime.hour === 9) {
      // Trigger check-in
      await initiateWeeklyCheckIn(user)
    }
  }

  return NextResponse.json({ triggered: users.length })
}
```

**Vercel Cron Config:**
```json
// vercel.json
{
  "crons": [{
    "path": "/api/cron/weekly-checkins",
    "schedule": "0 * * * *" // Every hour (checks timezone internally)
  }]
}
```

---

## Cost Estimate

**Twilio WhatsApp Pricing:**
- Inbound message: $0.005
- Outbound message: $0.0085

**Per user per week:**
- 5 outbound messages (Q1, Q2, Q3, 2 confirmations, 1 summary)
- 3 inbound messages (user replies)
- Total: (5 × $0.0085) + (3 × $0.005) = $0.0575/week

**Per user per year:**
- 52 weeks × $0.0575 = **~$3/user/year**

---

## Testing

### Test with Twilio Sandbox

1. Join sandbox: Send "join [sandbox-keyword]" to Twilio's WhatsApp number
2. Test conversation flows
3. Verify message parsing
4. Check database updates
5. Test error handling

### Test Checklist

- [ ] User receives Q1 at correct time
- [ ] System parses number responses correctly
- [ ] System parses yes/no responses correctly
- [ ] System handles invalid responses gracefully
- [ ] Completion summary shows correct data
- [ ] Streak counter updates correctly
- [ ] Database stores responses properly
- [ ] Timeout works after 24 hours
- [ ] STOP command unsubscribes user
- [ ] HELP command shows help text

---

## Phase 2 Implementation Checklist

- [ ] Set up Twilio account
- [ ] Create WhatsApp Business profile
- [ ] Configure Twilio WhatsApp sandbox
- [ ] Add database schema for conversations
- [ ] Build WhatsApp webhook endpoint
- [ ] Implement message parser
- [ ] Create conversation state machine
- [ ] Build cron job for weekly trigger
- [ ] Add opt-in flow in dashboard
- [ ] Test all conversation flows
- [ ] Deploy to production
- [ ] Monitor first 100 check-ins
- [ ] Iterate based on user feedback

---

**Ready to implement?** Start with the Twilio sandbox and dashboard opt-in flow, then build the webhook endpoint and conversation logic.
