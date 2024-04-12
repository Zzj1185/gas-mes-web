import request from '@/utils/request'

// 查看
const ViewRoute = '/v2/site/tag/view'
const ViewReq = (data) => request.post('/api' + ViewRoute, data)

// 标记
const MarkRoute = '/v2/site/tag/mark'
const MarkReq = (data) => request.post('/api' + MarkRoute, data)

// 排序
const SortRoute = '/v2/site/tag/sort'
const SortReq = (data) => request.post('/api' + SortRoute, data)

export default {
  ViewRoute,
  MarkRoute,
  SortRoute,

  ViewReq,
  MarkReq,
  SortReq,
}
