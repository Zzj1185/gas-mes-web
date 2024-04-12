import request from '@/utils/request'

// 选择
const SelectRoute = '/v2/site/type/select'
const SelectReq = (data) => request.post('/api' + SelectRoute, data)

// 管理
const ListRoute = '/v2/site/type/list'
const ListReq = (data) => request.post('/api' + ListRoute, data)

// 创建
const CreateRoute = '/v2/site/type/create'
const CreateReq = (data) => request.post('/api' + CreateRoute, data)

// 更新
const UpdateRoute = '/v2/site/type/update'
const UpdateReq = (data) => request.post('/api' + UpdateRoute, data)

// 删除
const DeleteRoute = '/v2/site/type/delete'
const DeleteReq = (data) => request.post('/api' + DeleteRoute, data)

export default {
  SelectRoute,
  ListRoute,
  CreateRoute,
  UpdateRoute,
  DeleteRoute,

  SelectReq,
  ListReq,
  CreateReq,
  UpdateReq,
  DeleteReq,
}
