# 🤖 Autonomous Features - OpenClaw Level

SeniorAssist now includes **truly autonomous** operation powered by OpenClaw's agent framework.

---

## 🧠 What Makes It "OpenClaw Level Autonomous"

### 1. **Real AI Agents (Not Hardcoded Logic)**

Instead of simple if/else conversation trees, the system uses **actual OpenClaw agent sessions** with Claude Sonnet for intelligent, context-aware responses.

**`backend/openclawAgent.js`**
- Spawns isolated OpenClaw sessions per user
- Builds context-aware prompts with user history
- Processes natural language with full AI reasoning
- Extracts structured actions from free-form responses
- Executes multi-step workflows autonomously

**Toggle:** Set `USE_OPENCLAW_AGENT=true` in `.env` to enable

### 2. **Autonomous Monitoring & Proactive Suggestions**

The system **learns user patterns** and **proactively suggests orders** without being asked.

**`backend/autonomousMonitor.js`**
- Analyzes order history to learn preferences
- Detects patterns: favorite restaurants, common times, frequency
- Predicts when user might need food
- Sends proactive SMS suggestions: _"Would you like to order from Giuseppe's? You usually order around this time."_
- Self-healing health checks

**Run manually:** `npm run monitor`

### 3. **Self-Healing System**

Monitors its own health and automatically recovers from failures.

**Health Checks:**
- Database connectivity
- Twilio API status
- Automation system availability

**Self-Healing:**
- Reinitializes database if corrupted
- Reinstalls automation dependencies if missing
- Alerts admin if critical failure

### 4. **Multi-Agent Orchestration**

For complex tasks, spawns **multiple specialized agents** that work together.

**`backend/agentOrchestrator.js`**

**Example: Complex Order Workflow**
1. **Restaurant Finder Agent** — Searches restaurants matching criteria
2. **Menu Analyzer Agent** — Checks dietary restrictions
3. **Price Optimizer Agent** — Finds best deals
4. **Synthesizer Agent** — Combines all results into coherent recommendation

**Example: Restaurant Research**
- Spawns 3 agents in parallel: Quality, Value, Speed
- Each researches from different angle
- Synthesis agent merges into final recommendation

### 5. **Scheduled Autonomous Operations**

**OpenClaw cron jobs** handle recurring tasks:

| Job | Schedule | Purpose |
|-----|----------|---------|
| **Proactive Suggestions** | 11 AM, 5 PM, 7 PM daily | Check if users need meal suggestions |
| **Health Check** | Every hour | Monitor system health, self-heal |
| **Pattern Learning** | 2 AM daily | Analyze order patterns, update models |
| **Weekly Summary** | Sunday 8 PM | Generate usage report |
| **Emergency Monitor** | Every 15 minutes | Detect stuck orders, unusual gaps |

**Setup:** `npm run setup-cron`

---

## 🚀 Quick Start (Autonomous Mode)

### 1. Enable OpenClaw Agent

```bash
cd backend
echo "USE_OPENCLAW_AGENT=true" >> .env
```

### 2. Setup Autonomous Monitoring

```bash
npm run setup-cron
```

This creates 5 cron jobs that run autonomously in the background.

### 3. Test Proactive Monitoring

```bash
# Seed demo data
npm run seed

# Run monitoring cycle manually
npm run monitor
```

Check output for proactive suggestions based on patterns.

### 4. Start Server (with agent mode)

```bash
npm run dev
```

Now when users call, they're talking to a **real AI agent**, not hardcoded responses.

---

## 🎛️ Configuration

### Environment Variables

```bash
# Enable OpenClaw agent mode (vs simple pipeline)
USE_OPENCLAW_AGENT=true

# Agent model (sonnet, opus, gemini, etc.)
AGENT_MODEL=sonnet

# Monitoring frequency (milliseconds)
MONITORING_INTERVAL=7200000  # 2 hours

# Proactive suggestion confidence threshold
SUGGESTION_THRESHOLD=0.7  # 0-1 scale
```

### Agent Behavior

Edit `backend/openclawAgent.js` → `buildPrompt()` to customize:
- System instructions
- Conversation style
- Action formats
- Context included

### Monitoring Rules

Edit `backend/autonomousMonitor.js` → `shouldSuggestOrder()` to tune:
- Pattern detection sensitivity
- Proactive suggestion timing
- Confidence thresholds

---

## 📊 Monitoring Dashboard

View autonomous operation status:

```bash
# List active cron jobs
openclaw cron list

# View specific job runs
openclaw cron runs <jobId>

# Check system health
cd backend && node autonomousMonitor.js

# List active agent sessions
openclaw sessions list --kinds isolated
```

---

## 🎭 Multi-Agent Examples

### Example 1: Complex Order

```javascript
const orchestrator = require('./backend/agentOrchestrator');

const result = await orchestrator.orchestrateComplexOrder('+15551234567', {
  criteria: {
    cuisine: 'Italian',
    priceRange: '$10-20',
    deliveryTime: '<30min'
  },
  dietaryRestrictions: ['gluten-free', 'vegetarian']
});

// Returns: Coordinated recommendation from 3 specialized agents
```

### Example 2: Restaurant Research

