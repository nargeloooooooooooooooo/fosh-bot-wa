// ============================================
// 📥 DOWNLOAD COMMANDS
// ============================================

const axios = require('axios');
const config = require('../config');

module.exports = {
  name: 'instagram',
  aliases: ['ig'],
  description: 'Download Instagram',
  
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;
    const url = args[0];
    
    if (!url || !url.includes('instagram.com')) {
      await sock.sendMessage(from, {
        text: `❌ Masukkan URL Instagram.\nContoh: .ig https://instagram.com/p/xxx`
      });
      return;
    }

    try {
      await sock.sendPresenceUpdate('composing', from);
      
      // Try using free API
      const response = await axios.get('https://api.hadiah.my.id/api/ig', {
        params: { url }
      });
      
      const data = response.data;
      if (!data.success) {
        throw new Error('Failed to download');
      }

      for (const media of data.result.slice(0, 3)) {
        await sock.sendMessage(from, {
          image: { url: media.url },
          caption: '📸 *Instagram Download*\n📌 By Fosh Bot'
        });
      }
      
    } catch (err) {
      await sock.sendMessage(from, {
        text: '❌ Gagal download Instagram. Coba gunakan API lain.'
      });
    }
  }
};

// ============================================
module.exports = {
  name: 'tiktok',
  aliases: ['tt'],
  description: 'Download TikTok',
  
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;
    const url = args[0];
    
    if (!url || !url.includes('tiktok.com')) {
      await sock.sendMessage(from, {
        text: `❌ Masukkan URL TikTok.\nContoh: .tt https://tiktok.com/@xxx`
      });
      return;
    }

    try {
      await sock.sendPresenceUpdate('composing', from);
      
      const response = await axios.get('https://api.hadiah.my.id/api/tiktok', {
        params: { url }
      });
      
      const data = response.data;
      if (!data.success) {
        throw new Error('Failed to download');
      }

      await sock.sendMessage(from, {
        video: { url: data.result.download },
        caption: `🎵 *TikTok Download*\n📌 By Fosh Bot\n\n${data.result.title || ''}`
      });
      
    } catch (err) {
      await sock.sendMessage(from, {
        text: '❌ Gagal download TikTok. Coba gunakan API lain.'
      });
    }
  }
};
