const { 
  default: makeWASocket, 
  useMultiFileAuthState, 
  DisconnectReason,
  Browsers,
  downloadContentFromMessage,
  generateWAMessageFromContent,
  proto,
  prepareWAMessageMedia
} = require('@whiskeysockets/baileys');
const P = require('pino');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const sharp = require('sharp');
const translate = require('google-translate-api-x');
const moment = require('moment-timezone');
const { Low, JSONFile } = require('lowdb');

// ============ API LANGSUNG (GA PAKE .env) ============
const APIS = {
  // AI CHAT - GRATIS!
  simi: 'https://api.simsimi.vn/v1/simtalk',
  openai: 'https://api.openai.com/v1/chat/completions', // KALAU MAU PAKE KUNCI
  gemini: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
  
  // FREE APIs
  weather: 'https://wttr.in',
  news: 'https://newsapi.org/v2/top-headlines',
  crypto: 'https://api.coingecko.com/api/v3/simple/price',
  quran: 'https://api.alquran.cloud/v1/surah',
  movie: 'https://api.tvmaze.com/search/shows',
  lyrics: 'https://api.lyrics.ovh/v1',
  wikipedia: 'https://en.wikipedia.org/api/rest_v1/page/summary',
  github: 'https://api.github.com/users',
  instagram: 'https://api.hadiah.my.id/api/ig',
  tiktok: 'https://api.hadiah.my.id/api/tiktok',
};

// API KEYS LANGSUNG (PUBLIC/GRATIS)
const API_KEYS = {
  gemini: 'AIzaSyC2x6Xr8qP2Xx8Xx8Xx8Xx8Xx8Xx8Xx8Xx8Xx', // GANTI DENGAN YANG VALID
  news: 'YOUR_NEWS_API_KEY', // BISA DAPET GRATIS DI newsapi.org
  openai: 'sk-proj-xxxxxxxxxxxxxxxxxxxx', // ISI KALAU PUNYA
};

// ============ DATABASE ============
const adapter = new JSONFile('database.json');
const db = new Low(adapter);

async function initDB() {
  await db.read();
  db.data ||= { users: {}, groups: {}, settings: { prefix: '.', botName: 'Fosh Bot' } };
  await db.write();
}
initDB();

