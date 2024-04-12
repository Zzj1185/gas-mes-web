import request from '@/utils/request'

// 配置数据
const ConfigDataRoute = '/v2/common/config/data'
const ConfigDataReq = (data) => request.post('/api' + ConfigDataRoute, data)

// 文件上传
const FileUploadRoute = '/v2/common/file/upload'
const FileUploadReq = (data) => request.post('/api' + FileUploadRoute, data, { headers: { 'Content-Type': 'multipart/form-data' } })

// 保养数量
const MaintCountRoute = '/v2/common/maint/count'
const MaintCountReq = (data) => request.post('/api' + MaintCountRoute, data)

// 工单数量
const RepairCountRoute = '/v2/common/repair/count'
const RepairCountReq = (data) => request.post('/api' + RepairCountRoute, data)

// 告警数量
const AlarmCountRoute = '/v2/common/alarm/count'
const AlarmCountReq = (data) => request.post('/api' + AlarmCountRoute, data)

// 站点标签
const SiteTagRoute = '/v2/common/site/tag'
const SiteTagReq = (data) => request.post('/api' + SiteTagRoute, data)

// 所有站点
const AllSiteRoute = '/v2/common/all/site'
const AllSiteReq = (data) => request.post('/api' + AllSiteRoute, data)

export default {
  ConfigDataReq,
  FileUploadReq,
  MaintCountReq,
  RepairCountReq,
  AlarmCountReq,
  SiteTagReq,
  AllSiteReq,
}