```javascript
const recommendation = await orchestrator.researchRestaurants(
  'San Francisco, CA',
  'healthy, fast, affordable'
);

// 3 agents research in parallel (quality, value, speed)
// Synthesis agent combines into final recommendation
```

---

## 🧪 Testing Autonomous Features

### Test OpenClaw Agent

```bash
cd backend

# Enable agent mode
export USE_OPENCLAW_AGENT=true

# Start server
npm run dev

# In another terminal, call Twilio number
# You'll notice responses are more natural, contextual
```

### Test Proactive Monitoring

```bash
# Seed demo data with order history
npm run seed

# Run monitoring cycle
npm run monitor

# Check output for pattern analysis and suggestions
```

### Test Self-Healing

```bash
# Simulate database failure
rm data/senior-assist.db

# Run health check
node backend/autonomousMonitor.js

# Should detect failure and reinitialize database
```

### Test Multi-Agent Orchestration

```bash
node -e "
const orchestrator = require('./backend/agentOrchestrator');
orchestrator.researchRestaurants('Berkeley, CA', 'pizza, fast delivery')
  .then(console.log)
  .catch(console.error);
"
```

---

## 🔧 Troubleshooting

### "OpenClaw command not found"

OpenClaw Gateway must be running:
```bash
openclaw gateway start
```

### "Agent spawn failed"

Check you have agent permissions:
```bash
openclaw agents list
```

### "Cron jobs not running"

Verify cron scheduler is active:
```bash
openclaw cron status
```

View logs for specific job:
```bash
openclaw cron runs <jobId>
```

### "Self-healing not working"

Check environment variables are set:
```bash
cd backend && cat .env
```

Test health check manually:
```bash
node backend/autonomousMonitor.js
```

---

## 🚀 Production Deployment (Autonomous)

### Additional Requirements

**For cron jobs:**
- OpenClaw Gateway running 24/7
- Persistent storage for cron state
- Monitoring alerts configured

**For agents:**
- Sufficient API quota (OpenAI/Anthropic)
- Session cleanup policies
- Rate limiting

**For monitoring:**
- SMS credits (Twilio)
- Database backup schedule
- Alert notification channels

### Recommended Architecture

```
┌─────────────────────┐
│  OpenClaw Gateway   │ ◄─── Cron Scheduler
│   (Always Running)  │
└──────────┬──────────┘
           │
           ├──► Proactive Monitor (every 2h)
           ├──► Health Check (hourly)
           ├──► Pattern Learning (daily)
           └──► Emergency Monitor (15min)
           
┌─────────────────────┐
│   Backend Server    │
│  (Agent-Enabled)    │
└──────────┬──────────┘
           │
           ├──► OpenClaw Agent Sessions (per user)
           ├──► Multi-Agent Orchestrator
           └──► Self-Healing Monitor
```

### Scaling Considerations

**Agent sessions:**
- Each user gets isolated session
- Sessions persist across calls (learn context)
- Cleanup stale sessions after 24h inactivity

**Cron jobs:**
- Scale monitoring frequency with user count
- Batch processing for 1000+ users
- Distribute across multiple workers

**Cost estimates:**
- ~$0.01-0.05 per agent conversation
- ~$0.10-0.30 per complex orchestration
- Cron jobs: minimal cost (mostly compute)

---

## 🎯 Key Differences from "Simple" Mode

| Feature | Simple Mode | Autonomous Mode |
|---------|-------------|-----------------|
| **Conversation** | Hardcoded if/else logic | Real AI agent with context |
| **Responses** | Template-based | Natural, adaptive |
| **Learning** | None | Learns patterns over time |
| **Proactive** | Reactive only | Suggests orders autonomously |
| **Complex tasks** | Single-threaded | Multi-agent orchestration |
| **Recovery** | Manual restart needed | Self-healing |
| **Monitoring** | None | Continuous background checks |
| **Cost** | $0 (no AI calls) | ~$50-200/mo at scale |

---

## 💡 Ideas for Further Autonomy

**Short-term (doable now):**
- Voice call initiation (call user proactively, not just SMS)
- Automatic re-ordering of favorites on schedule
- Smart upselling ("add a drink to that?")
- Dietary preference learning from order history

**Medium-term (with more data):**
- Predictive ordering based on weather, time of day
- Social ordering (coordinate with friends/family)
- Health monitoring integration (suggest healthier options)
- Budgeting (alert if spending too much)

**Long-term (research needed):**
- Emotional state detection (adjust tone if user seems upset)
- Multi-modal input (combine voice + app + SMS)
- Collaborative agents (multiple seniors ordering together)
- Fully autonomous household management (food + rides + groceries + meds)

---

## 🏆 Why This Is "OpenClaw Level"

✅ **Real agents** (not templates) — Uses OpenClaw's agent framework  
✅ **Multi-agent orchestration** — Spawns specialized sub-agents for complex tasks  
✅ **Autonomous scheduling** — Cron jobs run without human intervention  
✅ **Self-healing** — Detects and fixes its own failures  
✅ **Learning** — Improves over time from user data  
✅ **Proactive** — Doesn't wait to be asked  

This isn't just a hackathon demo — **it's a glimpse of how AI agents can truly operate autonomously to help people.**

---

**Ready to experience autonomous AI? Run `npm run setup-cron` and watch it come alive.** 🚀
