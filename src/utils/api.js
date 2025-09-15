import axios from 'axios';
import { createBaseAPIConfig, createAIAPIConfig } from '@/config/api';
import { buildUrlWithToken, handleError, getToken } from './request';

// 创建基础服务的 axios 实例
const baseAPI = axios.create(createBaseAPIConfig());

// 添加请求拦截器，统一处理token
baseAPI.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      // 同时在Header和URL参数中添加token，提高兼容性
      config.headers['token'] = token;
      // 如果URL中没有token参数，则添加
      if (!config.url.includes('token=')) {
        const separator = config.url.includes('?') ? '&' : '?';
        config.url = `${config.url}${separator}token=${encodeURIComponent(token)}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器，处理token失效的情况
baseAPI.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // token失效，清除认证信息并跳转到登录页
      import('./request').then(({ clearAuthData }) => {
        clearAuthData();
        window.location.href = '/login';
      });
    }
    return Promise.reject(error);
  }
);

// 创建 AI 服务的 axios 实例
const aiAPI = axios.create(createAIAPIConfig());

// 基础服务请求方法
export const baseRequest = {
  async get(url, params = {}) {
    try {
      const tokenUrl = buildUrlWithToken(url);
      const response = await baseAPI.get(tokenUrl, { params });
      return response.data;
    } catch (error) {
      const message = handleError(error);
      throw new Error(message);
    }
  },
  
  async post(url, data = {}, config = {}) {
    try {
      const tokenUrl = buildUrlWithToken(url);
      // 如果有查询参数，添加到 URL 中
      const finalUrl = config.params 
        ? `${tokenUrl}${tokenUrl.includes('?') ? '&' : '?'}${new URLSearchParams(config.params).toString()}`
        : tokenUrl;
      const response = await baseAPI.post(finalUrl, data);
      return response.data;
    } catch (error) {
      const message = handleError(error);
      throw new Error(message);
    }
  }
};

// AI 服务请求方法
export const aiRequest = {
  async get(url, params = {}) {
    try {
      const tokenUrl = buildUrlWithToken(url);
      const response = await aiAPI.get(tokenUrl, { params });
      return response.data;
    } catch (error) {
      const message = handleError(error);
      throw new Error(message);
    }
  },
  
  async post(url, data = {}) {
    try {
      const tokenUrl = buildUrlWithToken(url);
      const response = await aiAPI.post(tokenUrl, data);
      return response.data;
    } catch (error) {
      const message = handleError(error);
      throw new Error(message);
    }
  }
};