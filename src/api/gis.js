import request from '@/utils/request'

// 1.站点类型
const siteTypeAll = (data) => request.post('/api/site/type/all', data)
const siteTypeCreate = (data) => request.post('/api/site/type/create', data)
const siteTypeDelete = (data) => request.post('/api/site/type/delete', data)
const siteTypeList = (data) => request.post('/api/site/type/list', data)
const siteTypeUpdate = (data) => request.post('/api/site/type/update', data)

// 2.站点管理
const mapSiteAll = (data) => request.post('/api/map/site/all', data)
const mapSiteCreate = (data) => request.post('/api/map/site/create', data)
const mapSiteDelete = (data) => request.post('/api/map/site/delete', data)
const mapSiteList = (data) => request.post('/api/map/site/list', data)
const mapSiteUpdate = (data) => request.post('/api/map/site/update', data)
const acqRecordList = (data) => request.post('/api/acquisition/record/list', data)

// 3.管线管理
const pipeLineAll = (data) => request.post('/api/pipe/line/all', data)
const pipeLineCreate = (data) => request.post('/api/pipe/line/create', data)
const pipeLineDelete = (data) => request.post('/api/pipe/line/delete', data)
const pipeLineList = (data) => request.post('/api/pipe/line/list', data)
const pipeLineUpdate = (data) => request.post('/api/pipe/line/update', data)

// 4.巡检任务
const patrolTaskAll = (data) => request.post('/api/patrol/task/all', data)
const patrolTaskCreate = (data) => request.post('/api/patrol/task/create', data)
const patrolTaskDelete = (data) => request.post('/api/patrol/task/delete', data)
const patrolTaskList = (data) => request.post('/api/patrol/task/list', data)
const patrolTaskUpdate = (data) => request.post('/api/patrol/task/update', data)
const patrolTaskComplete = (data) => request.post('/api/patrol/task/complete', data)
const patrolTaskUser = (data) => request.post('/api/patrol/task/user', data)
const patrolReportList = (data) => request.post('/api/patrol/report/list', data)
const patrolReportFiles = (data) => request.post('/api/patrol/report/files', data)
const patrolTrackList = (data) => request.post('/api/patrol/track/list', data)

export default {
  siteTypeAll,
  siteTypeCreate,
  siteTypeDelete,
  siteTypeList,
  siteTypeUpdate,

  mapSiteAll,
  mapSiteCreate,
  mapSiteDelete,
  mapSiteList,
  mapSiteUpdate,
  acqRecordList,

  pipeLineAll,
  pipeLineCreate,
  pipeLineDelete,
  pipeLineList,
  pipeLineUpdate,

  patrolTaskAll,
  patrolTaskCreate,
  patrolTaskDelete,
  patrolTaskList,
  patrolTaskUpdate,
  patrolTaskComplete,
  patrolTaskUser,
  patrolReportList,
  patrolReportFiles,
  patrolTrackList,
}
