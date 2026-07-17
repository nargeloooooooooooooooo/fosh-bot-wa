// ============================================
// 🔥 FOSH BOT - CONFIGURATION
// SEMUA PENGATURAN DI SINI!
// ============================================

module.exports = {
  // ==================== BOT IDENTITY ====================
  bot: {
    name: 'Fosh Bot',
    version: '2.0.0',
    prefix: '.',
    mode: 'public', // 'public' | 'self' | 'private'
    timezone: 'Asia/Jakarta',
    language: 'id',
    emoji: '🤖',
    description: 'WhatsApp Bot Full Fitur Open Source'
  },

  // ==================== OWNER CONFIG ====================
  owner: {
    name: 'Fosh Team',
    number: '6281234567890', // 🔥 GANTI DENGAN NOMOR WHATSAPP LU!
    numbers: [
      '6281234567890', // Owner utama
      '6280987654321'  // Owner cadangan (optional)
    ],
    github: 'https://github.com/fosh-team',
    instagram: '@fosh_team',
    email: 'fosh.team@example.com'
  },

  // ==================== API KEYS ====================
  apis: {
    // ----- FREE APIS (NO KEY NEEDED) -----
    simi: {
      url: 'https://api.simsimi.vn/v1/simtalk',
      free: true
    },
    
    weather: {
      url: 'https://wttr.in',
      free: true
    },
    
    quran: {
      url: 'https://api.alquran.cloud/v1',
      free: true
    },
    
    crypto: {
      url: 'https://api.coingecko.com/api/v3/simple/price',
      free: true
    },
    
    movie: {
      url: 'https://api.tvmaze.com/search/shows',
      free: true
    },
    
    lyrics: {
      url: 'https://api.lyrics.ovh/v1',
      free: true
    },
    
    wikipedia: {
      url: 'https://en.wikipedia.org/api/rest_v1/page/summary',
      free: true
    },

    // ----- PREMIUM APIS (ISI KEY UNTUK AKSES) -----
    gemini: {
      url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      key: '', // 🔥 ISI DENGAN GEMINI API KEY LU
      free: false,
      getUrl: (key) => `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${key}`
    },

    openai: {
      url: 'https://api.openai.com/v1/chat/completions',
      key: '', // 🔥 ISI DENGAN OPENAI API KEY LU
      model: 'gpt-4o-mini',
      free: false
    },

    news: {
      url: 'https://newsapi.org/v2/top-headlines',
      key: '', // 🔥 ISI DENGAN NEWS API KEY LU
      free: false
    },

    instagram: {
      url: 'https://api.hadiah.my.id/api/ig',
      key: '',
      free: false
    },

    tiktok: {
      url: 'https://api.hadiah.my.id/api/tiktok',
      key: '',
      free: false
    }
  },

  // ==================== DATABASE ====================
  database: {
    path: './src/database/database.json',
    backup: './src/database/backup.json'
  },

  // ==================== LIMITS ====================
  limits: {
    daily: 25,      // Limit per hari untuk user biasa
    premium: 100,   // Limit untuk premium user
    owner: -1       // Unlimited
  },

  // ==================== STICKER ====================
  sticker: {
    packname: 'Fosh Bot',
    author: '🤖',
    quality: 80
  },

  // ==================== ANTI SPAM ====================
  antispam: {
    enabled: true,
    maxPerMinute: 5,
    cooldown: 10000 // 10 detik
  },

  // ==================== FEATURES TOGGLE ====================
  features: {
    autoAI: false,      // Auto reply di grup
    welcome: true,      // Welcome message default
    goodbye: true,      // Goodbye message default
    antiCall: true,     // Tolak panggilan otomatis
    antiLink: false,    // Hapus link di grup
    antiSpam: true      // Anti spam
  },

  // ==================== MESSAGES ====================
  messages: {
    welcome: `👋 *WELCOME TO GROUP!*\n\n@user, selamat datang di grup!\n\n📌 Baca deskripsi grup ya!`,
    goodbye: `👋 *GOODBYE!*\n\n@user telah meninggalkan grup.\nSemoga sukses selalu! 🙏`,
    notAdmin: '❌ Hanya admin grup yang bisa menggunakan command ini.',
    onlyOwner: '❌ Command ini hanya untuk owner bot.',
    error: '❌ Terjadi kesalahan. Coba lagi nanti.'
  }
};
