import axios from "axios";
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

// 封装带token的请求方法
export const request = {
  async post(url, data) {
    try {
      const tokenUrl = buildUrlWithToken(url);
      const response = await axios.post(tokenUrl, data);
      return response.data;
    } catch (error) {
      const message = handleError(error);
      throw new Error(message);
    }
  }
};