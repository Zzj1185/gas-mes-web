import request from '@/utils/request'

// 查看
const ViewRoute = '/v2/patrol/report/view'
const ViewReq = (data) => request.post('/api' + ViewRoute, data)

// 轨迹
const TrackRoute = '/v2/patrol/report/track'
const TrackReq = (data) => request.post('/api' + TrackRoute, data)

// 创建
const CreateRoute = '/v2/patrol/report/create'
const CreateReq = (data) => request.post('/api' + CreateRoute, data)

// 删除
const DeleteRoute = '/v2/patrol/report/delete'
const DeleteReq = (data) => request.post('/api' + DeleteRoute, data)

export default {
  ViewRoute,
  TrackRoute,
  CreateRoute,
  DeleteRoute,

  ViewReq,
  TrackReq,
  CreateReq,
  DeleteReq,
}
