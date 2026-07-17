// ============================================
// 🔧 HELPER FUNCTIONS
// ============================================

const moment = require('moment-timezone');
const config = require('../config');

function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
}

function formatNumber(number) {
  return number.replace(/[^0-9]/g, '');
}

function parseCommand(text, prefix) {
  const parts = text.slice(prefix.length).trim().split(/\s+/);
  return {
    command: parts[0]?.toLowerCase() || '',
    args: parts.slice(1)
  };
}

function getTime() {
  return moment().tz(config.bot.timezone).format('HH:mm:ss');
}

function getDate() {
  return moment().tz(config.bot.timezone).format('DD MMMM YYYY');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  formatRupiah,
  formatNumber,
  parseCommand,
  getTime,
  getDate,
  sleep,
  randomNumber
};
