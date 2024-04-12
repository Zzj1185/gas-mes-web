import request from '@/utils/request'

// 查看
const ViewRoute = '/v2/site/view'
const ViewReq = (data) => request.post('/api' + ViewRoute, data)

// 选择
const SelectRoute = '/v2/site/select'
const SelectReq = (data) => request.post('/api' + SelectRoute, data)

// 管理
const ListRoute = '/v2/site/list'
const ListReq = (data) => request.post('/api' + ListRoute, data)

// 创建
const CreateRoute = '/v2/site/create'
const CreateReq = (data) => request.post('/api' + CreateRoute, data)

// 更新
const UpdateRoute = '/v2/site/update'
const UpdateReq = (data) => request.post('/api' + UpdateRoute, data)

// 删除
const DeleteRoute = '/v2/site/delete'
const DeleteReq = (data) => request.post('/api' + DeleteRoute, data)

export default {
  ViewRoute,
  SelectRoute,
  ListRoute,
  CreateRoute,
  UpdateRoute,
  DeleteRoute,

  ViewReq,
  SelectReq,
  ListReq,
  CreateReq,
  UpdateReq,
  DeleteReq,
}
