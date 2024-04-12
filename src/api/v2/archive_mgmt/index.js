import request from '@/utils/request'

// 管理
const ListRoute = '/v2/archive/list'
const ListReq = (data) => request.post('/api' + ListRoute, data)

// 创建
const CreateRoute = '/v2/archive/create'
const CreateReq = (data) => request.post('/api' + CreateRoute, data)

// 更新
const UpdateRoute = '/v2/archive/update'
const UpdateReq = (data) => request.post('/api' + UpdateRoute, data)

// 删除
const DeleteRoute = '/v2/archive/delete'
const DeleteReq = (data) => request.post('/api' + DeleteRoute, data)

export default {
  ListRoute,
  CreateRoute,
  UpdateRoute,
  DeleteRoute,

  ListReq,
  CreateReq,
  UpdateReq,
  DeleteReq,
}
