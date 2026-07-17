// ============================================
// 🔥 MESSAGE HANDLER
// ============================================

const config = require('../config');
const { handleCommand } = require('./commandHandler');
const { logger } = require('../utils/logger');
const { isBanned, getUser } = require('../database/db');

async function handleMessage(sock, msg) {
  const from = msg.key.remoteJid;
  const isGroup = from.endsWith('@g.us');
  const sender = isGroup ? msg.key.participant : from;
  const prefix = config.bot.prefix;
  
  let text = '';
  
  // Extract text
  if (msg.message.conversation) text = msg.message.conversation;
  else if (msg.message.extendedTextMessage) {
    text = msg.message.extendedTextMessage.text;
  }
  else if (msg.message.imageMessage) text = msg.message.imageMessage.caption || '';
  else if (msg.message.videoMessage) text = msg.message.videoMessage.caption || '';
  
  if (!text) return;

  // Check banned
  if (await isBanned(sender)) {
    await sock.sendMessage(from, {
      text: '❌ Anda telah di-banned dari menggunakan bot ini.'
    });
    return;
  }

  // Log message
  logger.info(`📩 Pesan dari ${sender}: ${text}`);

  // Handle command
  if (text.startsWith(prefix)) {
    const cmd = text.slice(prefix.length).trim().split(/\s+/);
    const command = cmd[0].toLowerCase();
    const args = cmd.slice(1);
    
    await handleCommand(sock, msg, command, args);
  }
  
  // Auto AI (if enabled)
  else if (config.features.autoAI && isGroup) {
    // Auto reply logic here
  }
}

module.exports = { handleMessage };
