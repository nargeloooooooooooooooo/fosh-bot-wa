// ============================================
// 🔧 OWNER COMMANDS
// ============================================

const config = require('../config');
const { db, addPremium, removePremium, banUser, unbanUser } = require('../database/db');
const { logger } = require('../utils/logger');

module.exports = {
  name: 'broadcast',
  aliases: ['bc'],
  ownerOnly: true,
  description: 'Broadcast pesan ke semua grup',
  
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;
    const message = args.join(' ');
    
    if (!message) {
      await sock.sendMessage(from, {
        text: '❌ Masukkan pesan broadcast.\nContoh: .broadcast Halo semua!'
      });
      return;
    }

    await sock.sendMessage(from, { text: '📨 Broadcast sedang dikirim...' });
    
    const chats = await sock.groupFetchAllParticipating();
    let sent = 0;
    
    for (const [jid] of Object.entries(chats)) {
      try {
        await sock.sendMessage(jid, {
          text: `📢 *BROADCAST*\n\n${message}\n\n📌 Dari: ${config.owner.name}`
        });
        sent++;
        await new Promise(r => setTimeout(r, 1000));
      } catch (err) {
        logger.error(`Gagal kirim ke ${jid}:`, err);
      }
    }
    
    await sock.sendMessage(from, {
      text: `✅ Broadcast terkirim ke ${sent} grup/chat.`
    });
  }
};

// ============================================
module.exports = {
  name: 'addpremium',
  aliases: ['ap'],
  ownerOnly: true,
  description: 'Tambah user premium',
  
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;
    const number = args[0];
    
    if (!number) {
      await sock.sendMessage(from, {
        text: '❌ Masukkan nomor.\nContoh: .addpremium 6281234567890'
      });
      return;
    }

    const userId = number + '@s.whatsapp.net';
    await addPremium(userId);
    
    await sock.sendMessage(from, {
      text: `✅ ${number} berhasil ditambahkan sebagai premium user!`
    });
  }
};

// ============================================
module.exports = {
  name: 'delpremium',
  aliases: ['dp'],
  ownerOnly: true,
  description: 'Hapus user premium',
  
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;
    const number = args[0];
    
    if (!number) {
      await sock.sendMessage(from, {
        text: '❌ Masukkan nomor.\nContoh: .delpremium 6281234567890'
      });
      return;
    }

    const userId = number + '@s.whatsapp.net';
    await removePremium(userId);
    
    await sock.sendMessage(from, {
      text: `✅ ${number} berhasil dihapus dari premium user.`
    });
  }
};

// ============================================
module.exports = {
  name: 'ban',
  ownerOnly: true,
  description: 'Ban user',
  
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;
    const number = args[0];
    
    if (!number) {
      await sock.sendMessage(from, {
        text: '❌ Masukkan nomor.\nContoh: .ban 6281234567890'
      });
      return;
    }

    const userId = number + '@s.whatsapp.net';
    await banUser(userId);
    
    await sock.sendMessage(from, {
      text: `✅ ${number} berhasil di-ban!`
    });
  }
};

// ============================================
module.exports = {
  name: 'unban',
  ownerOnly: true,
  description: 'Unban user',
  
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;
    const number = args[0];
    
    if (!number) {
      await sock.sendMessage(from, {
        text: '❌ Masukkan nomor.\nContoh: .unban 6281234567890'
      });
      return;
    }

    const userId = number + '@s.whatsapp.net';
    await unbanUser(userId);
    
    await sock.sendMessage(from, {
      text: `✅ ${number} berhasil di-unban!`
    });
  }
};

// ============================================
module.exports = {
  name: 'setprefix',
  ownerOnly: true,
  description: 'Ganti prefix bot',
  
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;
    const newPrefix = args[0];
    
    if (!newPrefix) {
      await sock.sendMessage(from, {
        text: '❌ Masukkan prefix baru.\nContoh: .setprefix !'
      });
      return;
    }

    await db.read();
    db.data.settings.prefix = newPrefix;
    await db.write();
    config.bot.prefix = newPrefix;
    
    await sock.sendMessage(from, {
      text: `✅ Prefix diubah menjadi: ${newPrefix}`
    });
  }
};
