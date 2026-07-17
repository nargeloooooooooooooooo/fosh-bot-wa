// ============================================
// 🌐 API INTEGRATION
// ============================================

const axios = require('axios');
const config = require('../config');
const { logger } = require('./logger');

class API {
  static async get(endpoint, params = {}) {
    try {
      const response = await axios.get(endpoint, { params });
      return response.data;
    } catch (err) {
      logger.error(`API Error (GET ${endpoint}):`, err);
      throw err;
    }
  }

  static async post(endpoint, data = {}, headers = {}) {
    try {
      const response = await axios.post(endpoint, data, { headers });
      return response.data;
    } catch (err) {
      logger.error(`API Error (POST ${endpoint}):`, err);
      throw err;
    }
  }

  static async aiChat(message) {
    // Try Gemini if available
    if (config.apis.gemini.key) {
      try {
        const response = await this.post(
          config.apis.gemini.getUrl(config.apis.gemini.key),
          {
            contents: [{
              parts: [{ text: message }]
            }]
          }
        );
        return response.candidates?.[0]?.content?.parts?.[0]?.text;
      } catch (err) {
        logger.warn('Gemini failed, falling back to SimSimi');
      }
    }

    // Fallback to SimSimi
    const response = await this.get(config.apis.simi.url, {
      text: message,
      lc: 'id'
    });
    return response.message;
  }

  static async weather(city) {
    const response = await this.get(`${config.apis.weather.url}/${encodeURIComponent(city)}?format=j1`);
    return response.current_condition[0];
  }

  static async quran(surah) {
    const response = await this.get(`${config.apis.quran.url}/surah/${surah}`);
    return response.data;
  }

  static async crypto(coin) {
    const response = await this.get(config.apis.crypto.url, {
      ids: coin,
      vs_currencies: 'usd,idr'
    });
    return response[coin];
  }

  static async github(username) {
    const response = await this.get(`https://api.github.com/users/${username}`);
    return response;
  }
}

module.exports = { API };
