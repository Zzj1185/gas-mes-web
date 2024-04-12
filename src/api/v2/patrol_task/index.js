import request from '@/utils/request'

// 管理
const ListRoute = '/v2/patrol/task/list'
const ListReq = (data) => request.post('/api' + ListRoute, data)

// 人员
const UserRoute = '/v2/patrol/task/user'
const UserReq = (data) => request.post('/api' + UserRoute, data)

// 创建
const CreateRoute = '/v2/patrol/task/create'
const CreateReq = (data) => request.post('/api' + CreateRoute, data)

// 更新
const UpdateRoute = '/v2/patrol/task/update'
const UpdateReq = (data) => request.post('/api' + UpdateRoute, data)

// 删除
const DeleteRoute = '/v2/patrol/task/delete'
const DeleteReq = (data) => request.post('/api' + DeleteRoute, data)

export default {
  ListRoute,
  UserRoute,
  CreateRoute,
  UpdateRoute,
  DeleteRoute,

  ListReq,
  UserReq,
  CreateReq,
  UpdateReq,
  DeleteReq,
}
