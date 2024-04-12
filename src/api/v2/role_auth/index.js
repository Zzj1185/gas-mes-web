import request from '@/utils/request'

// 查看
const ViewRoute = '/v2/role/auth/view'
const ViewReq = (data) => request.post('/api' + ViewRoute, data)

// 更新
const UpdateRoute = '/v2/role/auth/update'
const UpdateReq = (data) => request.post('/api' + UpdateRoute, data)

export default {
  ViewRoute,
  UpdateRoute,

  ViewReq,
  UpdateReq,
}
