import request from '@/utils/request'

// 资产管理模块
// 1.设备管理


const devicesCreate = (data) => {
    return request.post('/api/site/device/create', data).then((rsp) => rsp)
}
const devicesDelete = (data) => {
    return request.post('/api/site/device/delete', data).then((rsp) => rsp)
}
const devicesList = (data) => {
    return request.post('/api/site/device/list', data).then((rsp) => rsp)
}
const devicesUpdate = (data) => {
    return request.post('/api/site/device/update', data).then((rsp) => rsp)
}
// 设备保养更新
const devicesMaintenance = (data) => {
    return request.post('/api/site/device/maintenance', data).then((rsp) => rsp)
}
// 设备状态设置
const devicesState = (data) => {
    return request.post('/api/site/device/state', data).then((rsp) => rsp)
}



// 采集标签
// http://jsb-048:8000/api/acquisition/tag/update
const acqTagCreate = (data) => {
    return request.post('/api/acquisition/tag/create', data).then((rsp) => rsp)
}
const acqTagDelete = (data) => {
    return request.post('/api/acquisition/tag/delete', data).then((rsp) => rsp)
}

const acqTagList = (data) => {
    return request.post('/api/acquisition/tag/list', data).then((rsp) => rsp)
}
const acqTagUpdate = (data) => {
    return request.post('/api/acquisition/tag/update', data).then((rsp) => rsp)
}

// 关键标签

const keyTagAll = (data) => {
    return request.post('/api/site/tag/all', data).then((rsp) => rsp)
}
const keyTagList = (data) => {
    return request.post('/api/site/tag/list', data).then((rsp) => rsp)
}
const keyTagMark = (data) => {
    return request.post('/api/site/tag/mark', data).then((rsp) => rsp)
}
const keyTagUnmark = (data) => {
    return request.post('/api/site/tag/unmark', data).then((rsp) => rsp)
}


// 告警规则
// http://jsb-048:8000/api/alarm/rule/delete
const alarmCreate = (data) => {
    return request.post('/api/alarm/rule/create', data).then((rsp) => rsp)
}
const alarmState = (data) => {
    return request.post('/api/alarm/rule/state', data).then((rsp) => rsp)
}

const alarmDelete = (data) => {
    return request.post('/api/alarm/rule/delete', data).then((rsp) => rsp)
}

const alarmList = (data) => {
    return request.post('/api/alarm/rule/list', data).then((rsp) => rsp)
}
const alarmUpdate = (data) => {
    return request.post('/api/alarm/rule/update', data).then((rsp) => rsp)
}


















// 2设备类型
// http://jsb-048:8000/api/device/type/all
const deviceAll = (data) => {
    return request.post('/api/device/type/all', data).then((rsp) => rsp)
}
const deviceCreate = (data) => {
    return request.post('/api/device/type/create', data).then((rsp) => rsp)
}
const deviceDelete = (data) => {
    return request.post('/api/device/type/delete', data).then((rsp) => rsp)
}

const deviceList = (data) => {
    return request.post('/api/device/type/list', data).then((rsp) => rsp)
}
const deviceUpdate = (data) => {
    return request.post('/api/device/type/update', data).then((rsp) => rsp)
}

// 3.备件管理
// 领取备件

const partClaim = (data) => {
    return request.post('/api/device/part/claim', data).then((rsp) => rsp)
}
const partCreate = (data) => {
    return request.post('/api/device/part/create', data).then((rsp) => rsp)
}
const partDelete = (data) => {
    return request.post('/api/device/part/delete', data).then((rsp) => rsp)
}
const partList = (data) => {
    return request.post('/api/device/part/list', data).then((rsp) => rsp)
}
const partUpdate = (data) => {
    return request.post('/api/device/part/update', data).then((rsp) => rsp)
}



// 4.备件类型


const partTypeCreate = (data) => {
    return request.post('/api/part/type/create', data).then((rsp) => rsp)
}
const partTypeDelete = (data) => {
    return request.post('/api/part/type/delete', data).then((rsp) => rsp)
}
const partTypeList = (data) => {
    return request.post('/api/part/type/list', data).then((rsp) => rsp)
}
const partTypeUpdate = (data) => {
    return request.post('/api/part/type/update', data).then((rsp) => rsp)
}





export default {
    deviceAll,
    deviceCreate,
    deviceDelete,
    deviceList,
    deviceUpdate,


    acqTagCreate,
    acqTagDelete,
    acqTagList,
    acqTagUpdate,

    keyTagAll,
    keyTagList,
    keyTagMark,
    keyTagUnmark,




    alarmCreate,
    alarmState,
    alarmDelete,
    alarmList,
    alarmUpdate,


    partClaim,
    partCreate,
    partDelete,
    partList,
    partUpdate,


    partTypeCreate,
    partTypeDelete,
    partTypeList,
    partTypeUpdate,



    devicesCreate,
    devicesDelete,
    devicesList,
    devicesUpdate,
    devicesMaintenance,
    devicesState




}
