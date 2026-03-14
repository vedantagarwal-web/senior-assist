#!/bin/bash

# Autonomous Mode Demo Script
# Shows off OpenClaw-level features

set -e

echo "🤖 SeniorAssist - Autonomous Mode Demo"
echo "======================================="
echo ""

# Check if OpenClaw Gateway is running
if ! openclaw gateway status &>/dev/null; then
    echo "❌ OpenClaw Gateway is not running!"
    echo "   Start it with: openclaw gateway start"
    exit 1
fi

echo "✅ OpenClaw Gateway is running"
echo ""

# Step 1: Setup cron jobs
echo "📅 Step 1: Setting up autonomous cron jobs..."
cd backend
node setupCron.js
echo ""

# Step 2: Seed demo data
echo "🌱 Step 2: Seeding demo data with order history..."
node seedData.js
echo ""

# Step 3: Run monitoring cycle manually
echo "🔍 Step 3: Running autonomous monitoring cycle..."
echo "   (This normally runs every 2 hours automatically)"
node autonomousMonitor.js
echo ""

# Step 4: Test OpenClaw agent
echo "🧠 Step 4: Testing OpenClaw agent integration..."
echo "   Enable agent mode:"
echo "   export USE_OPENCLAW_AGENT=true"
export USE_OPENCLAW_AGENT=true
echo ""
echo "   Agent mode enabled! Now when users call, they'll talk to a real AI."
echo ""

# Step 5: Show active cron jobs
echo "⏰ Step 5: Viewing active cron jobs..."
openclaw cron list
echo ""

# Step 6: Show active sessions
echo "📊 Step 6: Active OpenClaw sessions..."
openclaw sessions list --kinds isolated --limit 5
echo ""

echo "═══════════════════════════════════════"
echo "✅ Autonomous Mode Demo Complete!"
echo "═══════════════════════════════════════"
echo ""
echo "🚀 What's running autonomously:"
echo "   • Proactive order suggestions (11 AM, 5 PM, 7 PM)"
echo "   • Health checks & self-healing (every hour)"
echo "   • Pattern learning (2 AM daily)"
echo "   • Weekly summaries (Sunday 8 PM)"
echo "   • Emergency monitoring (every 15 min)"
echo ""
echo "🧠 Agent mode enabled:"
echo "   • Conversations use real AI (Claude Sonnet)"
echo "   • Context-aware responses"
echo "   • Multi-turn learning"
echo ""
echo "📝 Next steps:"
echo "   1. Start backend: npm run dev"
echo "   2. Make a test call to see AI agent in action"
echo "   3. Watch cron jobs run: openclaw cron list"
echo "   4. Check health: node autonomousMonitor.js"
echo ""
echo "📚 Full docs: AUTONOMOUS.md"
echo ""
