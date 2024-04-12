import request from '@/utils/request'

// 管理
const ListRoute = '/v2/device/maint/list'
const ListReq = (data) => request.post('/api' + ListRoute, data)

// 更新
const UpdateRoute = '/v2/device/maint/update'
const UpdateReq = (data) => request.post('/api' + UpdateRoute, data)

export default {
  ListRoute,
  UpdateRoute,

  ListReq,
  UpdateReq,
}
