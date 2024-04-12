import request from '@/utils/request'

// 查看
const ViewRoute = '/v2/monitor/view'
const ViewReq = (data) => request.post('/api' + ViewRoute, data)

// 管理
const ListRoute = '/v2/monitor/list'
const ListReq = (data) => request.post('/api' + ListRoute, data)

// 创建
const CreateRoute = '/v2/monitor/create'
const CreateReq = (data) => request.post('/api' + CreateRoute, data)

// 更新
const UpdateRoute = '/v2/monitor/update'
const UpdateReq = (data) => request.post('/api' + UpdateRoute, data)

// 删除
const DeleteRoute = '/v2/monitor/delete'
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
