/**
 * 请求工具类
 * 统一处理Token、错误处理等
 */

/**
 * 获取Token
 * @returns {string|null} Token值
 */
export function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token') ||
         localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
}

/**
 * 设置Token
 * @param {string} token - Token值
 * @param {boolean} remember - 是否记住登录状态
 */
export function setToken(token, remember = false) {
  if (remember) {
    localStorage.setItem('token', token);
  } else {
    sessionStorage.setItem('token', token);
  }
}

/**
 * 清除Token和用户信息
 */
export function clearAuthData() {
  localStorage.removeItem('token');
  localStorage.removeItem('authToken');
  localStorage.removeItem('userInfo');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('userInfo');
}

/**
 * 构建带Token的URL
 * @param {string} url - 原始URL
 * @returns {string} 带Token的URL
 */
export function buildUrlWithToken(url) {
  const token = getToken();
  if (!token) {
    return url;
  }
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}token=${encodeURIComponent(token)}`;
}

/**
 * 处理请求错误
 * @param {Error} error - 错误对象
 * @returns {string} 错误信息
 */
export function handleError(error) {
  if (error.response) {
    // 服务器返回了错误状态码
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data?.msg || '请求参数错误';
      case 401:
      case 1000: // 自定义的token过期状态码
        // Token 过期或无效，清除本地存储并跳转到登录页
        clearAuthData();
        // 避免在登录页面重复跳转
        if (!window.location.href.includes('/login')) {
          const currentPath = window.location.pathname;
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }
        return '登录已过期，请重新登录';
      case 403:
        return '没有权限访问此资源';
      case 404:
        return '请求的资源不存在';
      case 429:
        return '请求过于频繁，请稍后再试';
      case 500:
        return '服务器内部错误，请联系管理员';
      case 502:
        return '网关错误，请稍后重试';
      case 503:
        return '服务暂时不可用，请稍后重试';
      default:
        return data?.msg || `请求失败 (HTTP ${status})`;
    }
  } else if (error.request) {
    // 网络错误
    if (error.code === 'ECONNABORTED') {
      return '请求超时，请检查网络连接';
    }
    return '网络连接失败，请检查网络设置';
  } else {
    // 其他错误
    return error.message || '请求失败';
  }
}

/**
 * 检查响应是否成功
 * @param {Object} response - 响应对象
 * @returns {boolean} 是否成功
 */
export function isResponseSuccess(response) {
  return response && response.status === 200;
}

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间
 * @returns {Function} 防抖后的函数
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * @deprecated 此方法已弃用，请使用 baseRequest 或 aiRequest 代替
 * 导出旧的 request 对象以保持兼容性
 * 建议在新代码中使用 baseRequest 或 aiRequest
 */
export const request = {
  /**
   * @deprecated 此方法已弃用，请使用 baseRequest.post 或 aiRequest.post 代替
   */
  async post(url, data) {
    console.warn('警告: request.post 方法已弃用，请使用 baseRequest.post 或 aiRequest.post 代替');
    try {
      const tokenUrl = buildUrlWithToken(url);
      // 这里使用 import 的 axios 实例，保持向后兼容
      const axios = (await import('axios')).default;
      const response = await axios.post(tokenUrl, data);
      return response.data;
    } catch (error) {
      const message = handleError(error);
      throw new Error(message);
    }
  }
};