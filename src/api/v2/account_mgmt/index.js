import request from '@/utils/request'

// 登录
const LoginRoute = '/v2/account/login'
const LoginReq = (data) => request.post('/api' + LoginRoute, data)

// 校验
const CheckRoute = '/v2/account/check'
const CheckReq = (data) => request.post('/api' + CheckRoute, data)

// 修改密码
const ChangePasswordRoute = '/v2/account/change/password'
const ChangePasswordReq = (data) => request.post('/api' + ChangePasswordRoute, data)

// 修改信息
const ChangeInfoRoute = '/v2/account/change/info'
const ChangeInfoReq = (data) => request.post('/api' + ChangeInfoRoute, data)

export default {
  LoginReq,
  CheckReq,
  ChangePasswordReq,
  ChangeInfoReq,
}
