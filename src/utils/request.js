import { useRouter } from "vue-router";

const router = useRouter();

// 获取token并构建带token的URL
export const buildUrlWithToken = (baseUrl) => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  if (!token) {
    router.push("/login");
    throw new Error("未登录或登录已过期");
  }
  return `${baseUrl}?token=${token}`;
};

// 统一错误处理
export const handleError = (error) => {
  let errorMessage = "";
  
  if (error.response) {
    const status = error.response.status;
    switch (status) {
      case 401:
        errorMessage = "身份验证失败";
        router.push("/login");
        break;
      case 403:
        errorMessage = "无权限访问此资源";
        break;
      default:
        errorMessage = error.response.data.msg || "请求失败";
    }
  } else if (error.request) {
    errorMessage = "无法连接到服务器";
  } else {
    errorMessage = "发生未知错误";
  }
  
  console.error("请求错误:", error);
  return errorMessage;
};

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