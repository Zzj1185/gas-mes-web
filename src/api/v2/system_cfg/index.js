import request from '@/utils/request'

// 管理
const ListRoute = '/v2/system/config/list'
const ListReq = (data) => request.post('/api' + ListRoute, data)

// 创建
const CreateRoute = '/v2/system/config/create'
const CreateReq = (data) => request.post('/api' + CreateRoute, data)

// 更新
const UpdateRoute = '/v2/system/config/update'
const UpdateReq = (data) => request.post('/api' + UpdateRoute, data)

// 状态
const StateRoute = '/v2/system/config/state'
const StateReq = (data) => request.post('/api' + StateRoute, data)

// 删除
const DeleteRoute = '/v2/system/config/delete'
const DeleteReq = (data) => request.post('/api' + DeleteRoute, data)

export default {
  ListRoute,
  CreateRoute,
  UpdateRoute,
  StateRoute,
  DeleteRoute,

  ListReq,
  CreateReq,
  UpdateReq,
  StateReq,
  DeleteReq,
}