// ============ MAIN BOT ============
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./session');
  
  const sock = makeWASocket({
    auth: state,
    browser: Browsers.macOS('Chrome'),
    logger: P({ level: 'silent' }),
    printQRInTerminal: true,
    patchMessageBeforeSending: (msg) => {
      const requiresPatch = !!(
        msg.buttonsMessage || 
        msg.listMessage || 
        msg.templateMessage ||
        msg.sectionsMessage
      );
      if (requiresPatch) {
        msg = {
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadata: {},
                deviceListMetadataVersion: 2
              },
              ...msg
            }
          }
        };
      }
      return msg;
    }
  });

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
      console.log('✅ FOSH BOT AKTIF!');
      console.log(`📱 Bot: ${sock.user?.id}`);
      console.log(`👤 Nama: ${sock.user?.name || 'Fosh Bot'}`);
      console.log(`⏰ ${new Date().toLocaleString('id-ID')}`);
      console.log('\n====================================\n');
      
      // Kirim notifikasi ke owner (ganti dengan nomor lu)
      const ownerJid = '6281234567890@s.whatsapp.net';
      await sock.sendMessage(ownerJid, { 
        text: '🤖 *FOSH BOT ONLINE!*\n\n' +
              'Siap membantu! Ketik .menu untuk lihat fitur.' 
      }).catch(() => {});
    }

    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode;
      if (code !== DisconnectReason.loggedOut) {
        console.log('🔄 Reconnecting...');
        setTimeout(startBot, 5000);
      } else {
        console.log('❌ Session expired, hapus folder session dan restart.');
      }
    }
  });

  // ============ HANDLE CALLS ============
  sock.ev.on('call', async (calls) => {
    for (const call of calls) {
      await sock.sendMessage(call.from, { 
        text: '📞 *Panggilan Ditolak Otomatis*\nBot tidak menerima panggilan.' 
      });
      await sock.rejectCall(call.id, call.from);
    }
  });

  // ============ HANDLE MESSAGES ============
  sock.ev.on('messages.upsert', async (m) => {
    const msg = m.messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const from = msg.key.remoteJid;
    const isGroup = from.endsWith('@g.us');
    const sender = isGroup ? msg.key.participant : from;
    const prefix = db.data.settings.prefix || '.';
    
    let text = '';
    let quoted = null;
    
    // Extract text
    if (msg.message.conversation) text = msg.message.conversation;
    else if (msg.message.extendedTextMessage) {
      text = msg.message.extendedTextMessage.text;
      quoted = msg.message.extendedTextMessage.contextInfo?.quotedMessage;
    }
    else if (msg.message.imageMessage) text = msg.message.imageMessage.caption || '';
    else if (msg.message.videoMessage) text = msg.message.videoMessage.caption || '';
    
    if (!text) return;

    // ============ COMMAND SYSTEM ============
    if (text.startsWith(prefix)) {
      const cmd = text.slice(prefix.length).trim().split(/\s+/);
      const command = cmd[0].toLowerCase();
      const args = cmd.slice(1);
      
      console.log(`📩 Command: ${command} | From: ${sender}`);

      // ===== MENU =====
      if (command === 'menu' || command === 'help') {
        await sock.sendMessage(from, {
          text: `🤖 *FOSH BOT - MENU LENGKAP*

📱 *INFORMASI*
.ping - Cek status bot
.info - Info bot
.owner - Kontak owner
.time - Waktu sekarang
.about - Tentang bot

🎨 *MEDIA & STICKER*
.sticker - Buat sticker dari gambar/video
.toimg - Ubah sticker ke gambar
.gif - Buat GIF dari video

🧠 *AI & CHAT*
.ai [pesan] - Chat dengan AI
.translate [kode] [teks] - Translate
.ask [pertanyaan] - Tanya AI

🔍 *SEARCH*
.youtube [query] - Cari video YouTube
.instagram [url] - Download IG
.tiktok [url] - Download TikTok
.news - Berita terbaru
.wikipedia [query] - Cari di Wikipedia
.movie [judul] - Info film
.lyrics [judul] - Lirik lagu

🌤️ *UTILITY*
.weather [kota] - Info cuaca
.quran [surah] - Baca Quran
.crypto [coin] - Harga crypto
.github [username] - Info GitHub
.whois [nomor] - Cek nomor

👥 *GROUP*
.group welcome - Welcome message
.group goodbye - Goodbye message
.group link - Link grup
.group delete - Hapus pesan bot
.tagall - Tag semua member

📌 *OWNER ONLY*
.broadcast [pesan] - Broadcast
.ban [nomor] - Ban user
.unban [nomor] - Unban user
.setprefix [prefix] - Ganti prefix

💡 *CARA PAKAI:*
${prefix}sticker (reply gambar)
${prefix}ai halo
${prefix}weather jakarta

📌 *BOT BY FOSH TEAM*`
        });
      }

      // ===== PING =====
      else if (command === 'ping') {
        const start = Date.now();
        await sock.sendMessage(from, { text: '⏳ Ping...' });
        const end = Date.now();
        await sock.sendMessage(from, { 
          text: `🏓 *Pong!*\n⏱️ ${end - start}ms\n📡 Status: Online` 
        });
      }

      // ===== INFO =====
      else if (command === 'info' || command === 'about') {
        await sock.sendMessage(from, {
          text: `🤖 *FOSH BOT v2.0*

📱 *Informasi Bot:*
• Nama: ${db.data.settings.botName}
• Prefix: ${prefix}
• Mode: Public
• Library: Baileys

👤 *Pengguna:*
• Total: ${Object.keys(db.data.users).length} user
• Grup: ${Object.keys(db.data.groups).length} grup

⚡ *Fitur:*
• AI Chat (Free)
• Downloader
• Sticker Maker
• Group Manager
• Search Engine

⏰ *Uptime:*
• Online: ${moment().format('DD MMM YYYY HH:mm')}

📌 *Developer:* @fosh_team`
        });
      }

      // ===== OWNER =====
      else if (command === 'owner') {
        await sock.sendMessage(from, {
          text: `👤 *OWNER BOT*

Nama: Fosh Team
Nomor: 6281234567890
WhatsApp: wa.me/6281234567890

📌 *Keterangan:*
Bot ini dikembangkan oleh Fosh Team.
Untuk kerjasama/saran, hubungi owner.`
        });
      }

      // ===== TIME =====
      else if (command === 'time') {
        const waktu = moment().tz('Asia/Jakarta');
        await sock.sendMessage(from, {
          text: `🕐 *WAKTU SEKARANG*

📅 Tanggal: ${waktu.format('DD MMMM YYYY')}
⏰ Jam: ${waktu.format('HH:mm:ss')}
🌏 Timezone: Asia/Jakarta (WIB)
📆 Hari: ${waktu.format('dddd')}

${waktu.format('dddd, DD MMMM YYYY HH:mm:ss')}`
        });
      }

      // ===== STICKER =====
      else if (command === 'sticker' || command === 's') {
        const quotedMsg = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
        const media = quotedMsg?.imageMessage || quotedMsg?.videoMessage || msg.message.imageMessage || msg.message.videoMessage;
        
        if (!media) {
          await sock.sendMessage(from, { 
            text: `❌ *CARA PAKAI STICKER:*\n\n1. Kirim gambar/video\n2. Balas dengan ${prefix}sticker\n\nAtau kirim langsung:\n${prefix}sticker (dengan media)` 
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

          let stickerBuffer = buffer;
          if (media.videoMessage) {
            // Convert video to sticker (1 frame)
            stickerBuffer = await sharp(buffer)
              .resize(512, 512, { fit: 'contain' })
              .toFormat('webp')
              .toBuffer();
          }

          await sock.sendMessage(from, {
            sticker: stickerBuffer,
            mimetype: 'image/webp',
            packname: 'Fosh Bot',
            author: '🤖'
          });
        } catch (err) {
          console.error(err);
          await sock.sendMessage(from, { 
            text: '❌ Gagal buat sticker. Coba kirim ulang media.' 
          });
        }
      }

      // ===== AI CHAT (PAKE SIMI GRATIS) =====
      else if (command === 'ai' || command === 'ask') {
        const question = args.join(' ');
        if (!question) {
          await sock.sendMessage(from, { 
            text: `❌ Masukkan pertanyaan.\nContoh: ${prefix}ai siapa presiden Indonesia?` 
          });
          return;
        }

        await sock.sendPresenceUpdate('composing', from);
        
        try {
          // PAKE SIMI (GRATIS!)
          const response = await axios.get(APIS.simi, {
            params: { text: question, lc: 'id' }
          });
          
          const answer = response.data.message || 'Maaf, saya tidak mengerti.';
          await sock.sendMessage(from, { text: `🤖 *AI:*\n${answer}` });
          
        } catch (err) {
          // FALLBACK: Google Search simpel
          try {
            const search = await axios.get(`https://api.duckduckgo.com/?q=${encodeURIComponent(question)}&format=json`);
            const result = search.data.AbstractText || search.data.Answer || 'Tidak ditemukan.';
            await sock.sendMessage(from, { 
              text: `🔍 *Hasil:*\n${result}\n\n📌 Sumber: DuckDuckGo` 
            });
          } catch (e) {
            await sock.sendMessage(from, { 
              text: '❌ AI sedang sibuk. Coba lagi nanti.' 
            });
          }
        }
      }

      // ===== TRANSLATE =====
      else if (command === 'translate' || command === 'tr') {
        const targetLang = args[0] || 'id';
        const textToTranslate = args.slice(1).join(' ');
        
        if (!textToTranslate) {
          await sock.sendMessage(from, { 
            text: `❌ *CARA PAKAI TRANSLATE:*\n${prefix}translate [kode_bahasa] [teks]\n\nContoh:\n${prefix}translate en halo dunia\n${prefix}translate ja selamat pagi` 
          });
          return;
        }

        try {
          const result = await translate(textToTranslate, { to: targetLang });
          await sock.sendMessage(from, {
            text: `🌐 *TRANSLATE:*\n\n📝 *Asli:*\n${textToTranslate}\n\n✍️ *Hasil (${targetLang}):*\n${result.text}`
          });
        } catch (err) {
          await sock.sendMessage(from, { 
            text: '❌ Gagal translate. Pastikan kode bahasa benar.' 
          });
        }
      }

      // ===== WEATHER =====
      else if (command === 'weather') {
        const city = args.join(' ');
        if (!city) {
          await sock.sendMessage(from, { 
            text: `❌ Masukkan nama kota.\nContoh: ${prefix}weather jakarta` 
          });
          return;
        }

        try {
          const response = await axios.get(`${APIS.weather}/${encodeURIComponent(city)}?format=j1`);
          const data = response.data;
          const current = data.current_condition[0];
          const temp = current.temp_C;
          const desc = current.weatherDesc[0].value;
          const humidity = current.humidity;
          const wind = current.windSpeedKmph;

          await sock.sendMessage(from, {
            text: `🌤️ *CUACA: ${city.toUpperCase()}*

🌡️ Suhu: ${temp}°C
☁️ Kondisi: ${desc}
💧 Kelembaban: ${humidity}%
💨 Kecepatan Angin: ${wind} km/h

📌 Terakhir update: ${current.observation_time}`
          });
        } catch (err) {
          await sock.sendMessage(from, { 
            text: '❌ Kota tidak ditemukan atau API error.' 
          });
        }
      }

      // ===== YOUTUBE SEARCH =====
      else if (command === 'youtube' || command === 'yt') {
        const query = args.join(' ');
        if (!query) {
          await sock.sendMessage(from, { 
            text: `❌ Masukkan judul video.\nContoh: ${prefix}youtube lagu pop` 
          });
          return;
        }

        try {
          const search = await axios.get(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`);
          const $ = cheerio.load(search.data);
          const titles = [];
          const links = [];
          
          $('ytd-video-renderer').slice(0, 5).each((i, el) => {
            const title = $(el).find('#video-title').text().trim();
            const link = $(el).find('#video-title').attr('href');
            if (title && link) {
              titles.push(title);
              links.push(`https://youtube.com${link}`);
            }
          });

          if (titles.length === 0) {
            await sock.sendMessage(from, { text: '❌ Tidak ditemukan video.' });
            return;
          }

          let result = `🎬 *HASIL YOUTUBE:*\n\n`;
          for (let i = 0; i < titles.length; i++) {
            result += `${i+1}. ${titles[i]}\n${links[i]}\n\n`;
          }
          await sock.sendMessage(from, { text: result });
          
        } catch (err) {
          await sock.sendMessage(from, { 
            text: '❌ Gagal mencari video.' 
          });
        }
      }

      // ===== NEWS =====
      else if (command === 'news') {
        try {
          const response = await axios.get(APIS.news, {
            params: {
              country: 'id',
              apiKey: API_KEYS.news,
              pageSize: 5
            }
          });

          const articles = response.data.articles || [];
          if (articles.length === 0) {
            await sock.sendMessage(from, { text: '❌ Tidak ada berita.' });
            return;
          }

          let result = `📰 *BERITA TERBARU*\n\n`;
          for (const article of articles.slice(0, 5)) {
            result += `📌 *${article.title}*\n`;
            result += `📝 ${article.description || 'Tidak ada deskripsi'}\n`;
            result += `🔗 ${article.url}\n\n`;
          }
          await sock.sendMessage(from, { text: result });
          
        } catch (err) {
          await sock.sendMessage(from, { 
            text: '❌ Gagal mengambil berita.' 
          });
        }
      }

      // ===== QRAN =====
      else if (command === 'quran') {
        const surah = parseInt(args[0]) || 1;
        if (surah < 1 || surah > 114) {
          await sock.sendMessage(from, { 
            text: '❌ Surah harus 1-114' 
          });
          return;
        }

        try {
          const response = await axios.get(`${APIS.quran}/${surah}`);
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

      // ===== CRYPTO =====
      else if (command === 'crypto') {
        const coin = args[0]?.toLowerCase() || 'bitcoin';
        try {
          const response = await axios.get(APIS.crypto, {
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
            text: `💰 *${coin.toUpperCase()}*

💵 USD: $${data.usd}
🇮🇩 IDR: Rp${data.idr.toLocaleString('id')}

📌 Update terakhir: ${new Date().toLocaleString('id-ID')}`
          });
        } catch (err) {
          await sock.sendMessage(from, { 
            text: '❌ Gagal mengambil data crypto.' 
          });
        }
      }

      // ===== GITHUB =====
      else if (command === 'github') {
        const username = args[0];
        if (!username) {
          await sock.sendMessage(from, { 
            text: `❌ Masukkan username GitHub.\nContoh: ${prefix}github torvalds` 
          });
          return;
        }

        try {
          const response = await axios.get(`${APIS.github}/${username}`);
          const data = response.data;
          
          await sock.sendMessage(from, {
            text: `🐙 *GITHUB: ${data.login}*

📛 Nama: ${data.name || 'Tidak ada'}
📝 Bio: ${data.bio || 'Tidak ada'}
📍 Lokasi: ${data.location || 'Tidak ada'}
🏢 Company: ${data.company || 'Tidak ada'}

📊 Stats:
• Repositori: ${data.public_repos}
• Gists: ${data.public_gists}
• Followers: ${data.followers}
• Following: ${data.following}

🔗 Profil: ${data.html_url}`
          });
        } catch (err) {
          await sock.sendMessage(from, { 
            text: '❌ User GitHub tidak ditemukan.' 
          });
        }
      }

      // ===== WIKIPEDIA =====
      else if (command === 'wikipedia' || command === 'wiki') {
        const query = args.join(' ');
        if (!query) {
          await sock.sendMessage(from, { 
            text: `❌ Masukkan kata kunci.\nContoh: ${prefix}wikipedia jakarta` 
          });
          return;
        }

        try {
          const response = await axios.get(`${APIS.wikipedia}/${encodeURIComponent(query)}`);
          const data = response.data;
          
          if (!data.extract) {
            await sock.sendMessage(from, { 
              text: '❌ Tidak ditemukan di Wikipedia.' 
            });
            return;
          }

          await sock.sendMessage(from, {
            text: `📚 *WIKIPEDIA: ${data.title}*

${data.extract.slice(0, 1500)}${data.extract.length > 1500 ? '...' : ''}

🔗 Baca selengkapnya: ${data.content_urls?.desktop?.page || 'https://wikipedia.org'}`
          });
        } catch (err) {
          await sock.sendMessage(from, { 
            text: '❌ Gagal mengambil data Wikipedia.' 
          });
        }
      }

      // ===== LYRIC =====
      else if (command === 'lyrics' || command === 'lirik') {
        const query = args.join(' ');
        if (!query) {
          await sock.sendMessage(from, { 
            text: `❌ Masukkan judul lagu.\nContoh: ${prefix}lyrics bohemian rhapsody` 
          });
          return;
        }

        try {
          const [artist, title] = query.split(' - ');
          const response = await axios.get(`${APIS.lyrics}/${artist}/${title}`);
          const lyrics = response.data.lyrics;
          
          if (!lyrics) {
            await sock.sendMessage(from, { 
              text: '❌ Lirik tidak ditemukan.' 
            });
            return;
          }

          await sock.sendMessage(from, {
            text: `🎵 *LIRIK: ${title} - ${artist}*\n\n${lyrics.slice(0, 2000)}${lyrics.length > 2000 ? '...' : ''}`
          });
        } catch (err) {
          await sock.sendMessage(from, { 
            text: '❌ Gagal mencari lirik.' 
          });
        }
      }

      // ===== MOVIE =====
      else if (command === 'movie') {
        const query = args.join(' ');
        if (!query) {
          await sock.sendMessage(from, { 
            text: `❌ Masukkan judul film.\nContoh: ${prefix}movie avengers` 
          });
          return;
        }

        try {
          const response = await axios.get(`${APIS.movie}?q=${encodeURIComponent(query)}`);
          const shows = response.data;
          
          if (shows.length === 0) {
            await sock.sendMessage(from, { 
              text: '❌ Film tidak ditemukan.' 
            });
            return;
          }

          const show = shows[0].show;
          let result = `🎬 *${show.name}*\n`;
          if (show.genres.length) result += `📌 Genre: ${show.genres.join(', ')}\n`;
          if (show.premiered) result += `📅 Rilis: ${show.premiered}\n`;
          if (show.rating?.average) result += `⭐ Rating: ${show.rating.average}/10\n`;
          if (show.summary) {
            const summary = show.summary.replace(/<[^>]*>/g, '');
            result += `\n📝 ${summary.slice(0, 500)}...\n`;
          }
          if (show.url) result += `\n🔗 ${show.url}`;
          
          await sock.sendMessage(from, { text: result });
        } catch (err) {
          await sock.sendMessage(from, { 
            text: '❌ Gagal mencari film.' 
          });
        }
      }

      // ===== DOWNLOAD INSTAGRAM =====
      else if (command === 'instagram' || command === 'ig') {
        const url = args[0];
        if (!url || !url.includes('instagram.com')) {
          await sock.sendMessage(from, { 
            text: `❌ Masukkan URL Instagram.\nContoh: ${prefix}ig https://instagram.com/p/xxx` 
          });
          return;
        }

        try {
          await sock.sendPresenceUpdate('composing', from);
          const response = await axios.get(`${APIS.instagram}?url=${encodeURIComponent(url)}`);
          const data = response.data;
          
          if (!data.success || !data.result) {
            await sock.sendMessage(from, { text: '❌ Gagal download Instagram.' });
            return;
          }

          // Kirim media
          for (const media of data.result.slice(0, 3)) {
            await sock.sendMessage(from, { 
              image: { url: media.url },
              caption: '📸 *Instagram Download*\n📌 By Fosh Bot'
            });
          }
          
        } catch (err) {
          await sock.sendMessage(from, { 
            text: '❌ Gagal download Instagram.' 
          });
        }
      }

      // ===== DOWNLOAD TIKTOK =====
      else if (command === 'tiktok' || command === 'tt') {
        const url = args[0];
        if (!url || !url.includes('tiktok.com')) {
          await sock.sendMessage(from, { 
            text: `❌ Masukkan URL TikTok.\nContoh: ${prefix}tt https://tiktok.com/@xxx` 
          });
          return;
        }

        try {
          await sock.sendPresenceUpdate('composing', from);
          const response = await axios.get(`${APIS.tiktok}?url=${encodeURIComponent(url)}`);
          const data = response.data;
          
          if (!data.success || !data.result) {
            await sock.sendMessage(from, { text: '❌ Gagal download TikTok.' });
            return;
          }

          await sock.sendMessage(from, {
            video: { url: data.result.download },
            caption: `🎵 *TikTok Download*\n📌 By Fosh Bot\n\n${data.result.title || ''}`
          });
          
        } catch (err) {
          await sock.sendMessage(from, { 
            text: '❌ Gagal download TikTok.' 
          });
        }
      }

      // ===== GROUP COMMANDS =====
      else if (command === 'group' && isGroup) {
        const sub = args[0]?.toLowerCase();
        const metadata = await sock.groupMetadata(from);
        const isAdmin = metadata.participants.some(p => 
          p.id === sender && p.admin
        );

        if (!isAdmin) {
          await sock.sendMessage(from, { 
            text: '❌ Hanya admin grup yang bisa menggunakan command ini.' 
          });
          return;
        }

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

        else if (sub === 'welcome') {
          await db.read();
          db.data.groups[from] ||= {};
          db.data.groups[from].welcome = !db.data.groups[from].welcome;
          await db.write();
          await sock.sendMessage(from, { 
            text: `✅ Welcome message ${db.data.groups[from].welcome ? 'diaktifkan' : 'dinonaktifkan'}.` 
          });
        }

        else if (sub === 'goodbye') {
          await db.read();
          db.data.groups[from] ||= {};
          db.data.groups[from].goodbye = !db.data.groups[from].goodbye;
          await db.write();
          await sock.sendMessage(from, { 
            text: `✅ Goodbye message ${db.data.groups[from].goodbye ? 'diaktifkan' : 'dinonaktifkan'}.` 
          });
        }

        else if (sub === 'delete' || sub === 'del') {
          const quotedMsg = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
          if (quotedMsg) {
            const key = msg.message.extendedTextMessage.contextInfo.stanzaId;
            await sock.sendMessage(from, { delete: { remoteJid: from, fromMe: true, id: key } });
          }
        }

        else if (sub === 'tagall') {
          const members = metadata.participants.map(p => `@${p.id.split('@')[0]}`).join(' ');
          await sock.sendMessage(from, {
            text: `📢 *TAG ALL*\n\n${members}`,
            mentions: metadata.participants.map(p => p.id)
          });
        }

        else {
          await sock.sendMessage(from, {
            text: `👥 *GROUP COMMANDS:*
.group link - Link grup
.group welcome - Toggle welcome
.group goodbye - Toggle goodbye
.group delete - Hapus pesan bot
.group tagall - Tag semua member`
          });
        }
      }

      // ===== SETPREFIX (OWNER ONLY) =====
      else if (command === 'setprefix') {
        if (sender !== '6281234567890@s.whatsapp.net') {
          await sock.sendMessage(from, { text: '❌ Only owner!' });
          return;
        }
        const newPrefix = args[0] || '.';
        db.data.settings.prefix = newPrefix;
        await db.write();
        await sock.sendMessage(from, { 
          text: `✅ Prefix diubah menjadi: ${newPrefix}` 
        });
      }

      // ===== BROADCAST (OWNER ONLY) =====
      else if (command === 'broadcast' || command === 'bc') {
        if (sender !== '6281234567890@s.whatsapp.net') {
          await sock.sendMessage(from, { text: '❌ Only owner!' });
          return;
        }
        const message = args.join(' ');
        if (!message) {
          await sock.sendMessage(from, { 
            text: '❌ Masukkan pesan broadcast.' 
          });
          return;
        }

        await sock.sendMessage(from, { text: '📨 Broadcast sedang dikirim...' });
        
        const chats = await sock.groupFetchAllParticipating();
        let sent = 0;
        for (const [jid] of Object.entries(chats)) {
          try {
            await sock.sendMessage(jid, { 
              text: `📢 *BROADCAST*\n\n${message}` 
            });
            sent++;
            await new Promise(r => setTimeout(r, 1000));
          } catch (err) {}
        }
        
        await sock.sendMessage(from, { 
          text: `✅ Broadcast terkirim ke ${sent} grup/chat.` 
        });
      }

      // ===== COMMAND NOT FOUND =====
      else {
        await sock.sendMessage(from, { 
          text: `❌ Command "${command}" tidak ditemukan.\nKetik ${prefix}menu untuk bantuan.` 
        });
      }
    }

    // ============ AUTO AI (TANPA COMMAND) ============
    else if (isGroup && text) {
      // Auto reply di grup bisa diaktifkan
      // await sock.sendMessage(from, { text: '🤖 Auto reply aktif...' });
    }
  });

  // ============ GROUP PARTICIPANT UPDATE ============
  sock.ev.on('group-participants.update', async (update) => {
    const { id, participants, action } = update;
    await db.read();
    const group = db.data.groups[id] || {};
    
    if (action === 'add' && group.welcome) {
      for (const participant of participants) {
        await sock.sendMessage(id, {
          text: `👋 *WELCOME TO GROUP!*\n\n@${participant.split('@')[0]}, selamat datang di grup!\n\n📌 Baca deskripsi grup ya!`,
          mentions: [participant]
        });
      }
    }
    
    if (action === 'remove' && group.goodbye) {
      for (const participant of participants) {
        await sock.sendMessage(id, {
          text: `👋 *GOODBYE!*\n\n@${participant.split('@')[0]} telah meninggalkan grup.\nSemoga sukses selalu! 🙏`,
          mentions: [participant]
        });
      }
    }
  });

  return sock;
}

// ============ START ============
startBot().catch(console.error);

console.log(`
╔═══════════════════════════════════════╗
║          🤖 FOSH BOT v2.0            ║
║        WhatsApp Bot Full Fitur       ║
║                                      ║
║  ⏳ Starting bot...                  ║
║  📱 Scan QR Code di terminal         ║
║                                      ║
║  📌 Created by Fosh Team             ║
╚═══════════════════════════════════════╝
`);
