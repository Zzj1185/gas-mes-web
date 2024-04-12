export default [
    {
        name: 'device',
        path: '/site/device',
        component: () => import('@/views/assetsManage/device.vue'),
    },
    {
        name: 'deviceType',
        path: '/device/type',
        component: () => import('@/views/assetsManage/deviceType.vue'),
    },
    {
        name: 'devicePart',
        path: '/device/part',
        component: () => import('@/views/assetsManage/devicePart.vue'),
    },
    {
        name: 'partType',
        path: '/part/type',
        component: () => import('@/views/assetsManage/partType.vue'), //采集管理
    },
]
