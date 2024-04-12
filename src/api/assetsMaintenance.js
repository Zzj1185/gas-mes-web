import request from '@/utils/request'

// 1.设备生命周期管理
const deviceList = (data) => {
    return request.post('/api/site/device/list', data).then((rsp) => rsp)
}
// 设备保养更新
const deviceMaintenance = (data) => {
    return request.post('/api/site/device/maintenance', data).then((rsp) => rsp)
}
// 所有站点
const siteAll = (data) => {
    return request.post('/api/map/site/all', data).then((rsp) => rsp)
}
// 所有设备类型
const deviceTypeAll = (data) => {
    return request.post('/api/device/type/all', data).then((rsp) => rsp)
}






// 2.

const deviceCreate = (data) => {
    return request.post('/api/site/device/create', data).then((rsp) => rsp)
}
const deviceDelete = (data) => {
    return request.post('/api/site/device/delete', data).then((rsp) => rsp)
}

const deviceUpdate = (data) => {
    return request.post('/api/site/device/update', data).then((rsp) => rsp)
}

// 设置设备状态
const deviceState = (data) => {
    return request.post('/api/site/device/state', data).then((rsp) => rsp)
}


// 维修工单
const ticketCreate = (data) => {
    return request.post('/api/repair/ticket/create', data).then((rsp) => rsp)
}
const ticketDelete = (data) => {
    return request.post('/api/repair/ticket/delete', data).then((rsp) => rsp)
}
const ticketUpdate = (data) => {
    return request.post('/api/repair/ticket/update', data).then((rsp) => rsp)
}
const ticketList = (data) => {
    return request.post('/api/repair/ticket/list', data).then((rsp) => rsp)
}

// 维修工单继续
const ticketResume = (data) => {
    return request.post('/api/repair/ticket/resume', data).then((rsp) => rsp)
}
// 维修工单暂停
const ticketSuspend = (data) => {
    return request.post('/api/repair/ticket/suspend', data).then((rsp) => rsp)
}
// 维修工单完成
const ticketCompleted = (data) => {
    return request.post('/api/repair/ticket/completed', data).then((rsp) => rsp)
}
// 维修人员指派
const ticketAssign = (data) => {
    return request.post('/api/repair/ticket/assign', data).then((rsp) => rsp)
}
// 维修人员接单
const ticketAccept = (data) => {
    return request.post('/api/repair/ticket/accept', data).then((rsp) => rsp)
}
// 维修人员列表

const ticketUser = (data) => {
    return request.post('/api/repair/ticket/user', data).then((rsp) => rsp)
}






export default {
    deviceCreate,
    deviceDelete,
    deviceList,
    deviceUpdate,
    deviceMaintenance,
    deviceState,
    siteAll,
    deviceTypeAll,



    ticketCreate,
    ticketDelete,
    ticketList,
    ticketUpdate,

    ticketResume,
    ticketSuspend,
    ticketCompleted,
    ticketAssign,
    ticketAccept,
    ticketUser




}
