const express = require('express');
const cors = require('cors');
const path = require('path');

const twilio = require('twilio');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Twilio credentials via environment variables (recommended)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Twilio sender number
const fromNumber = process.env.TWILIO_FROM_NUMBER;

if (!accountSid || !authToken || !fromNumber) {
  console.error('Missing Twilio env vars. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER');
  console.error('Example (Windows PowerShell):');
  console.error('$env:TWILIO_ACCOUNT_SID="ACxxxxxxxx"');
  console.error('$env:TWILIO_AUTH_TOKEN="xxxx"');
  console.error('$env:TWILIO_FROM_NUMBER="+1XXXXXXXXXX"');
  process.exit(1);
}

const client = twilio(accountSid, authToken);


// Health check
app.get('/health', (req, res) => res.status(200).json({ ok: true }));

// Frontend -> this endpoint
// POST /api/send-sms  { to: string, message: string }
app.post('/api/send-sms', async (req, res) => {
  try {
    const to = String(req.body?.to || '').trim();
    const message = String(req.body?.message || '').trim();

    if (!to) return res.status(400).send('Missing "to"');
    if (!message) return res.status(400).send('Missing "message"');

    const twilioMsg = await client.messages.create({
      body: message,
      from: fromNumber,
      to
    });

    return res.status(200).json({ ok: true, sid: twilioMsg.sid });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || String(err) });
  }
});

// Serve static files (so /index.html loads)
app.use(express.static(path.join(__dirname)));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`SMS server running on http://localhost:${port}`);
});

