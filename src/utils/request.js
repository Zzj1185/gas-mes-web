import axios from 'axios'
import store from '@/store'

// 根据环境获取后端host
const host = process.env.VUE_APP_HOST

// 创建axios实例
const service = axios.create({
  baseURL: host,
  timeout: 5 * 1000, // request timeout 设置请求超时时间，单位（毫秒）
  headers: { 'Content-Type': 'application/json' }, // 设置请求头
})

// 请求拦截
service.interceptors.request.use((config) => {
  if (store.getters.getUserInfo) {
    const token = store.getters.getUserInfo.identity_token
    if (token) {
      // 添加 'Authorization' 属性
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})

// 响应拦截
service.interceptors.response.use(
  (rsp) => rsp.data,
  (error) => {
    if (error.response) {
      const rsp = error.response
      let data = { error: '接口数据异常，请联系管理员' }
      if (rsp.status == 401 && rsp.data && rsp.data.error) {
        data = rsp.data
      }
      const res = {
        code: rsp.status,
        message: data.error,
        data: {},
      }
      store.dispatch('removeUserInfo')
      return res
    } else {
      console.error(error)
    }
  }
)

export default service

export { host }
