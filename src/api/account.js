import request from '@/utils/request'

// 账户登录
const login = (data) => request.post('/api/login', data)

// 更改登录密码
const changePassword = (data) => request.post('/api/account/change/password', data)

// 更改账户信息
const changeInfo = (data) => request.post('/api/account/change/info', data)

// 账户检查
const check = (data) => request.post('/api/account/check', data)

export default {
  login,
  changePassword,
  changeInfo,
  check,
}
