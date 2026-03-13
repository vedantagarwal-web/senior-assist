# SeniorAssist MVP - Setup Guide

Complete setup guide for the hackathon MVP.

## 🚀 Quick Start (5 minutes)

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Automation
cd ../automation
npm install
npx playwright install chromium

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment Variables

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
# Twilio (sign up at twilio.com)
TWILIO_ACCOUNT_SID=ACxxxx
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890

# OpenAI (for Whisper STT)
OPENAI_API_KEY=sk-xxx

# ElevenLabs (for TTS) - OPTIONAL for MVP
ELEVENLABS_API_KEY=your_key
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM

# Server
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### 3. Run the Stack

Open **3 terminals**:

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Expose via ngrok (for Twilio webhooks)
ngrok http 3001
```

### 4. Configure Twilio Webhook

1. Go to Twilio Console → Phone Numbers → Your Number
2. Under "Voice & Fax", set:
   - **A CALL COMES IN**: Webhook
   - **URL**: `https://YOUR-NGROK-URL.ngrok.io/voice/incoming`
   - **HTTP**: POST
3. Save

### 5. Test It Out

1. Open browser: `http://localhost:3000`
2. Click "Get Started" → Fill in setup form
3. Add your test phone number (use your real number for demo)
4. Add a favorite restaurant with DoorDash URL
5. Call the Twilio number from that phone
6. Follow the voice prompts!

---

## 🎯 Demo Flow

**Scenario: Order Pizza**

1. **You call** the Twilio number
2. **AI greets:** "Hello [Name]! How can I help you today?"
3. **You say:** "I'd like to order food"
4. **AI asks:** "Would you like to order from Giuseppe's Pizza, or somewhere else?"
5. **You say:** "Giuseppe's"
6. **AI confirms:** "Your usual order is large pepperoni pizza. Would you like that again?"
7. **You say:** "Yes"
8. **AI:** "I'll order large pepperoni pizza from Giuseppe's and deliver it to [address]. Should I place the order?"
9. **You say:** "Yes"
10. **AI:** "Perfect! Your order has been placed. It should arrive in about 30-45 minutes."

The browser automation will:
- Open DoorDash in headless browser
- Navigate to restaurant
- Add items to cart
- (For demo, stops here — in production would complete checkout)

---

## 📂 Project Structure

```
senior-assist-mvp/
├── backend/           # Express server + Twilio webhooks
│   ├── server.js      # Main server
│   ├── database.js    # SQLite operations
│   ├── voicePipeline.js # Conversation logic
│   └── data/          # SQLite database
├── frontend/          # Next.js caregiver portal
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── setup/page.tsx     # Setup wizard
│   │   └── dashboard/page.tsx # Order history
├── automation/        # Playwright browser automation
│   ├── doordash.js    # DoorDash order placement
│   └── screenshots/   # Debug screenshots
└── README.md
```

---

## 🔧 Troubleshooting

### Twilio webhook not working
- Check ngrok is running and URL is updated in Twilio
- Check backend server is running on port 3001
- View Twilio debugger for error logs

### Database errors
- Make sure `backend/data/` directory exists
- Delete `backend/data/senior-assist.db` to reset database

### Browser automation failing
- Run `npx playwright install chromium` again
- Check DoorDash URL is correct
- Set `headless: false` in `doordash.js` to debug visually

### Voice not working
- Twilio uses built-in TTS for MVP (no ElevenLabs needed)
- For better voice, set up ElevenLabs API key

---

## 🎨 Customization

### Change AI Voice
Edit `backend/server.js`, search for `voice: 'Polly.Joanna'`, options:
- Polly.Joanna (female, US)
- Polly.Matthew (male, US)
- Polly.Amy (female, UK)
- Google.en-US-Neural2-F (better quality, costs more)

### Add More Restaurants
Use the frontend setup wizard or directly via API:

```bash
curl -X POST http://localhost:3001/api/users/+1234567890/restaurants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Chipotle",
    "doordashUrl": "https://www.doordash.com/store/chipotle-...",
    "usualOrder": "Chicken burrito bowl"
  }'
```

### Modify Conversation Flow
Edit `backend/voicePipeline.js` → `handleFoodOrder()` function

---

## 🚢 Production Considerations

For a real deployment, you'd need:

1. **Auth & Security**
   - OAuth with DoorDash/Uber APIs
   - Stripe/Plaid for payment tokenization
   - Encrypted credential storage
   - PCI compliance

2. **Voice Quality**
   - Replace Twilio TTS with ElevenLabs or OpenAI TTS
   - Add Whisper API for better STT
   - Handle background noise, interruptions

3. **Scalability**
   - PostgreSQL instead of SQLite
   - Redis for conversation state
   - Queue system for automation jobs

4. **Monitoring**
   - Logging (Winston, Datadog)
   - Error tracking (Sentry)
   - Analytics (Mixpanel, Amplitude)

5. **UX Improvements**
   - SMS confirmations
   - Email receipts
   - Live order tracking
   - Fallback to human operator

---

## 💡 Hackathon Tips

**For Demo:**
- Use your own phone number as the test senior
- Pre-load 2-3 favorite restaurants
- Have DoorDash open in browser to show automation
- Record a video of the flow (judges love demos!)

**Pitch Angles:**
- 54M seniors in US, growing fast
- $30B senior care market
- Most seniors can use phones, not apps
- B2B opportunity: senior living facilities

**What to Emphasize:**
- Natural conversation (not rigid menu trees)
- No apps to download
- Family can manage remotely
- Privacy & security (family controls payment)

---

## 📞 Support

Built by Vedant Agarwal for hackathon/demo purposes.

Questions? Issues? Check:
- Twilio docs: https://www.twilio.com/docs
- Playwright docs: https://playwright.dev
- Next.js docs: https://nextjs.org

**Good luck! 🚀**
