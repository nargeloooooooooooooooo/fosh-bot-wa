// ============================================
// 🔥 COMMAND HANDLER
// ============================================

const fs = require('fs');
const path = require('path');
const { logger } = require('../utils/logger');
const config = require('../config');
const { isBanned, getUser } = require('../database/db');

// Load all commands
const commands = {};
const commandFiles = fs.readdirSync(path.join(__dirname, '../commands'))
  .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`../commands/${file}`);
  if (command.name) {
    commands[command.name] = command;
    if (command.aliases) {
      for (const alias of command.aliases) {
        commands[alias] = command;
      }
    }
    logger.info(`✅ Loaded command: ${command.name}`);
  }
}

async function handleCommand(sock, msg, command, args) {
  const from = msg.key.remoteJid;
  const sender = msg.key.participant || from;
  
  // Check if command exists
  if (!commands[command]) {
    await sock.sendMessage(from, {
      text: `❌ Command "${command}" tidak ditemukan.\nKetik ${config.bot.prefix}menu untuk bantuan.`
    });
    return;
  }

  const cmd = commands[command];
  
  // Check if command is owner only
  if (cmd.ownerOnly) {
    const isOwner = config.owner.numbers.includes(sender.replace('@s.whatsapp.net', ''));
    if (!isOwner) {
      await sock.sendMessage(from, {
        text: config.messages.onlyOwner
      });
      return;
    }
  }

  // Check cooldown/limit
  try {
    const user = await getUser(sender);
    // Limit logic here
  } catch (err) {
    logger.error('Error checking user:', err);
  }

  // Execute command
  try {
    await cmd.execute(sock, msg, args);
  } catch (err) {
    logger.error(`Error executing command ${command}:`, err);
    await sock.sendMessage(from, {
      text: config.messages.error
    });
  }
}

module.exports = { handleCommand };
