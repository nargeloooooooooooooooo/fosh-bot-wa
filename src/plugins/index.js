// ============================================
// 🔌 PLUGIN LOADER
// ============================================

const fs = require('fs');
const path = require('path');
const { logger } = require('../utils/logger');

class PluginManager {
  constructor() {
    this.plugins = new Map();
    this.pluginDir = path.join(__dirname);
  }

  async loadPlugins() {
    const files = fs.readdirSync(this.pluginDir)
      .filter(f => f.endsWith('.js') && f !== 'index.js');

    for (const file of files) {
      try {
        const plugin = require(path.join(this.pluginDir, file));
        if (plugin.name) {
          this.plugins.set(plugin.name, plugin);
          logger.success(`✅ Loaded plugin: ${plugin.name}`);
        }
      } catch (err) {
        logger.error(`Failed to load plugin ${file}:`, err);
      }
    }

    return this.plugins;
  }

  getPlugin(name) {
    return this.plugins.get(name);
  }

  async executePlugin(name, ...args) {
    const plugin = this.getPlugin(name);
    if (!plugin) {
      throw new Error(`Plugin ${name} not found`);
    }
    return plugin.execute(...args);
  }
}

module.exports = new PluginManager();
