// ============================================
// 🔥 DATABASE HANDLER
// ============================================

const { Low, JSONFile } = require('lowdb');
const path = require('path');
const config = require('../config');

const dbPath = path.join(__dirname, 'database.json');
const adapter = new JSONFile(dbPath);
const db = new Low(adapter);

async function initDB() {
  await db.read();
  db.data ||= {
    users: {},
    groups: {},
    settings: {
      prefix: config.bot.prefix,
      botName: config.bot.name,
      mode: config.bot.mode
    },
    premium: {},
    banned: {}
  };
  await db.write();
  return db;
}

async function getUser(userId) {
  await db.read();
  if (!db.data.users[userId]) {
    db.data.users[userId] = {
      joined: new Date().toISOString(),
      limit: config.limits.daily,
      used: 0,
      premium: false,
      banned: false
    };
    await db.write();
  }
  return db.data.users[userId];
}

async function isPremium(userId) {
  await db.read();
  return db.data.premium[userId] || false;
}

async function isBanned(userId) {
  await db.read();
  return db.data.banned[userId] || false;
}

async function addPremium(userId) {
  await db.read();
  db.data.premium[userId] = true;
  await db.write();
}

async function removePremium(userId) {
  await db.read();
  delete db.data.premium[userId];
  await db.write();
}

async function banUser(userId) {
  await db.read();
  db.data.banned[userId] = true;
  await db.write();
}

async function unbanUser(userId) {
  await db.read();
  delete db.data.banned[userId];
  await db.write();
}

module.exports = { 
  db, 
  initDB, 
  getUser, 
  isPremium, 
  isBanned,
  addPremium,
  removePremium,
  banUser,
  unbanUser
};
