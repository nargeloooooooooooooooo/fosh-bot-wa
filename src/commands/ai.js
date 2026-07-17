// ============================================
// 🧠 AI COMMANDS
// ============================================

const axios = require('axios');
const config = require('../config');
const { logger } = require('../utils/logger');

module.exports = {
  name: 'ai',
  aliases: ['ask'],
  description: 'Chat dengan AI',
  
  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;
    const question = args.join(' ');
    
    if (!question) {
      await sock.sendMessage(from, {
        text: `❌ Masukkan pertanyaan.\nContoh: .ai siapa presiden Indonesia?`
      });
      return;
    }

    await sock.sendPresenceUpdate('composing', from);
    
    try {
      // Try Gemini first (if key available)
      if (config.apis.gemini.key) {
        const response = await axios.post(
          config.apis.gemini.getUrl(config.apis.gemini.key),
          {
            contents: [{
              parts: [{ text: question }]
            }]
          }
        );
        
        const answer = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (answer) {
          await sock.sendMessage(from, {
            text: `🤖 *AI (Gemini):*\n\n${answer}`
          });
          return;
        }
      }
      
      // Fallback to SimSimi (free)
      const response = await axios.get(config.apis.simi.url, {
        params: { text: question, lc: 'id' }
      });
      
      const answer = response.data.message || 'Maaf, saya tidak mengerti.';
      await sock.sendMessage(from, {
        text: `🤖 *AI:*\n\n${answer}`
      });
      
    } catch (err) {
      logger.error('AI Error:', err);
      await sock.sendMessage(from, {
        text: '❌ AI sedang sibuk. Coba lagi nanti.'
      });
    }
  }
};
