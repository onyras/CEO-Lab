/**
 * Test script to simulate WhatsApp button click
 * Sends a mock webhook payload to test the interactive response handler
 */

const axios = require('axios');

// Simulated webhook payload (what Meta sends when user clicks button)
const mockButtonClick = {
  object: 'whatsapp_business_account',
  entry: [{
    id: 'WHATSAPP_BUSINESS_ACCOUNT_ID',
    changes: [{
      value: {
        messaging_product: 'whatsapp',
        metadata: {
          display_phone_number: '15558161562',
          phone_number_id: '1006501509209512'
        },
        contacts: [{
          profile: {
            name: 'Test User'
          },
          wa_id: '4915730125029'
        }],
        messages: [{
          from: '4915730125029',
          id: 'wamid.TEST123',
          timestamp: Date.now().toString(),
          type: 'interactive',
          interactive: {
            type: 'button_reply',
            button_reply: {
              id: 'q1_0_00000000-0000-0000-0000-000000000001_1', // Format: q{questionNum}_{optionIndex}_{userId}_{weekNumber}
              title: 'A: Water kettle'
            }
          }
        }]
      },
      field: 'messages'
    }]
  }]
};

async function testButtonClick() {
  console.log('🧪 Simulating button click...\n');
  console.log('📋 Mock payload:');
  console.log(JSON.stringify(mockButtonClick, null, 2));
  console.log('\n📤 Sending to webhook...\n');

  try {
    // Send to local webhook (if running)
    const response = await axios.post('http://localhost:3000/webhook', mockButtonClick, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Webhook response:', response.status, response.data);
    console.log('\n💡 Check your webhook logs to see how it processed the button click!');
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Local webhook not running. Start it with:');
      console.log('   cd whatsapp_flows && node webhook-handler.js');
    } else {
      console.error('❌ Error:', error.message);
      if (error.response) {
        console.error('Response:', error.response.data);
      }
    }
  }
}

testButtonClick();
