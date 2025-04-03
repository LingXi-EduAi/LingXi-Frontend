/**
 * API 配置文件
 * 集中管理所有后端服务的 URL 配置
 */

// 基础服务 API 地址
export const BASE_API = process.env.VUE_APP_BASE_API;

// AI 服务 API 地址
export const AI_API = process.env.VUE_APP_AI_API;

// 创建 axios 实例的配置
export const createBaseAPIConfig = () => ({
  baseURL: BASE_API,
  timeout: 15000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
});

export const createAIAPIConfig = () => ({
  baseURL: AI_API,
  timeout: 30000, // AI 请求可能需要更长的超时时间
  headers: {
    'Content-Type': 'application/json'
  }
});