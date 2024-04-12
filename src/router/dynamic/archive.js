export default [
  {
    name: 'knowledge',
    path: '/archive/knowledge/:id/:type',
    component: () => import('@/views/archive/knowledge.vue'),
  },
  {
    name: 'category',
    path: '/knowledge/category',
    component: () => import('@/views/archive/category.vue'),
  },
]
