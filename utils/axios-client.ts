import axios from "axios"
import { getClientToken } from "./api-utils"

// 创建axios实例
const axiosClient = axios.create()

// 添加请求拦截器
axiosClient.interceptors.request.use(
  (config) => {
    const token = getClientToken()

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default axiosClient
