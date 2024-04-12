import request from '@/utils/request'

// 查看
const ViewRoute = '/v2/alarm/view'
const ViewReq = (data) => request.post('/api' + ViewRoute, data)

// 处置
const HandleRoute = '/v2/alarm/handle'
const HandleReq = (data) => request.post('/api' + HandleRoute, data)

export default {
  ViewRoute,
  HandleRoute,

  ViewReq,
  HandleReq,
}
