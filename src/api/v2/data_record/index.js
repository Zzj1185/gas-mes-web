import request from '@/utils/request'

// 告警记录
const AlarmRoute = '/v2/data/record/alarm'
const AlarmReq = (data) => request.post('/api' + AlarmRoute, data)

// 采集记录
const AcquisitionRoute = '/v2/data/record/acquisition'
const AcquisitionReq = (data) => request.post('/api' + AcquisitionRoute, data)

// 事件记录
const EventRoute = '/v2/data/record/event'
const EventReq = (data) => request.post('/api' + EventRoute, data)

// 日志记录
const LogRoute = '/v2/data/record/log'
const LogReq = (data) => request.post('/api' + LogRoute, data)

export default {
  AlarmRoute,
  AcquisitionRoute,
  EventRoute,
  LogRoute,

  AlarmReq,
  AcquisitionReq,
  EventReq,
  LogReq,
}
