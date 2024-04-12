export default [
  {
    name: 'video',
    path: '/monitor/video',
    component: () => import('@/views/monitor/video.vue'),
  },
  {
    name: 'process',
    path: '/monitor/process',
    component: () => import('@/views/monitor/process.vue'),
  },
  {
    name: 'alarmHandle',
    path: 'alarm/handle',
    component: () => import('@/views/monitor/alarmHandle.vue'),
  },

  {
    name: 'overview',
    path: '/monitor/overview',
    component: () => import('@/views/monitor/overview.vue'),
  },
]
