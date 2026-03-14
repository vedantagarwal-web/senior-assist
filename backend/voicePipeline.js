const db = require('./database');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

/**
 * Voice Pipeline
 * Processes speech input through OpenClaw agent and triggers automation
 */

async function process(speechInput, user, callSid) {
  console.log(`Processing: "${speechInput}" for user ${user.name}`);
  
  // Get conversation state
  let state = await db.getConversationState(callSid);
  if (!state) {
    state = {
      step: 'initial',
      intent: null,
      restaurant: null,
      items: [],
      confirmed: false
    };
  }
  
  // Classify intent if not set
  if (!state.intent) {
    state.intent = classifyIntent(speechInput);
  }
  
  // Handle different intents
  let response;
  switch (state.intent) {
    case 'order_food':
      response = await handleFoodOrder(speechInput, user, state);
      break;
    case 'get_ride':
      response = await handleRide(speechInput, user, state);
      break;
    case 'help':
      response = {
        message: 'I can help you order food from your favorite restaurants or book an Uber ride. What would you like to do?',
        shouldContinue: true,
        state: { ...state, step: 'waiting_intent' }
      };
      break;
    default:
      response = {
        message: 'I can help you order food or get a ride. Which would you like?',
        shouldContinue: true,
        state: { ...state, step: 'waiting_intent' }
      };
  }
  
  // Save updated state
  if (response.state) {
    await db.saveConversationState(callSid, user.phone, response.state);
  }
  
  return response;
}

function classifyIntent(text) {
  const lower = text.toLowerCase();
  
  if (lower.includes('food') || lower.includes('order') || lower.includes('hungry') || lower.includes('dinner') || lower.includes('lunch') || lower.includes('breakfast')) {
    return 'order_food';
  }
  
  if (lower.includes('ride') || lower.includes('uber') || lower.includes('lyft') || lower.includes('trip') || lower.includes('go to')) {
    return 'get_ride';
  }
  
  if (lower.includes('help') || lower.includes('what can you do')) {
    return 'help';
  }
  
  return 'unknown';
}

