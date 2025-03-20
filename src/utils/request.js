// src/utils/request.js
import axios from 'axios'
import { useStore } from 'vuex'
import router from '@/router'

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5678',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器（可选）
service.interceptors.request.use(
  config => {
    // 从store获取token（如果有）
    const store = useStore()
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器（推荐）
service.interceptors.response.use(
  response => {
    // 统一处理响应数据格式
    const res = response.data

    // 根据你的接口规范调整
    if (res.status === 200) {
      return res.data || res
    } else {
      return Promise.reject(new Error(res.msg || '请求失败'))
    }
  },
  error => {
    // 统一错误处理
    if (error.response) {
      switch (error.response.status) {
        case 401:
          router.push('/login')
          break
        case 403:
          alert('权限不足')
          break
        case 500:
          alert('服务器错误')
          break
        default:
          console.error('请求错误:', error)
      }
    } else if (error.request) {
      alert('网络连接失败，请检查网络')
    }
    return Promise.reject(error)
  }
)

export default service