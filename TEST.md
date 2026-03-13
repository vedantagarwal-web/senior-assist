# Testing Guide

Quick test scenarios for the MVP.

## 🧪 Test 1: API Endpoints (No Twilio needed)

Test the backend APIs directly:

```bash
# Start backend
cd backend
npm run dev

# In another terminal, test user creation:
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Senior",
    "phone": "+15555551234",
    "address": "123 Main St, San Francisco, CA 94105",
    "email": "senior@test.com",
    "caregiverName": "Test Caregiver",
    "caregiverEmail": "caregiver@test.com"
  }'

# Test fetching user:
curl http://localhost:3001/api/users/+15555551234

# Add restaurant:
curl -X POST http://localhost:3001/api/users/+15555551234/restaurants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Pizza",
    "doordashUrl": "https://www.doordash.com/store/test",
    "usualOrder": "Large pepperoni pizza"
  }'

# Check order history:
curl http://localhost:3001/api/users/+15555551234/orders
```

Expected: All endpoints return `{"success": true, ...}`

---

## 🧪 Test 2: Browser Automation (Standalone)

Test DoorDash automation without the phone system:

```bash
cd automation

# Test order placement (demo mode, won't actually submit):
node doordash.js '{
  "restaurantUrl": "https://www.doordash.com/store/chipotle-mexican-grill-123456/",
  "items": ["Chicken Burrito Bowl"],
  "deliveryAddress": "123 Main St, San Francisco, CA",
  "userName": "Test User"
}'
```

Expected:
- Browser opens (if `headless: false`)
- Navigates to restaurant
- Adds items to cart
- Screenshots saved to `automation/screenshots/`
- Returns `{"success": true, "orderId": "DEMO-..."}`

**Note:** Use a real DoorDash restaurant URL for best results.

---

## 🧪 Test 3: Frontend Portal

```bash
cd frontend
npm run dev
```

Open: http://localhost:3000

### Test Flow:
1. Click "Get Started"
2. Fill in Step 1 (Senior info) → Next
3. Fill in Step 2 (Caregiver info) → Next
4. Add at least 1 restaurant with:
   - Name: "Chipotle"
   - URL: (find real Chipotle DoorDash URL in your area)
   - Usual: "Chicken burrito bowl"
5. Click "Complete Setup"
6. Should redirect to Dashboard
7. Enter phone number from setup
8. Click "Load" → Should show profile

---

## 🧪 Test 4: Full Voice Flow (Requires Twilio)

### Setup:
1. Sign up for Twilio (free trial works)
2. Get a phone number with voice capabilities
3. Configure webhook (see SETUP.md)
4. Update `backend/.env` with Twilio credentials

### Test:
1. Start backend: `cd backend && npm run dev`
2. Start ngrok: `ngrok http 3001`
3. Update Twilio webhook to ngrok URL
4. Call Twilio number from your phone
5. Listen for greeting
6. Say "I'd like to order food"
7. Follow prompts

Expected conversation:
```
AI: "Hello Test Senior! How can I help you today?"
You: "I want to order food"
AI: "Would you like to order from Chipotle, or somewhere else?"
You: "Chipotle"
AI: "Your usual order is chicken burrito bowl. Would you like that again?"
You: "Yes"
AI: "I'll order chicken burrito bowl and deliver to [address]. Should I place the order?"
You: "Yes"
AI: "Perfect! Your order has been placed. Should arrive in 30-45 minutes."
```

Check:
- Database has new order: `curl http://localhost:3001/api/users/YOUR_PHONE/orders`
- Frontend dashboard shows order history

---

## 🧪 Test 5: Error Handling

Test failure scenarios:

### Unknown phone number:
```bash
# Call from a number not in database
# Expected: "We don't have your number on file..."
```

### No restaurants configured:
```bash
# Remove restaurants, then call
# Expected: "I don't have any favorite restaurants saved..."
```

### Interrupted speech:
```bash
# Say nothing when AI asks a question
# Expected: Times out, asks again
```

---

## 📊 Debugging

### View backend logs:
```bash
cd backend
npm run dev
# Watch terminal for request logs
```

### View Twilio logs:
1. Go to Twilio Console
2. Monitor → Logs → Calls
3. Click on your test call
4. Check webhook requests/responses

### View browser automation:
```bash
# In automation/doordash.js, set:
headless: false  // See browser UI
slowMo: 500      // Slow down steps
```

### Check database:
```bash
cd backend
sqlite3 data/senior-assist.db

.tables
SELECT * FROM users;
SELECT * FROM orders;
SELECT * FROM favorite_restaurants;
.quit
```

---

## ✅ Test Checklist for Demo

Before showing to judges/users:

- [ ] Backend starts without errors
- [ ] Frontend loads at localhost:3000
- [ ] Can create user via web portal
- [ ] Can add restaurants via web portal
- [ ] Twilio webhook responds (check Twilio logs)
- [ ] Phone call greeting works
- [ ] Can navigate conversation via voice
- [ ] Browser automation runs (even if demo mode)
- [ ] Order appears in database
- [ ] Order appears in dashboard
- [ ] No errors in console

---

## 🎬 Recording Demo Video

For best demo:

1. **Screen record** browser with portal open
2. **Picture-in-picture** yourself making the call
3. **Show terminal** with backend logs running
4. **Narrate** each step:
   - "I'm calling the number..."
   - "AI is greeting me and asking what I need..."
   - "I'm ordering from my favorite restaurant..."
   - "Behind the scenes, browser automation is running..."
   - "Order confirmed! Now it appears in the dashboard..."

Tools:
- macOS: QuickTime / ScreenFlow
- Windows: OBS Studio
- Linux: SimpleScreenRecorder

Length: 2-3 minutes max

---

## 🐛 Common Issues

**"Cannot find module"**
→ Run `npm run install:all` from root

**Port 3001 already in use**
→ Kill existing process: `lsof -ti:3001 | xargs kill -9`

**Twilio webhook timeout**
→ Check ngrok is running, URL is correct, no firewall blocking

**Database locked**
→ Close any DB browser tools, restart backend

**Browser automation stuck**
→ Check DoorDash URL is valid, set `headless:false` to debug

---

Good luck with your demo! 🚀
