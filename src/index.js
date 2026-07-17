// ============================================
// 🔥 FOSH BOT - MAIN ENTRY POINT
// ============================================

const { 
  default: makeWASocket, 
  useMultiFileAuthState, 
  DisconnectReason,
  Browsers
} = require('@whiskeysockets/baileys');
const P = require('pino');
const config = require('./config');
const { handleMessage } = require('./handlers/messageHandler');
const { initDB } = require('./database/db');
const { logger } = require('./utils/logger');

// ==================== START BOT ====================
async function startBot() {
  console.log(`
╔═══════════════════════════════════════╗
║          🤖 ${config.bot.name} v${config.bot.version}            ║
║        WhatsApp Bot Full Fitur       ║
║                                      ║
║  📌 ${config.bot.description}        ║
║  👤 Owner: ${config.owner.name}      ║
║  📱 Mode: ${config.bot.mode}         ║
║  🔑 Prefix: ${config.bot.prefix}     ║
║                                      ║
║  ⏳ Starting bot...                  ║
║  📱 Scan QR Code di terminal         ║
╚═══════════════════════════════════════╝
  `);

  // Init Database
  await initDB();

  const { state, saveCreds } = await useMultiFileAuthState('./session');
  
  const sock = makeWASocket({
    auth: state,
    browser: Browsers.macOS('Chrome'),
    logger: P({ level: 'silent' }),
    printQRInTerminal: true,
    defaultQueryTimeoutMs: 60000
  });

  // Save credentials
  sock.ev.on('creds.update', saveCreds);

  // ============ CONNECTION HANDLER ============
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;
    
    if (qr) {
      console.log('\n📱 SCAN QR CODE INI DI WHATSAPP:\n');
      console.log(qr);
      console.log('\n====================================\n');
    }

    if (connection === 'open') {
      logger.success('BOT AKTIF!');
      logger.info(`Bot: ${sock.user?.id}`);
      logger.info(`Nama: ${sock.user?.name || config.bot.name}`);
      logger.info(`Waktu: ${new Date().toLocaleString('id-ID')}`);
      console.log('\n====================================\n');
      
      // Notify owner
      if (config.owner.number) {
        await sock.sendMessage(`${config.owner.number}@s.whatsapp.net`, {
          text: `🤖 *${config.bot.name} ONLINE!*\n\n` +
                `Versi: ${config.bot.version}\n` +
                `Mode: ${config.bot.mode}\n` +
                `Prefix: ${config.bot.prefix}\n` +
                `Siap membantu! Ketik ${config.bot.prefix}menu`
        }).catch(() => {});
      }
    }

    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode;
      if (code !== DisconnectReason.loggedOut) {
        logger.warn('Reconnecting...');
        setTimeout(startBot, 5000);
      } else {
        logger.error('Session expired. Hapus folder session dan restart.');
      }
    }
  });

  // ============ HANDLE CALLS ============
  if (config.features.antiCall) {
    sock.ev.on('call', async (calls) => {
      for (const call of calls) {
        await sock.rejectCall(call.id, call.from);
        await sock.sendMessage(call.from, {
          text: '📞 *Panggilan Ditolak Otomatis*\nBot tidak menerima panggilan.'
        });
      }
    });
  }

  // ============ HANDLE MESSAGES ============
  sock.ev.on('messages.upsert', async (m) => {
    const msg = m.messages[0];
    if (!msg.message || msg.key.fromMe) return;
    await handleMessage(sock, msg);
  });

  // ============ GROUP PARTICIPANTS ============
  sock.ev.on('group-participants.update', async (update) => {
    const { id, participants, action } = update;
    const db = require('./database/db');
    await db.db.read();
    const group = db.db.data.groups[id] || {};
    
    if (action === 'add' && (group.welcome || config.features.welcome)) {
      for (const participant of participants) {
        const msg = config.messages.welcome.replace(/@user/g, `@${participant.split('@')[0]}`);
        await sock.sendMessage(id, {
          text: msg,
          mentions: [participant]
        });
      }
    }
    
    if (action === 'remove' && (group.goodbye || config.features.goodbye)) {
      for (const participant of participants) {
        const msg = config.messages.goodbye.replace(/@user/g, `@${participant.split('@')[0]}`);
        await sock.sendMessage(id, {
          text: msg,
          mentions: [participant]
        });
      }
    }
  });

  return sock;
}

// ==================== ERROR HANDLING ============
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
});

// ==================== START ====================
startBot().catch(console.error);