async function handleFoodOrder(speechInput, user, state) {
  const lower = speechInput.toLowerCase();
  
  // Get favorite restaurants
  const favorites = await db.getFavoriteRestaurants(user.phone);
  
  // Initialize retry counter if not present
  if (!state.retries) state.retries = 0;
  
  switch (state.step) {
    case 'initial':
    case 'waiting_intent':
      // Ask which restaurant
      if (favorites.length > 0) {
        const restaurantList = favorites.slice(0, 3).map(r => r.name).join(', or ');
        return {
          message: `Great! I can help you order food. Would you like to order from ${restaurantList}? Or I can help you find somewhere else.`,
          shouldContinue: true,
          state: { ...state, step: 'choosing_restaurant', retries: 0 }
        };
      } else {
        return {
          message: 'I\'d love to help you order food, but I don\'t have any favorite restaurants saved yet. Please ask your family member to add some restaurants to your account through the website first. Is there anything else I can help you with?',
          shouldContinue: true,
          state: { ...state, intent: null, step: 'initial' }
        };
      }
      
    case 'choosing_restaurant':
      // Match restaurant from speech
      const matchedRestaurant = favorites.find(r => 
        lower.includes(r.name.toLowerCase()) || 
        fuzzyMatch(r.name.toLowerCase(), lower)
      );
      
      if (matchedRestaurant) {
        state.restaurant = matchedRestaurant;
        state.step = 'choosing_items';
        
        if (matchedRestaurant.usual_order) {
          return {
            message: `Perfect! Your usual order from ${matchedRestaurant.name} is: ${matchedRestaurant.usual_order}. Would you like that again, or something different?`,
            shouldContinue: true,
            state
          };
        } else {
          return {
            message: `Great choice, ${matchedRestaurant.name}! What would you like to order?`,
            shouldContinue: true,
            state
          };
        }
      } else {
        state.retries = (state.retries || 0) + 1;
        
        if (state.retries >= 3) {
          return {
            message: 'I\'m having trouble understanding which restaurant you\'d like. Let me transfer you to someone who can help, or you can try calling back later.',
            shouldContinue: false,
            state
          };
        }
        
        if (state.retries === 1) {
          return {
            message: `I didn't quite catch that. Could you please say the restaurant name again? Your saved restaurants are: ${favorites.map(r => r.name).join(', ')}`,
            shouldContinue: true,
            state
          };
        } else {
          return {
            message: `I'm still having trouble hearing you. Let's try one more time. Please say one of these restaurant names slowly and clearly: ${favorites.map(r => r.name).join(', or ')}`,
            shouldContinue: true,
            state
          };
        }
      }
      
    case 'choosing_items':
      // Check if they want the usual
      if (lower.includes('usual') || lower.includes('same') || lower.includes('yes') || lower.includes('that')) {
        state.items = [state.restaurant.usual_order];
        state.step = 'confirming';
        
        return {
          message: `Okay! I'll order ${state.restaurant.usual_order} from ${state.restaurant.name} and deliver it to ${user.address}. Should I place the order?`,
          shouldContinue: true,
          state
        };
      } else {
        // Custom order - for MVP, just take the speech as-is
        state.items = [speechInput];
        state.step = 'confirming';
        
        return {
          message: `Got it! I'll order ${speechInput} from ${state.restaurant.name} and deliver it to ${user.address}. Should I place the order?`,
          shouldContinue: true,
          state
        };
      }
      
    case 'confirming':
      if (lower.includes('yes') || lower.includes('confirm') || lower.includes('place') || lower.includes('sure') || lower.includes('okay') || lower.includes('please')) {
        // Place the order via browser automation
        try {
          console.log(`📞 Placing order for ${user.name}: ${state.items.join(', ')} from ${state.restaurant.name}`);
          
          const orderId = await placeOrder(user, state.restaurant, state.items);
          
          // Save to database
          await db.createOrder({
            userPhone: user.phone,
            type: 'food',
            restaurantName: state.restaurant.name,
            items: state.items.join(', '),
            totalCost: null,
            deliveryAddress: user.address,
            callSid: state.callSid
          });
          
          console.log(`✅ Order placed successfully! Order ID: ${orderId}`);
          
          return {
            message: `Perfect! Your order from ${state.restaurant.name} has been placed and will be delivered to ${user.address}. You can expect it to arrive in about 30 to 45 minutes. Is there anything else I can help you with today?`,
            shouldContinue: true,
            state: { step: 'initial', intent: null, restaurant: null, items: [], confirmed: false, retries: 0 }
          };
        } catch (error) {
          console.error('❌ Error placing order:', error);
          return {
            message: 'I\'m very sorry, but I\'m having trouble placing that order right now. This might be a temporary issue. Would you like me to help you try again, or shall I transfer you to someone who can place the order manually?',
            shouldContinue: true,
            state: { ...state, step: 'error_recovery' }
          };
        }
      } else if (lower.includes('no') || lower.includes('cancel') || lower.includes('don\'t') || lower.includes('stop')) {
        return {
          message: 'No problem! Would you like to order something different, or can I help you with something else?',
          shouldContinue: true,
          state: { step: 'initial', intent: null, restaurant: null, items: [], confirmed: false, retries: 0 }
        };
      } else {
        state.retries = (state.retries || 0) + 1;
        
        if (state.retries >= 2) {
          return {
            message: 'I\'m having trouble understanding. I\'ll cancel this order for now. Feel free to call back when you\'re ready. Goodbye!',
            shouldContinue: false,
            state
          };
        }
        
        return {
          message: 'I didn\'t quite catch that. To place this order, please say "yes" or "confirm". To cancel, say "no" or "cancel".',
          shouldContinue: true,
          state
        };
      }
      
    case 'error_recovery':
      if (lower.includes('try again') || lower.includes('yes')) {
        return {
          message: 'Okay, let\'s start over. What would you like to order?',
          shouldContinue: true,
          state: { step: 'initial', intent: 'order_food', restaurant: null, items: [], confirmed: false, retries: 0 }
        };
      } else {
        return {
          message: 'I understand. Let me connect you with someone who can help you directly. Please hold.',
          shouldContinue: false,
          state
        };
      }
  }
}

async function handleRide(speechInput, user, state) {
  // Simplified Uber flow - for MVP
  return {
    message: 'Ride booking is coming soon! For now, I can help you order food. Would you like to do that?',
    shouldContinue: true,
    state: { ...state, intent: null }
  };
}

async function placeOrder(user, restaurant, items) {
  // Call the browser automation script
  const automationPath = '../automation/doordash.js';
  const orderDetails = {
    restaurantUrl: restaurant.doordash_url,
    items: items,
    deliveryAddress: user.address,
    userName: user.name
  };
  
  const cmd = `node ${automationPath} '${JSON.stringify(orderDetails)}'`;
  
  try {
    const { stdout, stderr } = await execPromise(cmd);
    console.log('Automation output:', stdout);
    if (stderr) console.error('Automation errors:', stderr);
    
    // Parse response to get order ID
    const result = JSON.parse(stdout);
    return result.orderId;
  } catch (error) {
    console.error('Automation failed:', error);
    throw new Error('Failed to place order via automation');
  }
}

function fuzzyMatch(str1, str2) {
  // Simple fuzzy matching for restaurant names
  return str2.includes(str1) || str1.includes(str2);
}

module.exports = {
  process
};
