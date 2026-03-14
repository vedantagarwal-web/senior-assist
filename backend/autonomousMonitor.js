/**
 * Autonomous Monitoring System
 * Learns user patterns and proactively suggests orders
 * Runs as background cron job
 */

const db = require('./database');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

class AutonomousMonitor {
  constructor() {
    this.patterns = new Map(); // User patterns cache
  }

  /**
   * Analyze user order patterns
   */
  async analyzePatterns(userPhone) {
    const orders = await db.getOrderHistory(userPhone, 50);
    
    if (orders.length < 3) {
      return null; // Not enough data
    }
    
    // Analyze ordering patterns
    const patterns = {
      favoriteRestaurants: this.getFavoriteRestaurants(orders),
      commonTimes: this.getCommonOrderTimes(orders),
      dayOfWeekPatterns: this.getDayOfWeekPatterns(orders),
      averageFrequency: this.getAverageFrequency(orders),
      lastOrderDate: new Date(orders[0].created_at)
    };
    
    this.patterns.set(userPhone, patterns);
    return patterns;
  }

  getFavoriteRestaurants(orders) {
    const counts = {};
    orders.forEach(order => {
      counts[order.restaurant_name] = (counts[order.restaurant_name] || 0) + 1;
    });
    
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));
  }

  getCommonOrderTimes(orders) {
    const hours = orders.map(o => new Date(o.created_at).getHours());
    const hourCounts = {};
    hours.forEach(h => hourCounts[h] = (hourCounts[h] || 0) + 1);
    
    return Object.entries(hourCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }));
  }

  getDayOfWeekPatterns(orders) {
    const days = orders.map(o => new Date(o.created_at).getDay());
    const dayCounts = {};
    days.forEach(d => dayCounts[d] = (dayCounts[d] || 0) + 1);
    
    return dayCounts;
  }

  getAverageFrequency(orders) {
    if (orders.length < 2) return null;
    
    const dates = orders.map(o => new Date(o.created_at).getTime());
    const intervals = [];
    
    for (let i = 0; i < dates.length - 1; i++) {
      intervals.push(dates[i] - dates[i + 1]);
    }
    
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    return avgInterval / (1000 * 60 * 60 * 24); // Convert to days
  }

  /**
   * Check if user should receive proactive suggestion
   */
  async shouldSuggestOrder(userPhone, currentTime = new Date()) {
    const patterns = await this.analyzePatterns(userPhone);
    
    if (!patterns) return null;
    
    const currentHour = currentTime.getHours();
    const currentDay = currentTime.getDay();
    const daysSinceLastOrder = (currentTime - patterns.lastOrderDate) / (1000 * 60 * 60 * 24);
    
    // Check if it's a common order time
    const isCommonTime = patterns.commonTimes.some(t => Math.abs(t.hour - currentHour) <= 1);
    
    // Check if it's a common day
    const isCommonDay = (patterns.dayOfWeekPatterns[currentDay] || 0) >= 2;
    
    // Check if enough time has passed since last order
    const shouldOrderSoon = patterns.averageFrequency && daysSinceLastOrder >= patterns.averageFrequency * 0.9;
    
    if (isCommonTime && isCommonDay && shouldOrderSoon) {
      return {
        confidence: 0.8,
        suggestion: `Would you like to order from ${patterns.favoriteRestaurants[0].name}? You usually order around this time on ${this.getDayName(currentDay)}s.`,
        restaurant: patterns.favoriteRestaurants[0].name
      };
    }
    
    if (shouldOrderSoon && daysSinceLastOrder > patterns.averageFrequency * 1.5) {
      return {
        confidence: 0.6,
        suggestion: `It's been a while since your last meal delivery. Would you like me to help you order something?`,
        restaurant: null
      };
    }
    
    return null;
  }

  getDayName(day) {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day];
  }

  /**
   * Send proactive suggestion via SMS or call
   */
  async sendProactiveSuggestion(userPhone, suggestion) {
    const user = await db.getUserByPhone(userPhone);
    
    console.log(`💡 Proactive suggestion for ${user.name}: ${suggestion.suggestion}`);
    
    // Option 1: Send SMS (if Twilio SMS is configured)
    try {
      const twilio = require('twilio');
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      
      await client.messages.create({
        body: `Hi ${user.name}! ${suggestion.suggestion} Reply YES to order, or call ${process.env.TWILIO_PHONE_NUMBER} anytime.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: userPhone
      });
      
      console.log(`📱 Sent proactive SMS to ${userPhone}`);
    } catch (error) {
      console.error('Failed to send SMS:', error);
    }
    
    // Option 2: Notify caregiver dashboard
    // (Would send via WebSocket or similar in production)
  }

  /**
   * Main monitoring loop (called by cron)
   */
  async runMonitoringCycle() {
    console.log('🔄 Running autonomous monitoring cycle...');
    
    try {
      // Get all users
      const users = await this.getAllUsers();
      
      for (const user of users) {
        const suggestion = await this.shouldSuggestOrder(user.phone);
        
        if (suggestion && suggestion.confidence > 0.7) {
          await this.sendProactiveSuggestion(user.phone, suggestion);
        }
      }
      
      console.log(`✅ Monitoring cycle complete. Checked ${users.length} users.`);
    } catch (error) {
      console.error('❌ Monitoring cycle error:', error);
    }
  }

  async getAllUsers() {
    // Helper to get all users from database
    return new Promise((resolve, reject) => {
      const sqlite3 = require('sqlite3');
      const dbPath = process.env.DB_PATH || './data/senior-assist.db';
      const db = new sqlite3.Database(dbPath);
      
      db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
        db.close();
      });
    });
  }

  /**
   * Health check - ensure system is working
   */
  async healthCheck() {
    const checks = {
      database: false,
      twilio: false,
      automation: false
    };
    
    try {
      // Check database
      const users = await this.getAllUsers();
      checks.database = users !== undefined;
      
      // Check Twilio (ping API)
      if (process.env.TWILIO_ACCOUNT_SID) {
        const twilio = require('twilio');
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        await client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
        checks.twilio = true;
      }
      
      // Check automation (test import)
      require('../automation/doordash');
      checks.automation = true;
      
    } catch (error) {
      console.error('Health check failed:', error);
    }
    
    const allHealthy = Object.values(checks).every(v => v);
    
    console.log('🏥 Health Check:', checks, allHealthy ? '✅' : '❌');
    
    return { checks, healthy: allHealthy };
  }

  /**
   * Self-healing: restart services if unhealthy
   */
  async selfHeal() {
    const health = await this.healthCheck();
    
    if (!health.healthy) {
      console.log('🔧 System unhealthy, attempting self-heal...');
      
      if (!health.checks.database) {
        console.log('📦 Reinitializing database...');
        db.init();
      }
      
      if (!health.checks.automation) {
        console.log('🤖 Checking automation dependencies...');
        await execPromise('cd automation && npm install').catch(console.error);
      }
      
      // Re-check after healing
      const recheckHealth = await this.healthCheck();
      
      if (recheckHealth.healthy) {
        console.log('✅ Self-heal successful!');
      } else {
        console.log('❌ Self-heal failed, manual intervention needed');
        // Send alert to admin
        await this.alertAdmin('System health check failed after self-heal attempt');
      }
    }
  }

  async alertAdmin(message) {
    console.error('🚨 ADMIN ALERT:', message);
    // In production: send email, Slack message, PagerDuty alert, etc.
  }
}

// Export singleton
module.exports = new AutonomousMonitor();

// If run directly (via cron or npm script)
if (require.main === module) {
  const monitor = new AutonomousMonitor();
  
  (async () => {
    // Run health check
    await monitor.selfHeal();
    
    // Run monitoring cycle
    await monitor.runMonitoringCycle();
    
    process.exit(0);
  })();
}
