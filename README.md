# 🤖 FOSH BOT - WhatsApp Bot Full Fitur

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18-green)
![License](https://img.shields.io/badge/license-MIT-orange)
![Stars](https://img.shields.io/github/stars/nargeloooooooooooooooo/fosh-bot-wa)
![Forks](https://img.shields.io/github/forks/nargeloooooooooooooooo/fosh-bot-wa)
![Issues](https://img.shields.io/github/issues/nargeloooooooooooooooo/fosh-bot-wa)

> **WhatsApp Bot Open Source dengan 40+ fitur, mudah dikustomisasi, dan siap pakai!**

[Dokumentasi](#-dokumentasi-lengkap) •
[Instalasi](#-instalasi) •
[Fitur](#-fitur-lengkap) •
[Command](#-daftar-command) •
[Kontribusi](#-kontribusi)

</div>

---

## 📌 Tentang Fosh Bot

**Fosh Bot** adalah WhatsApp Bot modern yang dibangun dengan library **Baileys** (Multi-Device Support). Bot ini dirancang untuk memberikan pengalaman interaksi yang lengkap dengan berbagai fitur:

- 🤖 **AI Chat** dengan Gemini/OpenAI
- 🎨 **Sticker Maker** dari gambar/video
- 📥 **Downloader** Instagram, TikTok, YouTube
- 🌤️ **Utility Tools** (Cuaca, Quran, Crypto, dll)
- 👥 **Group Management** (Welcome, Goodbye, Tagall)
- 🔧 **Owner Control** (Broadcast, Ban, Premium User)

---

## ✨ Fitur Lengkap

### 📱 **Core System**
| Fitur | Status | Keterangan |
|-------|--------|------------|
| Multi-Device Support | ✅ | Bisa digunakan di semua perangkat WhatsApp |
| Auto Reconnect | ✅ | Otomatis terhubung kembali jika putus |
| Session Persistent | ✅ | Session tersimpan, tidak perlu scan ulang |
| Anti Call Spam | ✅ | Menolak panggilan otomatis |
| Anti Spam | ✅ | Mencegah spam perintah |
| Database Auto Save | ✅ | Data tersimpan otomatis di JSON |

### 🎨 **Media & Sticker**
| Fitur | Status | Cara Pakai |
|-------|--------|------------|
| Buat Sticker | ✅ | Reply gambar/video dengan `.sticker` |
| Sticker ke Gambar | ✅ | `.toimg` (reply sticker) |
| Buat GIF | ✅ | `.gif` (reply video) |

### 🧠 **AI & Chat**
| Fitur | Status | API |
|-------|--------|-----|
| AI Chat (Gemini) | ✅ (Premium) | Google Gemini API |
| AI Chat (SimSimi) | ✅ (Gratis) | SimSimi API |
| AI Chat (OpenAI) | ✅ (Premium) | OpenAI API |
| Translate | ✅ | Google Translate API |

### 🔍 **Search & Download**
| Fitur | Status | Keterangan |
|-------|--------|------------|
| YouTube Search | ✅ | Mencari video YouTube |
| Wikipedia Search | ✅ | Mencari artikel Wikipedia |
| Berita Terbaru | ✅ | News API (gratis) |
| Lirik Lagu | ✅ | Lyrics.ovh API |
| Info Film | ✅ | TVMaze API |
| Instagram Download | ✅ | Download video/gambar IG |
| TikTok Download | ✅ | Download video TikTok |

### 🌤️ **Utility**
| Fitur | Status | Keterangan |
|-------|--------|------------|
| Info Cuaca | ✅ | Weather API (gratis) |
| Baca Al-Quran | ✅ | Al-Quran Cloud API |
| Harga Crypto | ✅ | CoinGecko API |
| Info GitHub | ✅ | GitHub API |
| Cek Waktu | ✅ | Moment.js |

### 👥 **Group Management**
| Fitur | Status | Keterangan |
|-------|--------|------------|
| Welcome Message | ✅ | Auto welcome saat member baru |
| Goodbye Message | ✅ | Auto goodbye saat member keluar |
| Link Grup | ✅ | Mendapatkan link grup |
| Tag All | ✅ | Tag semua member |
| Hapus Pesan Bot | ✅ | Menghapus pesan bot di grup |

### 🔧 **Owner Only**
| Fitur | Status | Keterangan |
|-------|--------|------------|
| Broadcast | ✅ | Kirim pesan ke semua grup |
| Ban/Unban User | ✅ | Blokir akses user |
| Ganti Prefix | ✅ | Ubah prefix command |
| Tambah Premium User | ✅ | Berikan akses premium |

---

## 🚀 Instalasi

### Prasyarat
- **Node.js** versi 18 atau lebih baru
- **NPM** atau **Yarn**
- **WhatsApp** terinstal di HP

### Langkah Instalasi

#### 1. Clone Repository
```bash
git clone https://github.com/nargeloooooooooooooooo/fosh-bot-wa.git
cd fosh-bot-wa

### 2. Install Dependencies
bash
npm install

### 3. Konfigurasi (WAJIB!)
Buka src/config.js dan ubah bagian ini:
owner: {
  number: '6281234567890', // 🔥 GANTI DENGAN NOMOR WHATSAPP LU!
}

### 4. Setup API Premium (Opsional)
Jika ingin menggunakan fitur premium, isi API key di src/config.js:
apis: {
  gemini: {
    key: 'AIzaSyYourGeminiKeyHere' // Dapatkan di Google AI Studio
  },
  openai: {
    key: 'sk-proj-YourOpenAIKeyHere' // Dapatkan di OpenAI Platform
  },
  news: {
    key: 'your-news-api-key-here' // Dapatkan di NewsAPI.org
  }
}

### 
apis: {
  gemini: {
    key: 'AIzaSyYourGeminiKeyHere' // Dapatkan di Google AI Studio
  },
  openai: {
    key: 'sk-proj-YourOpenAIKeyHere' // Dapatkan di OpenAI Platform
  },
  news: {
    key: 'your-news-api-key-here' // Dapatkan di NewsAPI.org
  }
}
5. Jalankan Bot
bash
npm start
6. Scan QR Code
QR Code akan muncul di terminal

Buka WhatsApp → Perangkat Tertaut → Tautkan Perangkat

Scan QR Code

7. Selesai! 🎉
Bot sudah online dan siap digunakan!

📊 Daftar Command
📱 General Commands
text
.menu / .help     - Tampilkan semua fitur
.ping             - Cek status bot
.info             - Info bot
.owner            - Kontak owner
.time             - Waktu sekarang
.about            - Tentang bot
🎨 Sticker Commands
text
.sticker / .s     - Buat sticker dari gambar/video (reply media)
.toimg            - Ubah sticker ke gambar (reply sticker)
.gif              - Buat GIF dari video (reply video)
🧠 AI Commands
text
.ai [pesan]       - Chat dengan AI (SimSimi/Gemini)
.ask [pertanyaan] - Tanya AI
.translate [kode] [teks] - Translate teks
Contoh Penggunaan:

text
.ai siapa presiden Indonesia?
.translate en Halo dunia
🔍 Search Commands
text
.youtube [query]  - Cari video YouTube
.wikipedia [query] - Cari di Wikipedia
.news             - Berita terbaru
.movie [judul]    - Info film
.lyrics [judul]   - Lirik lagu
Contoh Penggunaan:

text
.youtube lagu pop indonesia
.wikipedia jakarta
.movie avengers
.lyrics bohemian rhapsody
📥 Download Commands
text
.instagram [url]  - Download Instagram
.ig [url]         - Download Instagram (alias)
.tiktok [url]     - Download TikTok
.tt [url]         - Download TikTok (alias)
Contoh Penggunaan:

text
.ig https://instagram.com/p/xxx
.tt https://tiktok.com/@xxx/video/xxx
🌤️ Utility Commands
text
.weather [kota]   - Info cuaca
.quran [surah]    - Baca Quran
.crypto [coin]    - Harga crypto
.github [username] - Info GitHub
.whois [nomor]    - Cek nomor
Contoh Penggunaan:

text
.weather jakarta
.quran 1
.crypto bitcoin
.github torvalds
👥 Group Commands
text
.group link       - Link grup
.group welcome    - Aktifkan welcome message
.group goodbye    - Aktifkan goodbye message
.group tagall     - Tag semua member
.group delete     - Hapus pesan bot
Contoh Penggunaan:

text
.group link
.group tagall
🔧 Owner Commands
text
.broadcast [pesan] - Broadcast ke semua grup
.ban [nomor]       - Ban user
.unban [nomor]     - Unban user
.setprefix [prefix] - Ganti prefix
.addpremium [nomor] - Tambah premium user
.delpremium [nomor] - Hapus premium user
Contoh Penggunaan:

text
.broadcast Halo semua!
.ban 6281234567890
.setprefix !
.addpremium 6281234567890
🔧 Konfigurasi Lanjutan
Mengubah Prefix
Edit src/config.js:

javascript
bot: {
  prefix: '.' // Ganti dengan prefix yang diinginkan
}
Atau via command:

text
.setprefix !
Custom Welcome/Goodbye Message
Edit src/config.js:

javascript
messages: {
  welcome: `👋 *WELCOME!*\n\n@user, selamat datang di grup!`,
  goodbye: `👋 *GOODBYE!*\n\n@user telah pergi. Semoga sukses!`
}
Menambahkan Premium User
Edit src/database/database.json:

json
{
  "premium": {
    "6281234567890@s.whatsapp.net": true,
    "6280987654321@s.whatsapp.net": true
  }
}
Atau via command:

text
.addpremium 6281234567890
Mengubah Limit Harian
Edit src/config.js:

javascript
limits: {
  daily: 25,      // Limit user biasa
  premium: 100,   // Limit premium user
  owner: -1       // Unlimited
}
📁 Struktur File
text
fosh-bot/
├── src/
│   ├── index.js              # Entry point utama
│   ├── config.js             # Semua konfigurasi
│   ├── database/
│   │   ├── db.js             # Database handler
│   │   └── database.json     # Data storage (auto generated)
│   ├── handlers/
│   │   ├── messageHandler.js # Handler pesan
│   │   └── commandHandler.js # Handler command
│   ├── commands/
│   │   ├── general.js        # General commands
│   │   ├── media.js          # Sticker commands
│   │   ├── ai.js             # AI commands
│   │   ├── download.js       # Download commands
│   │   ├── group.js          # Group commands
│   │   ├── utility.js        # Utility commands
│   │   └── owner.js          # Owner commands
│   ├── utils/
│   │   ├── api.js            # API integration
│   │   ├── helper.js         # Helper functions
│   │   └── logger.js         # Logger
│   └── plugins/
│       └── index.js          # Plugin loader
├── session/                  # Auth session (auto generated)
├── package.json
├── README.md
├── LICENSE                   # Lisensi MIT
└── .gitignore
🛠️ Troubleshooting
❌ QR Code Tidak Muncul
bash
rm -rf session/
npm start
❌ Error "Cannot find module"
bash
npm install --force
❌ Bot Tidak Balas
Cek koneksi internet

Cek folder session

Restart bot dengan npm start

Cek log error di terminal

❌ Session Expired
bash
rm -rf session/
npm start
❌ Bot Error Terus
bash
# Backup database dulu
cp src/database/database.json database_backup.json

# Reset database dan session
rm -rf src/database/database.json
rm -rf session/
npm start
📦 Deployment
Deploy dengan PM2 (Rekomendasi)
bash
# Install PM2
npm install -g pm2

# Jalankan bot
pm2 start src/index.js --name fosh-bot

# Monitoring
pm2 logs fosh-bot

# Save dan Startup
pm2 save
pm2 startup
Deploy di VPS (Ubuntu/Debian)
bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone & Install
git clone https://github.com/nargeloooooooooooooooo/fosh-bot-wa.git
cd fosh-bot-wa
npm install --production

# Install PM2
npm install -g pm2
pm2 start src/index.js --name fosh-bot
pm2 save
pm2 startup
Deploy dengan Nodemon (Development)
bash
npm install -g nodemon
npm run dev
🤝 Kontribusi
Kami sangat terbuka untuk kontribusi! Berikut cara berkontribusi:

1. Fork Repository
Fork repository ini ke akun GitHub-mu.

2. Clone Fork
bash
git clone https://github.com/username-mu/fosh-bot-wa.git
cd fosh-bot-wa
3. Buat Branch Baru
bash
git checkout -b fitur-baru
4. Lakukan Perubahan
Tambahkan fitur atau perbaiki bug.

5. Commit Perubahan
bash
git add .
git commit -m "Tambah fitur [nama-fitur]"
6. Push ke GitHub
bash
git push origin fitur-baru
7. Buat Pull Request
Buka repository asli dan buat Pull Request.

Panduan Kontribusi
Gunakan ESLint untuk konsistensi kode

Tambahkan dokumentasi untuk fitur baru

Pastikan tidak merusak fitur yang sudah ada

Test fitur sebelum commit

👨‍💻 Developer
Fosh Team (kknarz)

GitHub: @nargeloooooooooooooooo
Tiktok: @NAR1LON
Instagram: @nar.psl
Email: admin@naraaa.work.gd

⭐ Support
Jika project ini membantu, dukung kami dengan:
⭐ Star repository ini
👥 Share ke teman-teman
💬 Feedback untuk pengembangan
🐛 Laporkan bug jika menemukan masalah

📊 Statistik Project
https://img.shields.io/github/stars/nargeloooooooooooooooo/fosh-bot-wa
https://img.shields.io/github/forks/nargeloooooooooooooooo/fosh-bot-wa
https://img.shields.io/github/issues/nargeloooooooooooooooo/fosh-bot-wa
https://img.shields.io/github/issues-pr/nargeloooooooooooooooo/fosh-bot-wa
https://img.shields.io/github/contributors/nargeloooooooooooooooo/fosh-bot-wa
https://img.shields.io/github/last-commit/nargeloooooooooooooooo/fosh-bot-wa

🙏 Terima Kasih
Terima kasih telah menggunakan Fosh Bot! Semoga bot ini bermanfaat untuk kebutuhanmu.

Dibuat dengan ❤️ oleh Fosh Team (kknarz)

<div align="center">
⬆ Kembali ke Atas

</div> ```
