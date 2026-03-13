# 🎙️ SeniorAssist MVP

> **Voice-powered AI assistant helping seniors order food and book rides with just a phone call.**

[![Demo](https://img.shields.io/badge/demo-live-green)](TODO)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 🎯 The Problem

54 million Americans age 65+ struggle with delivery apps and ride-sharing services. But they can use a phone.

**SeniorAssist** makes ordering food and rides as simple as making a phone call.

---

## ✨ Features

- 📞 **Voice Interface** — Natural conversation, no apps to learn
- 🍕 **Food Ordering** — DoorDash integration via browser automation
- 🚗 **Ride Booking** — Uber/Lyft support (coming soon)
- 👪 **Caregiver Portal** — Family members manage preferences & payment
- 📊 **Order History** — Track all activity in one dashboard
- 🔒 **Secure** — Tokenized payments, no credit cards stored

---

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
./QUICK_START.sh
```

### Option 2: Manual Setup

```bash
# Install all dependencies
npm run install:all

# Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your Twilio + OpenAI keys

# Start backend
cd backend && npm run dev

# Start frontend (new terminal)
cd frontend && npm run dev

# Expose with ngrok (new terminal)
ngrok http 3001
```

**Then:** Configure Twilio webhook (see [SETUP.md](SETUP.md))

---

## 📚 Documentation

- **[SETUP.md](SETUP.md)** — Detailed setup instructions
- **[TEST.md](TEST.md)** — Testing guide & scenarios
- **[HACKATHON.md](HACKATHON.md)** — Hackathon pitch & roadmap

---

## 🏗️ Architecture

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│   Senior    │──────▶│    Twilio    │──────▶│   Backend   │
│ (Phone Call)│       │  Voice API   │       │   Express   │
└─────────────┘       └──────────────┘       └──────┬──────┘
                                                     │
                                                     ▼
                                            ┌────────────────┐
                                            │  Conversation  │
                                            │     Logic      │
                                            └────────┬───────┘
                                                     │
                                    ┌────────────────┴────────────────┐
                                    ▼                                 ▼
                           ┌─────────────────┐              ┌──────────────┐
                           │    Playwright   │              │   Database   │
                           │ (Browser Auto)  │              │   (SQLite)   │
                           └────────┬────────┘              └──────────────┘
                                    │
                                    ▼
                            ┌───────────────┐
                            │   DoorDash    │
                            │  (Order Food) │
                            └───────────────┘
```

### Tech Stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, SQLite
- **Voice:** Twilio Voice API + TTS
- **Automation:** Playwright (headless Chrome)
- **Optional:** OpenAI Whisper (STT), ElevenLabs (TTS)

---

## 🎬 Demo Flow

**Scenario: Senior orders pizza**

1. **📞 Senior calls** Twilio number
2. **🤖 AI greets:** "Hello Margaret! How can I help you today?"
3. **👤 Senior:** "I'm hungry"
4. **🤖 AI:** "Would you like to order from Giuseppe's Pizza?"
5. **👤 Senior:** "Yes"
6. **🤖 AI:** "Your usual order is large pepperoni. Would you like that again?"
7. **👤 Senior:** "Yes please"
8. **🤖 AI:** "I'll place the order for delivery to your address. Confirm?"
9. **👤 Senior:** "Yes"
10. **🤖 AI:** "Perfect! Your pizza will arrive in 30-45 minutes."

**Behind the scenes:**
- Browser automation navigates DoorDash
- Order placed automatically
- Caregiver receives email confirmation
- Order appears in dashboard

---

## 📂 Project Structure

```
senior-assist-mvp/
├── backend/              # Express server
│   ├── server.js         # Twilio webhooks + API
│   ├── database.js       # SQLite operations
│   ├── voicePipeline.js  # Conversation logic
│   └── data/             # Database files
├── frontend/             # Next.js web app
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── setup/page.tsx        # Setup wizard
│   │   └── dashboard/page.tsx    # Order history
├── automation/           # Browser automation
│   ├── doordash.js       # DoorDash order script
│   └── screenshots/      # Debug screenshots
├── SETUP.md              # Setup guide
├── TEST.md               # Testing guide
├── HACKATHON.md          # Pitch deck
└── QUICK_START.sh        # One-click setup
```

---

## 🧪 Testing

Run the test suite:

```bash
# Test backend API
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Senior","phone":"+15555551234",...}'

# Test browser automation
cd automation
node doordash.js '{"restaurantUrl":"...","items":["Pizza"],...}'

# Test full voice flow (requires Twilio)
# See TEST.md for complete guide
```

---

## 🛣️ Roadmap

### MVP (Current)
- [x] Voice calling via Twilio
- [x] DoorDash browser automation
- [x] Caregiver web portal
- [x] Order history tracking

### Phase 1 (Production)
- [ ] DoorDash API integration (partner access)
- [ ] Stripe payment tokenization
- [ ] SMS/Email confirmations
- [ ] Better voice quality (ElevenLabs)

### Phase 2 (Scale)
- [ ] Uber/Lyft ride booking
- [ ] Grocery delivery (Instacart)
- [ ] Multi-language support
- [ ] Smart scheduling

### Phase 3 (Enterprise)
- [ ] Senior living facility integrations
- [ ] White-label solution
- [ ] Analytics dashboard
- [ ] HIPAA compliance

---

## 💰 Business Model

**B2C:** $20-30/month per senior (family pays)
**B2B:** $500-2000/month per facility (50-200 residents)

**Market:** 54M seniors in US, $30B senior care market

---

## 🤝 Contributing

This is a hackathon MVP. Contributions welcome!

```bash
git clone https://github.com/vedantagarwal/senior-assist.git
cd senior-assist
npm run install:all
# Make changes
git commit -am "Your feature"
git push
```

---

## 📝 License

MIT License - see [LICENSE](LICENSE) for details

---

## 👤 Author

**Vedant Agarwal**
- UC Berkeley (Math & Physics)
- [vedantagarwal.xyz](https://vedantagarwal.xyz)
- [@V_Agarwal1](https://twitter.com/V_Agarwal1)

---

## 🙏 Acknowledgments

- OpenClaw for agent framework
- Twilio for voice infrastructure
- Playwright for browser automation
- Next.js team for amazing DX

---

**Making technology disappear, so connection doesn't have to.** ❤️

*Built in 48 hours for [Hackathon Name]*

