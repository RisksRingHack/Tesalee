// Import the Twilio module
const twilio = require('twilio');

// Your Account SID and Auth Token from twilio.com/console
// It is best practice to store these in environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID || 'YOUR_ACCOUNT_SID_HERE';
const authToken = process.env.TWILIO_AUTH_TOKEN || 'YOUR_AUTH_TOKEN_HERE';

// Initialize the client
const client = twilio(accountSid, authToken);

// Function to send SMS
function sendSMS() {
  client.messages
    .create({
      body: 'Hello from JavaScript! This is your original SMS message.',
      from: '+12345678901', // Your Twilio phone number
      to: '+19876543210'    // The recipient's phone number
    })
    .then(message => console.log(`SMS sent successfully! SID: ${message.sid}`))
    .catch(error => console.error(`Failed to send SMS: ${error.message}`));
}

// Execute the function
sendSMS();