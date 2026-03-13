const { chromium } = require('playwright');
require('dotenv').config({ path: '../backend/.env' });

/**
 * DoorDash Browser Automation
 * Places orders via browser automation
 * 
 * Usage: node doordash.js '{"restaurantUrl":"https://...", "items":["Pizza"], "deliveryAddress":"...", "userName":"..."}'
 */

async function placeOrder(orderDetails) {
  const { restaurantUrl, items, deliveryAddress, userName } = orderDetails;
  
  console.log(`🤖 Starting DoorDash automation for ${userName}`);
  console.log(`   Restaurant: ${restaurantUrl}`);
  console.log(`   Items: ${items.join(', ')}`);
  console.log(`   Delivery: ${deliveryAddress}`);
  
  const browser = await chromium.launch({
    headless: false, // Set to true for production
    slowMo: 100 // Slow down for debugging
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  });
  
  const page = await context.newPage();
  
  try {
    // Step 1: Navigate to restaurant
    console.log('📍 Navigating to restaurant...');
    await page.goto(restaurantUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Step 2: Set delivery address
    console.log('🏠 Setting delivery address...');
    const addressButton = await page.locator('button:has-text("Deliver")').first();
    if (await addressButton.isVisible()) {
      await addressButton.click();
      await page.waitForTimeout(1000);
      
      // Fill in address
      const addressInput = await page.locator('input[placeholder*="address" i]').first();
      await addressInput.fill(deliveryAddress);
      await page.waitForTimeout(1000);
      
      // Select first suggestion
      const firstSuggestion = await page.locator('[role="option"]').first();
      if (await firstSuggestion.isVisible()) {
        await firstSuggestion.click();
        await page.waitForTimeout(2000);
      }
    }
    
    // Step 3: Search for menu items and add to cart
    console.log('🔍 Adding items to cart...');
    for (const item of items) {
      try {
        // Try to find item on menu
        const itemButton = await page.locator(`button:has-text("${item}")`).first();
        
        if (await itemButton.isVisible()) {
          await itemButton.click();
          await page.waitForTimeout(1000);
          
          // Click "Add to Cart" button (might have variations)
          const addButtons = [
            'button:has-text("Add to Cart")',
            'button:has-text("Add to Order")',
            'button:has-text("Add")',
            'span:has-text("Add to Order")',
          ];
          
          for (const selector of addButtons) {
            try {
              const btn = await page.locator(selector).first();
              if (await btn.isVisible({ timeout: 2000 })) {
                await btn.click();
                console.log(`✅ Added ${item} to cart`);
                await page.waitForTimeout(1000);
                break;
              }
            } catch (e) {
              // Try next selector
            }
          }
        } else {
          console.warn(`⚠️  Could not find "${item}" on menu, skipping...`);
        }
      } catch (error) {
        console.warn(`⚠️  Error adding ${item}:`, error.message);
      }
    }
    
    // Step 4: Go to checkout
    console.log('🛒 Going to checkout...');
    const checkoutButtons = [
      'button:has-text("Checkout")',
      'a:has-text("Checkout")',
      'button:has-text("View Cart")',
      '[data-testid="checkout-button"]'
    ];
    
    for (const selector of checkoutButtons) {
      try {
        const btn = await page.locator(selector).first();
        if (await btn.isVisible({ timeout: 2000 })) {
          await btn.click();
          await page.waitForTimeout(2000);
          break;
        }
      } catch (e) {
        // Try next
      }
    }
    
    // Step 5: For MVP demo - stop here and return success
    // In production, you'd need to:
    // - Handle login/auth
    // - Fill payment info (tokenized)
    // - Click place order
    
    console.log('🎯 Order prepared (demo mode - not submitted)');
    console.log('   In production, would submit order here with saved payment method');
    
    // Take screenshot for verification
    await page.screenshot({ path: `./screenshots/order-${Date.now()}.png`, fullPage: true });
    
    // For demo, generate fake order ID
    const fakeOrderId = `DEMO-${Date.now()}`;
    
    await browser.close();
    
    return {
      success: true,
      orderId: fakeOrderId,
      message: 'Order placed successfully (demo mode)'
    };
    
  } catch (error) {
    console.error('❌ Automation error:', error);
    await page.screenshot({ path: `./screenshots/error-${Date.now()}.png`, fullPage: true });
    await browser.close();
    
    throw new Error(`DoorDash automation failed: ${error.message}`);
  }
}

// CLI usage
if (require.main === module) {
  const orderDetails = JSON.parse(process.argv[2] || '{}');
  
  placeOrder(orderDetails)
    .then(result => {
      console.log(JSON.stringify(result));
      process.exit(0);
    })
    .catch(error => {
      console.error(JSON.stringify({ success: false, error: error.message }));
      process.exit(1);
    });
}

module.exports = { placeOrder };
