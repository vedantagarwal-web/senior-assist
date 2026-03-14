# 📋 Demo Script for Hackathon Presentation

Use this script for your live demo or practice runs.

---

## 🎯 Pre-Demo Checklist

**15 minutes before:**
- [ ] Backend running: `cd backend && npm run dev`
- [ ] Frontend running: `cd frontend && npm run dev`
- [ ] ngrok running: `ngrok http 3001`
- [ ] Twilio webhook configured with ngrok URL
- [ ] Demo data seeded: `node backend/seedData.js`
- [ ] Test call to verify everything works
- [ ] Browser tabs ready:
  - Frontend homepage (localhost:3000)
  - Dashboard (localhost:3000/dashboard)
  - Backend terminal (showing logs)
  - GitHub repo
- [ ] Phone ready (use demo number +15551234567)
- [ ] Screen recording software ready

---

## 🎬 Demo Flow (5 Minutes)

### **Opening (30 seconds)**

> "Hi everyone! I'm [Your Name], and today I'm showing you **SeniorAssist** — a voice-powered AI assistant that helps seniors order food and book rides with just a phone call.
>
> **The problem:** 54 million Americans age 65 and older struggle with apps like DoorDash and Uber. They can't figure out the interfaces, forget passwords, and end up isolated and dependent.
>
> **But here's the thing:** They can all use a phone. That's what we built on."

### **Part 1: Setup (1 minute)**

[Switch to browser - show homepage]

> "First, a family member sets up their loved one's profile through our web portal. Let me show you..."

[Click "Get Started"]

**Step 1 - Senior Info:**
> "We collect basic information — name, phone number, home address..."

[Fill in form quickly]:
- Name: Margaret Thompson
- Phone: +15551234567
- Address: 742 Evergreen Terrace, Springfield, IL

[Click Next]

**Step 2 - Caregiver Info:**
> "...and the caregiver's contact information for notifications."

[Fill in]:
- Name: Sarah Thompson
- Email: sarah.thompson@example.com

[Click Next]

**Step 3 - Restaurants:**
> "Here's the key part: We save their favorite restaurants and usual orders. This makes ordering super simple."

[Show pre-filled restaurant]:
- Giuseppe's Pizza
- Usual Order: Large pepperoni pizza

> "Setup takes less than 3 minutes. Now watch what happens when Margaret calls..."

### **Part 2: Live Phone Demo (2 minutes)**

[Call the Twilio number from your phone]

**AI:** "Hello Margaret! How can I help you today?"

**You (as Margaret):** "I'm hungry."

**AI:** "Great! I can help you order food. Would you like to order from Giuseppe's Pizza? Or I can help you find somewhere else."

**You:** "Giuseppe's sounds good."

**AI:** "Perfect! Your usual order is large pepperoni pizza. Would you like that again, or something different?"

**You:** "That's perfect."

**AI:** "I'll order large pepperoni pizza from Giuseppe's and deliver it to 742 Evergreen Terrace. Should I place the order?"

**You:** "Yes, please."

**AI:** "Perfect! Your order from Giuseppe's Pizza has been placed and will be delivered to your home. You can expect it to arrive in about 30 to 45 minutes. Is there anything else I can help you with today?"

**You:** "No, thank you!"

**AI:** "Goodbye!"

[Hang up]

> "That's it! No app to download, no passwords to remember, no buttons to press. Just a natural conversation."

### **Part 3: Behind the Scenes (1 minute)**

[Switch to backend terminal]

> "In the background, our system is doing a lot. Look at these logs..."

[Point to logs showing]:
- Speech recognition
- Conversation state management
- Restaurant matching
- Order placement

[Switch to browser automation screenshot]

> "We use browser automation with Playwright to actually place the order on DoorDash — no API partnerships needed. This works TODAY."

[Switch to dashboard]

> "And the family can see all the activity in the dashboard. Order history, delivery status, everything in one place."

[Show dashboard with order]

### **Part 4: Business Case (45 seconds)**

