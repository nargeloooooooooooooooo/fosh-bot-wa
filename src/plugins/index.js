const fs = require('fs');
const path = require('path');

async function loadPlugins() {
  const pluginDir = path.join(__dirname);
  const plugins = [];

  const files = fs.readdirSync(pluginDir)
    .filter(f => f.endsWith('.js') && f !== 'index.js');

  for (const file of files) {
    try {
      const plugin = require(path.join(pluginDir, file));
      if (plugin.command || plugin.type === 'ai') {
        plugins.push(plugin);
        console.log(`✅ Loaded plugin: ${plugin.name || file}`);
      }
    } catch (err) {
      console.error(`❌ Failed load ${file}:`, err);
    }
  }

  return plugins;
}

module.exports = { loadPlugins };
