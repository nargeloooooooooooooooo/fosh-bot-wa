// ============================================
// 🌤️ UTILITY COMMANDS
// ============================================

const axios = require('axios');
const moment = require('moment-timezone');
const config = require('../config');

module.exports = {
  name: 'weather',
  description: 'Info cuaca',
  
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;
    const city = args.join(' ');
    
    if (!city) {
      await sock.sendMessage(from, {
        text: `❌ Masukkan nama kota.\nContoh: .weather jakarta`
      });
      return;
    }

    try {
      const response = await axios.get(`${config.apis.weather.url}/${encodeURIComponent(city)}?format=j1`);
      const data = response.data;
      const current = data.current_condition[0];
      
      await sock.sendMessage(from, {
        text: `🌤️ *CUACA: ${city.toUpperCase()}*\n\n` +
              `🌡️ Suhu: ${current.temp_C}°C\n` +
              `☁️ Kondisi: ${current.weatherDesc[0].value}\n` +
              `💧 Kelembaban: ${current.humidity}%\n` +
              `💨 Angin: ${current.windSpeedKmph} km/h\n\n` +
              `📌 Update: ${current.observation_time}`
      });
    } catch (err) {
      await sock.sendMessage(from, {
        text: '❌ Kota tidak ditemukan.'
      });
    }
  }
};

// ============================================
module.exports = {
  name: 'time',
  description: 'Waktu sekarang',
  
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;
    const waktu = moment().tz(config.bot.timezone);
    
    await sock.sendMessage(from, {
      text: `🕐 *WAKTU SEKARANG*\n\n` +
            `📅 Tanggal: ${waktu.format('DD MMMM YYYY')}\n` +
            `⏰ Jam: ${waktu.format('HH:mm:ss')}\n` +
            `🌏 Timezone: ${config.bot.timezone}\n` +
            `📆 Hari: ${waktu.format('dddd')}\n\n` +
            `${waktu.format('dddd, DD MMMM YYYY HH:mm:ss')}`
    });
  }
};

// ============================================
module.exports = {
  name: 'quran',
  description: 'Baca Quran',
  
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;
    const surah = parseInt(args[0]) || 1;
    
    if (surah < 1 || surah > 114) {
      await sock.sendMessage(from, {
        text: '❌ Surah harus 1-114'
      });
      return;
    }

    try {
      const response = await axios.get(`${config.apis.quran.url}/surah/${surah}`);
      const data = response.data.data;
      const ayat = data.ayahs.slice(0, 5);
      
      let result = `📖 *SURAH ${data.name}*\n`;
      result += `📜 ${data.englishName} (${data.revelationType})\n`;
      result += `📊 ${data.numberOfAyahs} ayat\n\n`;
      
      for (const a of ayat) {
        result += `${a.numberInSurah}. ${a.text}\n`;
      }
      result += `\n📌 Baca selengkapnya: https://quran.com/${surah}`;
      
      await sock.sendMessage(from, { text: result });
    } catch (err) {
      await sock.sendMessage(from, {
        text: '❌ Surah tidak ditemukan.'
      });
    }
  }
};

// ============================================
module.exports = {
  name: 'crypto',
  description: 'Harga crypto',
  
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;
    const coin = args[0]?.toLowerCase() || 'bitcoin';
    
    try {
      const response = await axios.get(config.apis.crypto.url, {
        params: {
          ids: coin,
          vs_currencies: 'usd,idr'
        }
      });
      
      const data = response.data[coin];
      if (!data) {
        await sock.sendMessage(from, {
          text: '❌ Coin tidak ditemukan.'
        });
        return;
      }

      await sock.sendMessage(from, {
        text: `💰 *${coin.toUpperCase()}*\n\n` +
              `💵 USD: $${data.usd}\n` +
              `🇮🇩 IDR: Rp${data.idr.toLocaleString('id')}\n\n` +
              `📌 Update: ${new Date().toLocaleString('id-ID')}`
      });
    } catch (err) {
      await sock.sendMessage(from, {
        text: '❌ Gagal mengambil data crypto.'
      });
    }
  }
};

// ============================================
module.exports = {
  name: 'github',
  description: 'Info GitHub',
  
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;
    const username = args[0];
    
    if (!username) {
      await sock.sendMessage(from, {
        text: `❌ Masukkan username GitHub.\nContoh: .github torvalds`
      });
      return;
    }

    try {
      const response = await axios.get(`https://api.github.com/users/${username}`);
      const data = response.data;
      
      await sock.sendMessage(from, {
        text: `🐙 *GITHUB: ${data.login}*\n\n` +
              `📛 Nama: ${data.name || 'Tidak ada'}\n` +
              `📝 Bio: ${data.bio || 'Tidak ada'}\n` +
              `📍 Lokasi: ${data.location || 'Tidak ada'}\n` +
              `🏢 Company: ${data.company || 'Tidak ada'}\n\n` +
              `📊 Stats:\n` +
              `• Repositori: ${data.public_repos}\n` +
              `• Gists: ${data.public_gists}\n` +
              `• Followers: ${data.followers}\n` +
              `• Following: ${data.following}\n\n` +
              `🔗 Profil: ${data.html_url}`
      });
    } catch (err) {
      await sock.sendMessage(from, {
        text: '❌ User GitHub tidak ditemukan.'
      });
    }
  }
};
