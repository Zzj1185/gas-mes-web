import request from '@/utils/request'

// 管理
const ListRoute = '/v2/part/list'
const ListReq = (data) => request.post('/api' + ListRoute, data)

// 创建
const CreateRoute = '/v2/part/create'
const CreateReq = (data) => request.post('/api' + CreateRoute, data)

// 更新
const UpdateRoute = '/v2/part/update'
const UpdateReq = (data) => request.post('/api' + UpdateRoute, data)

// 领取
const ClaimRoute = '/v2/part/claim'
const ClaimReq = (data) => request.post('/api' + ClaimRoute, data)

// 删除
const DeleteRoute = '/v2/part/delete'
const DeleteReq = (data) => request.post('/api' + DeleteRoute, data)

export default {
  ListRoute,
  CreateRoute,
  UpdateRoute,
  ClaimRoute,
  DeleteRoute,

  ListReq,
  CreateReq,
  UpdateReq,
  ClaimReq,
  DeleteReq,
}
