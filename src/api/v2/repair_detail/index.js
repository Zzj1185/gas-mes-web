import request from '@/utils/request'

// 查看
const ViewRoute = '/v2/repair/detail/view'
const ViewReq = (data) => request.post('/api' + ViewRoute, data)

// 创建
const CreateRoute = '/v2/repair/detail/create'
const CreateReq = (data) => request.post('/api' + CreateRoute, data)

// 删除
const DeleteRoute = '/v2/repair/detail/delete'
const DeleteReq = (data) => request.post('/api' + DeleteRoute, data)

export default {
  ViewRoute,
  CreateRoute,
  DeleteRoute,

  ViewReq,
  CreateReq,
  DeleteReq,
}
