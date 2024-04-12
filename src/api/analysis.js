import request from '@/utils/request'

// 数据统计模块
// 1.记录报表
// 1.1采集记录
const acquisitionList = (data) => {
  return request.post('/api/acquisition/record/list', data).then((rsp) => rsp)
}
// 1.2事件记录

const eventList = (data) => {
  return request.post('/api/event/record/list', data).then((rsp) => rsp)
}
// 1.3用户记录

const logList = (data) => {
  return request.post('/api/system/log/list', data).then((rsp) => rsp)
}

// 1.4告警记录
// http://jsb-048:8000/api/alarm/record/list
const alarmList = (data) => {
  return request.post('/api/alarm/record/list', data).then((rsp) => rsp)
}

// 所有站点 设备 标签
// http://jsb-048:8000/api/site/device/all

const deviceAll = (data) => {
  return request.post('/api/site/device/all', data).then((rsp) => rsp)
}
const tagAll = (data) => {
  return request.post('/api/acquisition/tag/all', data).then((rsp) => rsp)
}

// trend report
// http://jsb-048:8000/api/acquisition/statis/form
const acqForm = (data) => {
  return request.post('/api/acquisition/statis/form', data).then((rsp) => rsp)
}

export default {
  acquisitionList,
  eventList,
  logList,
  alarmList,

  deviceAll,
  tagAll,

  acqForm,
}
