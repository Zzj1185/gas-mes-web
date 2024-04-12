export default [
  {
    name: 'report',
    path: '/analysis/report',
    component: () => import('@/views/analysis/report.vue'),
  },
  {
    name: 'trend',
    path: '/analysis/trend',
    component: () => import('@/views/analysis/trend.vue'),
  },
  {
    name: 'record',
    path: '/analysis/record',
    component: () => import('@/views/analysis/record.vue'),
  },
]
