/**
 * Setup OpenClaw Cron Jobs for Autonomous Operation
 * Run this once to schedule autonomous monitoring
 */

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function setupCronJobs() {
  console.log('🕐 Setting up OpenClaw cron jobs for autonomous monitoring...\n');

  try {
    // 1. Proactive Order Suggestions (runs every 2 hours during meal times)
    console.log('📋 Creating proactive suggestion cron...');
    await execPromise(`openclaw cron add '{
      "name": "SeniorAssist: Proactive Order Suggestions",
      "schedule": {
        "kind": "cron",
        "expr": "0 11,17,19 * * *",
        "tz": "America/Los_Angeles"
      },
      "payload": {
        "kind": "agentTurn",
        "message": "Run the autonomous monitoring cycle to check if any seniors need proactive order suggestions. Execute: cd /path/to/backend && node autonomousMonitor.js",
        "model": "sonnet",
        "timeoutSeconds": 300
      },
      "delivery": {
        "mode": "announce",
        "channel": "main"
      },
      "sessionTarget": "isolated",
      "enabled": true
    }'`);
    console.log('✅ Proactive suggestions scheduled: 11 AM, 5 PM, 7 PM daily\n');

    // 2. Health Check & Self-Heal (runs every hour)
    console.log('🏥 Creating health check cron...');
    await execPromise(`openclaw cron add '{
      "name": "SeniorAssist: Health Check & Self-Heal",
      "schedule": {
        "kind": "every",
        "everyMs": 3600000
      },
      "payload": {
        "kind": "agentTurn",
        "message": "Run system health check and self-healing if needed. Check database connectivity, Twilio API, and automation systems. Report any issues.",
        "model": "sonnet",
        "timeoutSeconds": 120
      },
      "delivery": {
        "mode": "announce"
      },
      "sessionTarget": "isolated",
      "enabled": true
    }'`);
    console.log('✅ Health checks scheduled: Every hour\n');

    // 3. Pattern Analysis & Learning (runs nightly)
    console.log('🧠 Creating pattern learning cron...');
    await execPromise(`openclaw cron add '{
      "name": "SeniorAssist: Pattern Learning",
      "schedule": {
        "kind": "cron",
        "expr": "0 2 * * *",
        "tz": "America/Los_Angeles"
      },
      "payload": {
        "kind": "agentTurn",
        "message": "Analyze all user order patterns and update preference models. Look for new patterns, anomalies, and opportunities to improve service.",
        "model": "sonnet",
        "timeoutSeconds": 600
      },
      "delivery": {
        "mode": "none"
      },
      "sessionTarget": "isolated",
      "enabled": true
    }'`);
    console.log('✅ Pattern learning scheduled: 2 AM daily\n');

    // 4. Weekly Summary Report (runs Sunday night)
    console.log('📊 Creating weekly summary cron...');
    await execPromise(`openclaw cron add '{
      "name": "SeniorAssist: Weekly Summary",
      "schedule": {
        "kind": "cron",
        "expr": "0 20 * * 0",
        "tz": "America/Los_Angeles"
      },
      "payload": {
        "kind": "agentTurn",
        "message": "Generate weekly summary: total orders, most popular restaurants, user engagement metrics, system health stats. Format as a concise report.",
        "model": "sonnet",
        "timeoutSeconds": 300
      },
      "delivery": {
        "mode": "announce"
      },
      "sessionTarget": "isolated",
      "enabled": true
    }'`);
    console.log('✅ Weekly summaries scheduled: Sunday 8 PM\n');

    // 5. Emergency Alert Monitor (runs every 15 minutes)
    console.log('🚨 Creating emergency monitor cron...');
    await execPromise(`openclaw cron add '{
      "name": "SeniorAssist: Emergency Alert Monitor",
      "schedule": {
        "kind": "every",
        "everyMs": 900000
      },
      "payload": {
        "kind": "agentTurn",
        "message": "Check for any failed orders, stuck conversations, or users who haven\\'t ordered in unusually long time (may indicate emergency). Alert if needed.",
        "model": "sonnet",
        "timeoutSeconds": 180
      },
      "delivery": {
        "mode": "announce"
      },
      "sessionTarget": "isolated",
      "enabled": true
    }'`);
    console.log('✅ Emergency monitoring scheduled: Every 15 minutes\n');

    console.log('═══════════════════════════════════════');
    console.log('🎉 All cron jobs created successfully!');
    console.log('═══════════════════════════════════════\n');
    
    console.log('📝 To manage these jobs:');
    console.log('   List all:    openclaw cron list');
    console.log('   Run now:     openclaw cron run <jobId>');
    console.log('   Disable:     openclaw cron update <jobId> \'{"enabled":false}\'');
    console.log('   Remove:      openclaw cron remove <jobId>\n');

    console.log('🚀 SeniorAssist is now fully autonomous!');
    console.log('   - Proactive suggestions at meal times');
    console.log('   - Self-healing every hour');
    console.log('   - Pattern learning every night');
    console.log('   - Weekly summaries');
    console.log('   - Emergency monitoring\n');

  } catch (error) {
    console.error('❌ Failed to setup cron jobs:', error);
    console.error('\nMake sure you have OpenClaw Gateway running:');
    console.error('   openclaw gateway start');
    process.exit(1);
  }
}

// Run setup
setupCronJobs();
