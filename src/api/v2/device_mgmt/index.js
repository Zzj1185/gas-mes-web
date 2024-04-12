import request from '@/utils/request'

// 选择
const SelectRoute = '/v2/device/select'
const SelectReq = (data) => request.post('/api' + SelectRoute, data)

// 管理
const ListRoute = '/v2/device/list'
const ListReq = (data) => request.post('/api' + ListRoute, data)

// 创建
const CreateRoute = '/v2/device/create'
const CreateReq = (data) => request.post('/api' + CreateRoute, data)

// 更新
const UpdateRoute = '/v2/device/update'
const UpdateReq = (data) => request.post('/api' + UpdateRoute, data)

// 状态
const StateRoute = '/v2/device/state'
const StateReq = (data) => request.post('/api' + StateRoute, data)

// 删除
const DeleteRoute = '/v2/device/delete'
const DeleteReq = (data) => request.post('/api' + DeleteRoute, data)

export default {
  SelectRoute,
  ListRoute,
  CreateRoute,
  UpdateRoute,
  StateRoute,
  DeleteRoute,

  SelectReq,
  ListReq,
  CreateReq,
  UpdateReq,
  StateReq,
  DeleteReq,
}
