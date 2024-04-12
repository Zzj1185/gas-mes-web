export default [
  {
    name: 'user',
    path: '/system/user',
    component: () => import('@/views/system/user.vue'),
  },

  {
    name: 'role',
    path: '/system/role',
    component: () => import('@/views/system/role.vue'),
  },
  {
    name: 'policy',
    path: '/system/policy',
    component: () => import('@/views/system/policy.vue'),
  }, {
    name: 'config',
    path: '/system/config',
    component: () => import('@/views/system/config.vue'),
  },
]
