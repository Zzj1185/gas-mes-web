import request from '@/utils/request'

// 总览
const OverviewRoute = '/v2/data/stats/overview'
const OverviewReq = (data) => request.post('/api' + OverviewRoute, data)

// 报表
const FormRoute = '/v2/data/stats/form'
const FormReq = (data) => request.post('/api' + FormRoute, data)

// 分析
const AnalysisRoute = '/v2/data/stats/analysis'
const AnalysisReq = (data) => request.post('/api' + AnalysisRoute, data)

export default {
  OverviewRoute,
  FormRoute,
  AnalysisRoute,

  OverviewReq,
  FormReq,
  AnalysisReq,
}
