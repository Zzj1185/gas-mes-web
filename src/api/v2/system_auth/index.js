import request from '@/utils/request'

// 选择
const SelectRoute = '/v2/system/auth/select'
const SelectReq = (data) => request.post('/api' + SelectRoute, data)

// 管理
const ListRoute = '/v2/system/auth/list'
const ListReq = (data) => request.post('/api' + ListRoute, data)

// 重建
const RebuildRoute = '/v2/system/auth/rebuild'
const RebuildReq = (data) => request.post('/api' + RebuildRoute, data)

// 更新
const UpdateRoute = '/v2/system/auth/update'
const UpdateReq = (data) => request.post('/api' + UpdateRoute, data)

// 删除
const DeleteRoute = '/v2/system/auth/delete'
const DeleteReq = (data) => request.post('/api' + DeleteRoute, data)

export default {
  SelectRoute,
  ListRoute,
  RebuildRoute,
  UpdateRoute,
  DeleteRoute,

  SelectReq,
  ListReq,
  RebuildReq,
  UpdateReq,
  DeleteReq,
}
