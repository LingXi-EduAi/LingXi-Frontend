import axios from 'axios';
import { createBaseAPIConfig, createAIAPIConfig } from '../config/api';
import { buildUrlWithToken, handleError } from './request';

// 创建基础服务的 axios 实例
const baseAPI = axios.create(createBaseAPIConfig());

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
  
  async post(url, data = {}) {
    try {
      const tokenUrl = buildUrlWithToken(url);
      const response = await baseAPI.post(tokenUrl, data);
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