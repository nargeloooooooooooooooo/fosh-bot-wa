const { parseCommand } = require('../utils/helper');

async function handleMessage(sock, msg, plugins) {
  const from = msg.key.remoteJid;
  const text = msg.message.conversation || 
               msg.message.extendedTextMessage?.text || '';

  // Cek apakah command
  const prefix = '.';
  if (text.startsWith(prefix)) {
    const { command, args } = parseCommand(text, prefix);
    
    // Cari plugin yang sesuai
    for (const plugin of plugins) {
      if (plugin.command === command) {
        try {
          await plugin.execute(sock, msg, args);
        } catch (err) {
          console.error('Plugin error:', err);
          await sock.sendMessage(from, { 
            text: '❌ Error: ' + err.message 
          });
        }
        return;
      }
    }

    // Command tidak ditemukan
    await sock.sendMessage(from, { 
      text: '❌ Command tidak ditemukan. Ketik .menu untuk bantuan.' 
    });
    return;
  }

  // Pesan biasa - proses dengan AI [citation:3]
  for (const plugin of plugins) {
    if (plugin.type === 'ai' && plugin.enabled) {
      try {
        await plugin.process(sock, msg, text);
      } catch (err) {
        console.error('AI Error:', err);
      }
      return;
    }
  }
}

module.exports = { handleMessage };
