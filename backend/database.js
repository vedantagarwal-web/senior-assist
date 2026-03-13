const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || './data/senior-assist.db';

let db;

function init() {
  // Ensure data directory exists
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('Error opening database:', err);
      return;
    }
    console.log('📦 Database connected');
    createTables();
  });
}

function createTables() {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT UNIQUE NOT NULL,
        address TEXT,
        email TEXT,
        caregiver_name TEXT,
        caregiver_email TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Favorite restaurants table
    db.run(`
      CREATE TABLE IF NOT EXISTS favorite_restaurants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_phone TEXT NOT NULL,
        name TEXT NOT NULL,
        doordash_url TEXT,
        usual_order TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_phone) REFERENCES users(phone)
      )
    `);
    
    // Order history table
    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_phone TEXT NOT NULL,
        type TEXT NOT NULL, -- 'food' or 'ride'
        restaurant_name TEXT,
        items TEXT,
        total_cost REAL,
        delivery_address TEXT,
        status TEXT, -- 'pending', 'confirmed', 'delivered', 'failed'
        call_sid TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_phone) REFERENCES users(phone)
      )
    `);
    
    // Conversation state table (for multi-turn conversations)
    db.run(`
      CREATE TABLE IF NOT EXISTS conversation_state (
        call_sid TEXT PRIMARY KEY,
        user_phone TEXT NOT NULL,
        state TEXT, -- JSON blob
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Database tables ready');
  });
}

// User operations
function createUser(userData) {
  return new Promise((resolve, reject) => {
    const { name, phone, address, email, caregiverName, caregiverEmail } = userData;
    db.run(
      `INSERT INTO users (name, phone, address, email, caregiver_name, caregiver_email) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, phone, address, email, caregiverName, caregiverEmail],
      function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
}

function getUserByPhone(phone) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE phone = ?', [phone], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Restaurant operations
function addFavoriteRestaurant(userPhone, restaurant) {
  return new Promise((resolve, reject) => {
    const { name, doordashUrl, usualOrder } = restaurant;
    db.run(
      `INSERT INTO favorite_restaurants (user_phone, name, doordash_url, usual_order) 
       VALUES (?, ?, ?, ?)`,
      [userPhone, name, doordashUrl, usualOrder],
      function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
}

function getFavoriteRestaurants(userPhone) {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM favorite_restaurants WHERE user_phone = ? ORDER BY created_at DESC',
      [userPhone],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      }
    );
  });
}

// Order operations
function createOrder(orderData) {
  return new Promise((resolve, reject) => {
    const { userPhone, type, restaurantName, items, totalCost, deliveryAddress, callSid } = orderData;
    db.run(
      `INSERT INTO orders (user_phone, type, restaurant_name, items, total_cost, delivery_address, status, call_sid) 
       VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [userPhone, type, restaurantName, items, totalCost, deliveryAddress, callSid],
      function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
}

function updateOrderStatus(orderId, status) {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, orderId],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

function getOrderHistory(userPhone, limit = 50) {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM orders WHERE user_phone = ? ORDER BY created_at DESC LIMIT ?',
      [userPhone, limit],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      }
    );
  });
}

// Conversation state operations
function saveConversationState(callSid, userPhone, state) {
  return new Promise((resolve, reject) => {
    const stateJson = JSON.stringify(state);
    db.run(
      `INSERT OR REPLACE INTO conversation_state (call_sid, user_phone, state, last_updated) 
       VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
      [callSid, userPhone, stateJson],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

function getConversationState(callSid) {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM conversation_state WHERE call_sid = ?',
      [callSid],
      (err, row) => {
        if (err) reject(err);
        else resolve(row ? JSON.parse(row.state) : null);
      }
    );
  });
}

module.exports = {
  init,
  createUser,
  getUserByPhone,
  addFavoriteRestaurant,
  getFavoriteRestaurants,
  createOrder,
  updateOrderStatus,
  getOrderHistory,
  saveConversationState,
  getConversationState
};
