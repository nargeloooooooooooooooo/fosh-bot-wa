// ============================================
// 🎨 MEDIA & STICKER COMMANDS
// ============================================

const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const sharp = require('sharp');
const config = require('../config');

module.exports = {
  name: 'sticker',
  aliases: ['s', 'stiker'],
  description: 'Buat sticker dari gambar/video',
  
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;
    const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
    const media = quoted?.imageMessage || quoted?.videoMessage || 
                  msg.message.imageMessage || msg.message.videoMessage;

    if (!media) {
      await sock.sendMessage(from, {
        text: `❌ *CARA PAKAI STICKER:*\n\n1. Kirim gambar/video\n2. Balas dengan .sticker\n\nAtau kirim langsung:\n.sticker (dengan media)`
      });
      return;
    }

    try {
      await sock.sendPresenceUpdate('composing', from);
      
      const stream = await downloadContentFromMessage(media, 'image');
      let buffer = Buffer.from([]);
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }

      // Convert to sticker
      let stickerBuffer = await sharp(buffer)
        .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .toFormat('webp')
        .toBuffer();

      await sock.sendMessage(from, {
        sticker: stickerBuffer,
        mimetype: 'image/webp',
        packname: config.sticker.packname,
        author: config.sticker.author
      });
      
    } catch (err) {
      console.error('Sticker Error:', err);
      await sock.sendMessage(from, {
        text: '❌ Gagal membuat sticker. Pastikan media valid.'
      });
    }
  }
};
