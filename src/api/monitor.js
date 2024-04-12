import request from '@/utils/request'

// 生产监控模块

// 1.告警处理


const alarmList = (data) => request.post('/api/alarm/record/list', data)

const alarmHandle = (data) => request.post('/api/alarm/record/handle', data)

// 工艺监控

const processAll = (data) => request.post('/api/process/diagram/all', data)
const processCreate = (data) => request.post('/api/process/diagram/create', data)
const processDelete = (data) => request.post('/api/process/diagram/delete', data)
const processList = (data) => request.post('/api/process/diagram/list', data)
const processUpdate = (data) => request.post('/api/process/diagram/update', data)

// 视频管理

// const cameraAll = (data) => request.post('/api/monitor/camera/all', data)
const cameraCreate = (data) => request.post('/api/monitor/camera/create', data)
const cameraDelete = (data) => request.post('/api/monitor/camera/delete', data)
const cameraList = (data) => request.post('/api/monitor/camera/list', data)
const cameraUpdate = (data) => request.post('/api/monitor/camera/update', data)


export default {
    alarmList,


    alarmHandle,

    processAll,
    processCreate,
    processDelete,
    processList,
    processUpdate,


    cameraCreate,
    cameraDelete,
    cameraList,
    cameraUpdate,


}
