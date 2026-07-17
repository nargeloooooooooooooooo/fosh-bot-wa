// ============================================
// 👥 GROUP COMMANDS
// ============================================

const { db } = require('../database/db');
const config = require('../config');

module.exports = {
  name: 'group',
  description: 'Group management commands',
  
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;
    const isGroup = from.endsWith('@g.us');
    
    if (!isGroup) {
      await sock.sendMessage(from, {
        text: '❌ Command ini hanya untuk grup.'
      });
      return;
    }

    const sub = args[0]?.toLowerCase();
    const metadata = await sock.groupMetadata(from);
    const sender = msg.key.participant;
    const isAdmin = metadata.participants.some(p => 
      p.id === sender && p.admin
    );

    if (!isAdmin) {
      await sock.sendMessage(from, {
        text: config.messages.notAdmin
      });
      return;
    }

    await db.read();

    // Group link
    if (sub === 'link') {
      try {
        const code = await sock.groupInviteCode(from);
        await sock.sendMessage(from, {
          text: `🔗 *Link Grup:*\nhttps://chat.whatsapp.com/${code}`
        });
      } catch (err) {
        await sock.sendMessage(from, {
          text: '❌ Gagal mendapatkan link grup.'
        });
      }
    }

    // Welcome toggle
    else if (sub === 'welcome') {
      db.data.groups[from] ||= {};
      db.data.groups[from].welcome = !db.data.groups[from].welcome;
      await db.write();
      await sock.sendMessage(from, {
        text: `✅ Welcome message ${db.data.groups[from].welcome ? 'diaktifkan' : 'dinonaktifkan'}.`
      });
    }

    // Goodbye toggle
    else if (sub === 'goodbye') {
      db.data.groups[from] ||= {};
      db.data.groups[from].goodbye = !db.data.groups[from].goodbye;
      await db.write();
      await sock.sendMessage(from, {
        text: `✅ Goodbye message ${db.data.groups[from].goodbye ? 'diaktifkan' : 'dinonaktifkan'}.`
      });
    }

    // Tag all
    else if (sub === 'tagall') {
      const members = metadata.participants.map(p => `@${p.id.split('@')[0]}`).join(' ');
      await sock.sendMessage(from, {
        text: `📢 *TAG ALL*\n\n${members}`,
        mentions: metadata.participants.map(p => p.id)
      });
    }

    // Delete bot message
    else if (sub === 'delete' || sub === 'del') {
      const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
      if (quoted) {
        const key = msg.message.extendedTextMessage.contextInfo.stanzaId;
        await sock.sendMessage(from, {
          delete: { remoteJid: from, fromMe: true, id: key }
        });
      }
    }

    else {
      await sock.sendMessage(from, {
        text: `👥 *GROUP COMMANDS:*\n\n` +
              `.group link - Link grup\n` +
              `.group welcome - Toggle welcome\n` +
              `.group goodbye - Toggle goodbye\n` +
              `.group tagall - Tag semua member\n` +
              `.group delete - Hapus pesan bot`
      });
    }
  }
};
