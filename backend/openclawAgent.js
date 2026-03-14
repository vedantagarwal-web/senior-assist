/**
 * OpenClaw Agent Integration
 * Uses actual OpenClaw sessions for intelligent conversation handling
 */

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const db = require('./database');

class OpenClawAgent {
  constructor() {
    this.sessionCache = new Map(); // Cache agent sessions per user
  }

  /**
   * Get or create an isolated OpenClaw session for a user
   */
  async getSession(userPhone) {
    if (this.sessionCache.has(userPhone)) {
      return this.sessionCache.get(userPhone);
    }

    // Spawn isolated session for this user
    const label = `senior-assist-${userPhone.replace(/\+/g, '')}`;
    
    try {
      const { stdout } = await execPromise(
        `openclaw session spawn --label ${label} --mode session --cleanup keep --model sonnet`
      );
      
      const sessionKey = stdout.trim();
      this.sessionCache.set(userPhone, sessionKey);
      
      console.log(`🤖 Created OpenClaw session for ${userPhone}: ${sessionKey}`);
      return sessionKey;
    } catch (error) {
      console.error('Failed to spawn OpenClaw session:', error);
      throw error;
    }
  }

  /**
   * Send user input to OpenClaw agent and get response
   */
  async processWithAgent(userPhone, userInput, context) {
    const sessionKey = await this.getSession(userPhone);
    
    // Build context-aware prompt
    const prompt = await this.buildPrompt(userPhone, userInput, context);
    
    try {
      // Send to OpenClaw agent
      const { stdout } = await execPromise(
        `openclaw session send --session ${sessionKey} --message ${JSON.stringify(prompt)}`
      );
      
      const response = JSON.parse(stdout);
      
      console.log(`🧠 Agent response: ${response.message.substring(0, 100)}...`);
      
      // Parse agent response for actions
      return this.parseAgentResponse(response.message, context);
    } catch (error) {
      console.error('Agent processing error:', error);
      return {
        message: "I'm having trouble thinking right now. Let me transfer you to someone who can help.",
        shouldContinue: false,
        actions: []
      };
    }
  }

  /**
   * Build intelligent prompt with user context
   */
  async buildPrompt(userPhone, userInput, context) {
    const user = await db.getUserByPhone(userPhone);
    const favorites = await db.getFavoriteRestaurants(userPhone);
    const recentOrders = await db.getOrderHistory(userPhone, 5);
    
    const systemContext = `
You are a patient, friendly voice assistant helping ${user.name}, a senior, order food or book rides.

IMPORTANT INSTRUCTIONS:
- Keep responses SHORT and CLEAR (1-2 sentences max)
- Speak naturally, like talking to a grandparent
- Be patient if they repeat themselves or get confused
- Confirm important details (address, order items) before proceeding
- If unsure, ask clarifying questions
- NEVER make assumptions about what they want

USER CONTEXT:
- Name: ${user.name}
- Home address: ${user.address}
- Favorite restaurants: ${favorites.map(r => r.name).join(', ')}
${favorites.map(r => `  - ${r.name}: usual order is "${r.usual_order}"`).join('\n')}

RECENT ORDERS:
${recentOrders.map(o => `- ${o.restaurant_name}: ${o.items} (${new Date(o.created_at).toLocaleDateString()})`).join('\n')}

CONVERSATION STATE:
${JSON.stringify(context, null, 2)}

USER SAYS: "${userInput}"

RESPOND WITH:
1. Your spoken response (what to say to the user)
2. Actions to take (JSON format):
   - {"action": "order_food", "restaurant": "name", "items": ["item1"], "confirm": true/false}
   - {"action": "ask_clarification", "about": "restaurant|items|address"}
   - {"action": "end_call", "reason": "completed|error|transfer"}

Format your response as:
RESPONSE: [what to say]
ACTIONS: [JSON array of actions]
`;

    return systemContext;
  }

  /**
   * Parse agent response into structured actions
   */
  parseAgentResponse(agentMessage, context) {
    // Extract RESPONSE and ACTIONS from agent output
    const responseMatch = agentMessage.match(/RESPONSE:\s*(.+?)(?=ACTIONS:|$)/s);
    const actionsMatch = agentMessage.match(/ACTIONS:\s*(\[.+?\])/s);
    
    let message = responseMatch ? responseMatch[1].trim() : agentMessage;
    let actions = [];
    
    try {
      if (actionsMatch) {
        actions = JSON.parse(actionsMatch[1]);
      }
    } catch (e) {
      console.warn('Failed to parse actions:', e);
    }
    
    // Determine if conversation should continue
    const shouldContinue = !actions.some(a => a.action === 'end_call');
    
    return {
      message,
      shouldContinue,
      actions,
      state: context
    };
  }

  /**
   * Execute actions returned by agent
   */
  async executeActions(userPhone, actions) {
    const results = [];
    
    for (const action of actions) {
      switch (action.action) {
        case 'order_food':
          if (action.confirm) {
            // Place the order via automation
            const user = await db.getUserByPhone(userPhone);
            const restaurant = await this.findRestaurant(userPhone, action.restaurant);
            
            if (restaurant) {
              const orderId = await this.placeOrder(user, restaurant, action.items);
              results.push({ action: 'order_placed', orderId });
            }
          }
          break;
          
        case 'save_preference':
          // Learn from this interaction
          await this.updateUserPreferences(userPhone, action.preference);
          break;
          
        default:
          console.log(`Unknown action: ${action.action}`);
      }
    }
    
    return results;
  }

  async findRestaurant(userPhone, restaurantName) {
    const favorites = await db.getFavoriteRestaurants(userPhone);
    return favorites.find(r => 
      r.name.toLowerCase().includes(restaurantName.toLowerCase()) ||
      restaurantName.toLowerCase().includes(r.name.toLowerCase())
    );
  }

  async placeOrder(user, restaurant, items) {
    // Import automation module
    const automation = require('../automation/doordash');
    
    const orderDetails = {
      restaurantUrl: restaurant.doordash_url,
      items: items,
      deliveryAddress: user.address,
      userName: user.name
    };
    
    const result = await automation.placeOrder(orderDetails);
    
    // Save to database
    await db.createOrder({
      userPhone: user.phone,
      type: 'food',
      restaurantName: restaurant.name,
      items: items.join(', '),
      totalCost: null,
      deliveryAddress: user.address,
      callSid: 'OPENCLAW-AGENT'
    });
    
    return result.orderId;
  }

  async updateUserPreferences(userPhone, preference) {
    // Could store learned preferences in database
    console.log(`📝 Learning preference for ${userPhone}:`, preference);
  }

  /**
   * Clean up session when done
   */
  async closeSession(userPhone) {
    const sessionKey = this.sessionCache.get(userPhone);
    if (sessionKey) {
      // Keep session for future calls
      console.log(`💤 Keeping session ${sessionKey} for future use`);
      // Could optionally kill if we want fresh sessions each time
      // await execPromise(`openclaw subagent kill ${sessionKey}`);
    }
  }
}

module.exports = new OpenClawAgent();
