# Hackathon Submission - SeniorAssist

**Voice-Powered AI Assistant for Seniors to Order Food & Rides**

---

## 🎯 The Problem

**54 million Americans age 65+** struggle with modern technology:
- Can't use delivery apps (DoorDash, Uber Eats)
- Can't book rides (Uber, Lyft)
- Rely on family/caregivers for basic services
- Risk isolation, malnutrition, missed appointments

**But they CAN use a phone.**

---

## 💡 Our Solution

**SeniorAssist** lets seniors order food and rides by simply calling a phone number and speaking naturally.

### How It Works:
1. **Family sets up** profile via web portal (addresses, favorites, payment)
2. **Senior calls** dedicated phone number
3. **AI assistant** guides conversation: "Would you like to order from Giuseppe's Pizza?"
4. **Browser automation** places order on DoorDash/Uber
5. **Food arrives** (or ride is booked) — no app needed!

---

## 🏗️ What We Built (48 Hours)

### 📱 Voice Interface
- Twilio integration for phone calls
- Natural speech recognition
- Patient, senior-friendly conversation flow
- Multi-turn context management

### 🤖 Browser Automation
- Playwright scripts to place DoorDash orders
- Handles address entry, menu navigation, checkout
- Screenshot debugging
- Extensible to Uber/Lyft

### 💻 Caregiver Portal (Next.js)
- Setup wizard for new seniors
- Add favorite restaurants + usual orders
- View order history
- Monitor activity

### 🗄️ Backend (Node.js + Express)
- RESTful API for user management
- SQLite database (users, restaurants, orders)
- Conversation state tracking
- Webhook handling for Twilio

---

## 🎨 Tech Stack

**Frontend:** Next.js, TypeScript, Tailwind CSS
**Backend:** Node.js, Express, SQLite
**Voice:** Twilio Voice API, Twilio TTS
**Automation:** Playwright (headless Chrome)
**Deployment:** ngrok (for demo), AWS/Render (production)

---

## 🎬 Demo Flow

**Scenario: Grandma wants pizza**

1. Calls number: `+1-XXX-XXX-XXXX`
2. **AI:** "Hello Margaret! How can I help you today?"
3. **Margaret:** "I'm hungry"
4. **AI:** "Would you like to order from Giuseppe's Pizza, or somewhere else?"
5. **Margaret:** "Giuseppe's sounds good"
6. **AI:** "Your usual order is large pepperoni pizza. Would you like that again?"
7. **Margaret:** "Yes please"
8. **AI:** "I'll order large pepperoni pizza from Giuseppe's and deliver it to 123 Maple Street. Should I place the order?"
9. **Margaret:** "Yes"
10. **AI:** "Perfect! Your order has been placed. It should arrive in about 30 to 45 minutes. Anything else?"
11. **Margaret:** "No, thank you!"
12. **AI:** "Goodbye!"

*Browser automation runs in background → Pizza arrives → Family sees order in dashboard*

---

## 💰 Business Model

### B2C (Direct to Consumer)
- **$20-30/month** per senior
- Family pays for peace of mind
- Target: Adult children of aging parents

### B2B (Senior Living Facilities)
- **$500-2000/month** per facility (50-200 residents)
- White-label solution
- Reduces staff burden for meal/transportation requests

### Market Size
- 54M seniors in US (growing 10,000/day)
- $30B senior care market
- 70% of seniors struggle with smartphones

---

## 🚧 What's Next (Production Roadmap)

### Phase 1 (MVP+):
- [ ] Real DoorDash API integration (partner access)
- [ ] Stripe payment tokenization (PCI compliant)
- [ ] SMS confirmations
- [ ] Email receipts to caregivers

### Phase 2:
- [ ] Uber/Lyft ride booking
- [ ] Grocery delivery (Instacart, Amazon Fresh)
- [ ] Prescription pickup coordination
- [ ] Calendar integration for appointments

### Phase 3:
- [ ] Multi-language support
- [ ] AI voice cloning (familiar voice for comfort)
- [ ] Smart scheduling ("Order my usual Thursday lunch")
- [ ] Integration with senior living facility systems

---

## 🏆 Why We'll Win

**1. Real Need**
- This isn't a solution looking for a problem
- 54M potential users, growing daily
- Families desperate for solutions

**2. Simple UX**
- No app to download
- No passwords to remember
- Just a phone call — technology seniors already know

**3. Scalable Tech**
- Modern stack, proven tools
- Browser automation works TODAY (no API partnerships needed to start)
- Easy to add new services (groceries, prescriptions, appointments)

**4. Business Model**
- B2C for early traction
- B2B for scale (senior facilities are sticky customers)
- Recurring revenue

**5. Defensibility**
- Voice conversation AI is hard to get right for seniors
- Multi-service integration creates moat
- Trust/safety requirements favor established players

---

## 👥 Team

**Vedant Agarwal** - Full-stack developer, UC Berkeley Math/Physics grad
- Built end-to-end in 48 hours
- Experience: AI, automation, product design
- Motivation: Saw grandparents struggle with DoorDash

---

## 🎥 Demo Links

- **Live Demo:** [https://senior-assist-demo.vercel.app](TODO)
- **Video Walkthrough:** [https://youtube.com/watch?v=...](TODO)
- **GitHub:** [https://github.com/vedantagarwal/senior-assist](TODO)

---

## 📞 Call to Action

**For Judges:**
Try it yourself! Call `+1-XXX-XXX-XXXX` and order pizza. (We'll walk you through setup)

**For Investors:**
This is a $100M+ opportunity. Let's talk.

**For Users:**
Sign up for early access: [seniorassist.com](TODO)

---

## 📊 Metrics (If We Had Users)

- Average call duration: 2-3 minutes
- Order success rate: 95%+
- Senior satisfaction: 4.8/5
- Caregiver peace of mind: Priceless

---

## 🙏 Acknowledgments

Built with:
- OpenClaw (AI agent framework)
- Twilio (voice infrastructure)
- Playwright (browser automation)
- Next.js (web framework)
- Lots of coffee ☕

---

**SeniorAssist: Making technology disappear, so connection doesn't have to.**

*Built in 48 hours for [Hackathon Name] by Vedant Agarwal*
