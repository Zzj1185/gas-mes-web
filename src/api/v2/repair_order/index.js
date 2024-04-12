import request from '@/utils/request'

// 管理
const ListRoute = '/v2/repair/order/list'
const ListReq = (data) => request.post('/api' + ListRoute, data)

// 人员
const UserRoute = '/v2/repair/order/user'
const UserReq = (data) => request.post('/api' + UserRoute, data)

// 创建
const CreateRoute = '/v2/repair/order/create'
const CreateReq = (data) => request.post('/api' + CreateRoute, data)

// 删除
const DeleteRoute = '/v2/repair/order/delete'
const DeleteReq = (data) => request.post('/api' + DeleteRoute, data)

export default {
  ListRoute,
  UserRoute,
  CreateRoute,
  DeleteRoute,

  ListReq,
  UserReq,
  CreateReq,
  DeleteReq,
}
