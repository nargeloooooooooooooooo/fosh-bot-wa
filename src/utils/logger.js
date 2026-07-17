// ============================================
// 📝 LOGGER UTILITY
// ============================================

const chalk = require('chalk');

const logger = {
  info: (message, ...args) => {
    console.log(chalk.blue('ℹ️'), message, ...args);
  },
  
  success: (message, ...args) => {
    console.log(chalk.green('✅'), message, ...args);
  },
  
  warn: (message, ...args) => {
    console.log(chalk.yellow('⚠️'), message, ...args);
  },
  
  error: (message, ...args) => {
    console.log(chalk.red('❌'), message, ...args);
  },
  
  debug: (message, ...args) => {
    if (process.env.DEBUG) {
      console.log(chalk.gray('🐛'), message, ...args);
    }
  }
};

module.exports = { logger };
