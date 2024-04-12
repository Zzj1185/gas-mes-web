export default [
    {
        name: 'maintenance',
        path: 'site/device/maintenance',
        component: () => import('@/views/assetsMaintenance/maintenance.vue'),
    },
    {
        name: 'repair',
        path: '/repair/ticket',
        component: () => import('@/views/assetsMaintenance/repair.vue'),
    },
]
