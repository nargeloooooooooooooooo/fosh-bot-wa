// ============================================
// 📱 GENERAL COMMANDS
// ============================================

const config = require('../config');
const moment = require('moment-timezone');

module.exports = {
  name: 'menu',
  aliases: ['help', '?'],
  description: 'Tampilkan menu bantuan',
  
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;
    const prefix = config.bot.prefix;
    
    const menu = `🤖 *${config.bot.name} - MENU LENGKAP*

📱 *INFORMASI*
${prefix}ping - Cek status bot
${prefix}info - Info bot
${prefix}owner - Kontak owner
${prefix}time - Waktu sekarang
${prefix}about - Tentang bot

🎨 *MEDIA & STICKER*
${prefix}sticker - Buat sticker dari gambar/video
${prefix}toimg - Ubah sticker ke gambar
${prefix}gif - Buat GIF dari video

🧠 *AI & CHAT*
${prefix}ai [pesan] - Chat dengan AI
${prefix}translate [kode] [teks] - Translate
${prefix}ask [pertanyaan] - Tanya AI

🔍 *SEARCH*
${prefix}youtube [query] - Cari video YouTube
${prefix}instagram [url] - Download IG
${prefix}tiktok [url] - Download TikTok
${prefix}news - Berita terbaru
${prefix}wikipedia [query] - Cari di Wikipedia
${prefix}movie [judul] - Info film
${prefix}lyrics [judul] - Lirik lagu

🌤️ *UTILITY*
${prefix}weather [kota] - Info cuaca
${prefix}quran [surah] - Baca Quran
${prefix}crypto [coin] - Harga crypto
${prefix}github [username] - Info GitHub

👥 *GROUP*
${prefix}group link - Link grup
${prefix}group welcome - Welcome message
${prefix}group goodbye - Goodbye message
${prefix}group tagall - Tag semua member
${prefix}group delete - Hapus pesan bot

🔧 *OWNER ONLY*
${prefix}broadcast [pesan] - Broadcast
${prefix}ban [nomor] - Ban user
${prefix}unban [nomor] - Unban user
${prefix}setprefix [prefix] - Ganti prefix
${prefix}addpremium [nomor] - Tambah premium

💡 *CARA PAKAI:*
${prefix}sticker (reply gambar)
${prefix}ai halo
${prefix}weather jakarta

📌 *BOT BY ${config.owner.name}*`;

    await sock.sendMessage(from, { text: menu });
  }
};
