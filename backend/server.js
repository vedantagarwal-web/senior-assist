require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');
const VoiceResponse = twilio.twiml.VoiceResponse;
const db = require('./database');
const voicePipeline = require('./voicePipeline');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Initialize database
db.init();

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Twilio webhook - incoming call
app.post('/voice/incoming', async (req, res) => {
  const twiml = new VoiceResponse();
  const fromNumber = req.body.From;
  
  console.log(`Incoming call from: ${fromNumber}`);
  
  // Look up user by phone number
  const user = await db.getUserByPhone(fromNumber);
  
  if (!user) {
    twiml.say({
      voice: 'Polly.Joanna'
    }, 'Hello! We don\'t have your number on file. Please ask your family member to set up an account first. Goodbye!');
    res.type('text/xml');
    res.send(twiml.toString());
    return;
  }
  
  // Greet user and start conversation
  twiml.say({
    voice: 'Polly.Joanna'
  }, `Hello ${user.name}! How can I help you today? You can say things like "order food" or "get a ride".`);
  
  // Gather speech input
  twiml.gather({
    input: 'speech',
    action: '/voice/process',
    speechTimeout: 'auto',
    language: 'en-US'
  });
  
  res.type('text/xml');
  res.send(twiml.toString());
});

// Process speech input
app.post('/voice/process', async (req, res) => {
  const speechResult = req.body.SpeechResult;
  const callSid = req.body.CallSid;
  const fromNumber = req.body.From;
  
  console.log(`Speech received: "${speechResult}" from ${fromNumber}`);
  
  const user = await db.getUserByPhone(fromNumber);
  
  if (!user) {
    const twiml = new VoiceResponse();
    twiml.say('Sorry, I encountered an error. Please try again later.');
    twiml.hangup();
    res.type('text/xml');
    res.send(twiml.toString());
    return;
  }
  
  // Process with voice pipeline (OpenClaw agent + automation)
  const response = await voicePipeline.process(speechResult, user, callSid);
  
  const twiml = new VoiceResponse();
  twiml.say({
    voice: 'Polly.Joanna'
  }, response.message);
  
  if (response.shouldContinue) {
    // Continue gathering input
    twiml.gather({
      input: 'speech',
      action: '/voice/process',
      speechTimeout: 'auto',
      language: 'en-US'
    });
  } else {
    twiml.say('Goodbye!');
    twiml.hangup();
  }
  
  res.type('text/xml');
  res.send(twiml.toString());
});

// API: Create user profile
app.post('/api/users', async (req, res) => {
  try {
    const { name, phone, address, email, caregiverName, caregiverEmail } = req.body;
    const userId = await db.createUser({
      name,
      phone,
      address,
      email,
      caregiverName,
      caregiverEmail
    });
    res.json({ success: true, userId });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Get user profile
app.get('/api/users/:phone', async (req, res) => {
  try {
    const user = await db.getUserByPhone(req.params.phone);
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Add favorite restaurant
app.post('/api/users/:phone/restaurants', async (req, res) => {
  try {
    const { name, doordashUrl, usualOrder } = req.body;
    await db.addFavoriteRestaurant(req.params.phone, {
      name,
      doordashUrl,
      usualOrder
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error adding restaurant:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Get order history
app.get('/api/users/:phone/orders', async (req, res) => {
  try {
    const orders = await db.getOrderHistory(req.params.phone);
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Senior Assist backend running on port ${PORT}`);
  console.log(`📞 Twilio webhook: http://localhost:${PORT}/voice/incoming`);
});
