/**
 * 环境配置文件
 * 根据不同环境提供不同的配置
 */

const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    baseAPI: 'http://localhost:5678',
    aiAPI: 'https://cloud.dify.ai', // 默认Dify云服务地址，请根据实际情况修改
    title: '灵犀教育 - 开发环境',
    debug: true,
    websocketURL: 'ws://localhost:5678/ws',
    uploadURL: 'http://localhost:5678/upload',
    cdnURL: 'http://localhost:5678',
    timeout: 15000
  },
  production: {
    baseAPI: process.env.VUE_APP_BASE_API || 'https://api.yourdomain.com',
    aiAPI: process.env.VUE_APP_AI_API || 'https://ai.yourdomain.com',
    title: '灵犀教育',
    debug: false,
    websocketURL: process.env.VUE_APP_WS_URL || 'wss://api.yourdomain.com/ws',
    uploadURL: process.env.VUE_APP_UPLOAD_URL || 'https://api.yourdomain.com/upload',
    cdnURL: process.env.VUE_APP_CDN_URL || 'https://cdn.yourdomain.com',
    timeout: 30000
  },
  testing: {
    baseAPI: 'http://test-api.yourdomain.com',
    aiAPI: 'http://test-ai.yourdomain.com',
    title: '灵犀教育 - 测试环境',
    debug: true,
    websocketURL: 'ws://test-api.yourdomain.com/ws',
    uploadURL: 'http://test-api.yourdomain.com/upload',
    cdnURL: 'http://test-cdn.yourdomain.com',
    timeout: 20000
  }
};

export default config[env];