> "Now, why does this matter as a business?
>
> **Market:** 54 million seniors in the US, growing by 10,000 every single day. That's a $30 billion market.
>
> **Revenue:** $20-30 per month per senior for families. But the real opportunity? Senior living facilities. $500-2000 per month for 50-200 residents.
>
> **Scalability:** We built this in 48 hours. With real API partnerships and proper payment infrastructure, this can scale to millions of users.
>
> **Impact:** We're not just building a product. We're giving independence back to millions of people."

### **Closing (15 seconds)**

> "SeniorAssist: Making technology disappear, so connection doesn't have to.
>
> We're live on GitHub, and we'd love your feedback. Thank you!"

---

## 🎨 Presentation Tips

### **Do:**
- Speak slowly and clearly
- Smile when doing the phone demo (it shows in your voice)
- Pause after big reveals (e.g., after showing the automation)
- Point to specific things on screen
- Keep it conversational, not rehearsed

### **Don't:**
- Rush through the voice demo
- Apologize for "rough edges" (it's an MVP!)
- Get lost in technical details
- Go over time
- Forget to mention the market size

---

## 🐛 Backup Plans

### **If Twilio fails:**
- Have a pre-recorded video of the call
- Narrate over it: "Here's what would happen..."

### **If browser automation fails:**
- Skip showing the Playwright execution
- Show a screenshot instead
- Say: "Normally this would navigate DoorDash automatically"

### **If ngrok expires:**
- Have a backup ngrok session running
- Or switch to recorded demo

### **If you forget your lines:**
- Have this script printed out
- Or on a tablet next to you
- Key points are bolded — hit those!

---

## 📊 Questions You'll Get

**Q: "Why not just teach them to use the app?"**
> "We've tried that. My grandma forgot her DoorDash password 6 times in one month. Phone calls are muscle memory for them — they've been using phones for 60+ years."

**Q: "How do you handle payments?"**
> "Family members set up payment methods through the portal. For production, we'd use Stripe's tokenization so we never store credit card numbers. Fully PCI compliant."

**Q: "What about fraud?"**
> "Only registered phone numbers can call. Every order sends a confirmation to the family's email. And we log everything for auditing."

**Q: "How does the browser automation work?"**
> "We use Playwright, which controls a headless Chrome browser. It navigates DoorDash just like a human would — but way faster. For production, we'd get official API access."

**Q: "What about Uber/rides?"**
> "Same architecture. Voice → AI → browser automation → order placed. We built DoorDash first because food is the #1 need. Uber is next."

**Q: "Can it handle mistakes/interruptions?"**
> "Yes! We have retry logic, error recovery, and a fallback to human operators. The AI is patient and can handle background noise."

**Q: "What's your go-to-market strategy?"**
> "Direct to consumer first via Google Ads + Facebook targeting adult children of aging parents. Then B2B sales to senior living facilities — that's where the big revenue is."

---

## 🎥 Video Recording Tips

If recording for submission:

**Setup:**
- 1080p minimum resolution
- Clear audio (use a mic, not laptop speakers)
- Close unnecessary tabs/apps
- Hide desktop clutter
- Use dark mode for terminals (easier on eyes)

**Recording:**
- Picture-in-picture yourself in corner
- Zoom in on important parts
- Keep it under 3 minutes
- Add subtitles if possible
- Background music (soft, non-distracting)

**Editing:**
- Cut out dead air/mistakes
- Add text overlays for key stats:
  - "54 million seniors"
  - "$30 billion market"
  - "Built in 48 hours"
- Show GitHub stars count
- End with call-to-action

---

## 🏆 Winning the Hackathon

**What judges look for:**
1. ✅ **Clear problem/solution** (you have this!)
2. ✅ **Working demo** (not just slides)
3. ✅ **Business potential** (huge market)
4. ✅ **Technical complexity** (voice AI + automation)
5. ✅ **Social impact** (accessibility, elderly care)

**Your edge:**
- This actually WORKS (not vaporware)
- Real market need (everyone has aging parents)
- Built in one weekend (shows execution speed)
- Scalable architecture (not a hack)

**Deliver with confidence. You built something real that helps real people. That's worth celebrating.**

---

Good luck! 🚀
