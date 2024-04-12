import request from '@/utils/request'

// 查看
const ViewRoute = '/v2/pipe/line/view'
const ViewReq = (data) => request.post('/api' + ViewRoute, data)

// 管理
const ListRoute = '/v2/pipe/line/list'
const ListReq = (data) => request.post('/api' + ListRoute, data)

// 创建
const CreateRoute = '/v2/pipe/line/create'
const CreateReq = (data) => request.post('/api' + CreateRoute, data)

// 更新
const UpdateRoute = '/v2/pipe/line/update'
const UpdateReq = (data) => request.post('/api' + UpdateRoute, data)

// 删除
const DeleteRoute = '/v2/pipe/line/delete'
const DeleteReq = (data) => request.post('/api' + DeleteRoute, data)

export default {
  ViewRoute,
  ListRoute,
  CreateRoute,
  UpdateRoute,
  DeleteRoute,

  ViewReq,
  ListReq,
  CreateReq,
  UpdateReq,
  DeleteReq,
}
