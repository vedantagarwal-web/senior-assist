/**
 * Seed demo data for testing and demos
 * Run: node seedData.js
 */

const db = require('./database');

async function seed() {
  console.log('🌱 Seeding demo data...');
  
  // Initialize database
  db.init();
  
  // Wait for DB to be ready
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    // Demo User 1: Margaret (Grandma)
    console.log('Creating demo user: Margaret...');
    await db.createUser({
      name: 'Margaret Thompson',
      phone: '+15551234567',
      address: '742 Evergreen Terrace, Springfield, IL 62701',
      email: 'margaret.thompson@example.com',
      caregiverName: 'Sarah Thompson',
      caregiverEmail: 'sarah.thompson@example.com'
    });
    
    // Add Margaret's favorite restaurants
    await db.addFavoriteRestaurant('+15551234567', {
      name: "Giuseppe's Pizza",
      doordashUrl: 'https://www.doordash.com/store/giuseppe-pizzeria-springfield-123456/',
      usualOrder: 'Large pepperoni pizza with extra cheese'
    });
    
    await db.addFavoriteRestaurant('+15551234567', {
      name: "China Garden",
      doordashUrl: 'https://www.doordash.com/store/china-garden-springfield-789012/',
      usualOrder: 'Sweet and sour chicken with fried rice'
    });
    
    await db.addFavoriteRestaurant('+15551234567', {
      name: "Subway",
      doordashUrl: 'https://www.doordash.com/store/subway-springfield-345678/',
      usualOrder: 'Turkey and cheese footlong on wheat'
    });
    
    // Demo User 2: Robert (Grandpa)
    console.log('Creating demo user: Robert...');
    await db.createUser({
      name: 'Robert Chen',
      phone: '+15559876543',
      address: '456 Oak Avenue, Berkeley, CA 94704',
      email: 'robert.chen@example.com',
      caregiverName: 'Jennifer Chen',
      caregiverEmail: 'jennifer.chen@example.com'
    });
    
    // Add Robert's favorite restaurants
    await db.addFavoriteRestaurant('+15559876543', {
      name: 'Chipotle',
      doordashUrl: 'https://www.doordash.com/store/chipotle-berkeley-111222/',
      usualOrder: 'Chicken burrito bowl with brown rice and black beans'
    });
    
    await db.addFavoriteRestaurant('+15559876543', {
      name: 'Panda Express',
      doordashUrl: 'https://www.doordash.com/store/panda-express-berkeley-333444/',
      usualOrder: 'Orange chicken with chow mein'
    });
    
    // Demo User 3: Dorothy (Lives alone)
    console.log('Creating demo user: Dorothy...');
    await db.createUser({
      name: 'Dorothy Williams',
      phone: '+15555551111',
      address: '123 Main Street, Austin, TX 78701',
      email: 'dorothy.williams@example.com',
      caregiverName: 'Michael Williams (son)',
      caregiverEmail: 'michael.williams@example.com'
    });
    
    await db.addFavoriteRestaurant('+15555551111', {
      name: 'Panera Bread',
      doordashUrl: 'https://www.doordash.com/store/panera-bread-austin-555666/',
      usualOrder: 'Broccoli cheddar soup in a bread bowl'
    });
    
    await db.addFavoriteRestaurant('+15555551111', {
      name: 'Starbucks',
      doordashUrl: 'https://www.doordash.com/store/starbucks-austin-777888/',
      usualOrder: 'Grande latte and blueberry muffin'
    });
    
    // Add some demo orders for history
    console.log('Creating demo order history...');
    await db.createOrder({
      userPhone: '+15551234567',
      type: 'food',
      restaurantName: "Giuseppe's Pizza",
      items: 'Large pepperoni pizza with extra cheese',
      totalCost: 24.99,
      deliveryAddress: '742 Evergreen Terrace, Springfield, IL 62701',
      callSid: 'DEMO-SEED-001'
    });
    
    await db.updateOrderStatus(1, 'delivered');
    
    await db.createOrder({
      userPhone: '+15559876543',
      type: 'food',
      restaurantName: 'Chipotle',
      items: 'Chicken burrito bowl with brown rice and black beans',
      totalCost: 12.50,
      deliveryAddress: '456 Oak Avenue, Berkeley, CA 94704',
      callSid: 'DEMO-SEED-002'
    });
    
    await db.updateOrderStatus(2, 'delivered');
    
    await db.createOrder({
      userPhone: '+15555551111',
      type: 'food',
      restaurantName: 'Panera Bread',
      items: 'Broccoli cheddar soup in a bread bowl',
      totalCost: 9.99,
      deliveryAddress: '123 Main Street, Austin, TX 78701',
      callSid: 'DEMO-SEED-003'
    });
    
    await db.updateOrderStatus(3, 'delivered');
    
    console.log('✅ Demo data seeded successfully!');
    console.log('');
    console.log('📞 Demo phone numbers to test with:');
    console.log('   Margaret Thompson: +15551234567');
    console.log('   Robert Chen:       +15559876543');
    console.log('   Dorothy Williams:  +15555551111');
    console.log('');
    console.log('🎯 Try calling from one of these numbers to test the voice flow!');
    console.log('');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seed();
