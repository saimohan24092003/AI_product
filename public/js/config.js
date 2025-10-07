// API Configuration for CourseCraft AI
const API_CONFIG = {
  // Production Backend URL (Vercel)
  BACKEND_URL: 'https://ai-product-backend-pied.vercel.app',

  // API Endpoints
  ENDPOINTS: {
    HEALTH: '/api/health',
    AUTH: '/api/auth',
    CHAT: '/api/chat',
    STRATEGY: '/api/strategy',
    UPLOAD: '/api/upload',
    ANALYSIS: '/api/analysis'
  },

  // Helper function to get full API URL
  getApiUrl: function(endpoint) {
    return this.BACKEND_URL + (endpoint || '');
  }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = API_CONFIG;
}
