import request from '@/utils/request'

// 系统管理模块

//1. 用户管理
const userList = (params) => {
  return request.post('/api/system/user/list', params).then((rsp) => rsp)
}
// 设置用户状态
const userState = (data) => request.post('/api/system/user/state', data)
// 设置用户密码
const userPassword = (data) => request.post('/api/system/user/password', data)

const userAdd = (data) => {
  return request.post('/api/system/user/create', data).then((rsp) => rsp)
}
const userUpdate = (data) => {
  return request.post('/api/system/user/update', data).then((rsp) => rsp)
}
const userDelete = (data) => {
  return request.post('/api/system/user/delete', data).then((rsp) => rsp)
}
// 用户角色ID列表


const identityList = (data) => {
  return request.post('/api/system/identity/list', data).then((rsp) => rsp)
}
// 取消用户角色
const identityCancel = (data) => {
  return request.post('/api/system/identity/cancel', data).then((rsp) => rsp)
}
// 分配用户角色
const identityAssign = (data) => {
  return request.post('/api/system/identity/assign', data).then((rsp) => rsp)
}



// 2.用户角色
const roleList = (data) => {
  return request.post('/api/system/role/list', data).then((rsp) => rsp)
}
const roleDelete = (data) => {
  return request.post('/api/system/role/delete', data).then((rsp) => rsp)
}
const roleCreate = (data) => {
  return request.post('/api/system/role/create', data).then((rsp) => rsp)
}
const roleUpdate = (data) => {
  return request.post('/api/system/role/update', data).then((rsp) => rsp)
}
// 查询所有角色树形列表
const roleTree = (data) => {
  return request.post('/api/system/role/tree', data).then((rsp) => rsp)
}
// 角色权限
// 当前角色的角色权限
const permissionList = (data) => {
  return request.post('/api/system/permission/list', data).then((rsp) => rsp)
}
//分配角色权限
const permissionAssign = (data) => {
  return request.post('/api/system/permission/assign', data).then((rsp) => rsp)
}
// 取消角色权限
const permissionCancel = (data) => {
  return request.post('/api/system/permission/cancel', data).then((rsp) => rsp)
}





// 3.权限策略

const policyList = (data) => {
  return request.post('/api/system/policy/list', data).then((rsp) => rsp)
}
const policyDelete = (data) => {
  return request.post('/api/system/policy/delete', data).then((rsp) => rsp)
}
const policyCreate = (data) => {
  return request.post('/api/system/policy/generate', data).then((rsp) => rsp)
}
const policyUpdate = (data) => {
  return request.post('/api/system/policy/update', data).then((rsp) => rsp)
}
const policyTree = (data) => {
  return request.post('/api/system/policy/tree', data).then((rsp) => rsp)
}
const policySort = (data) => {
  return request.post('/api/system/policy/sort', data).then((rsp) => rsp)
}
const policyAll = (data) => {//下拉
  return request.post('/api/system/policy/all', data).then((rsp) => rsp)
}




// 4.系统配置 增删改查 该状态
const configList = (data) => {
  return request.post('/api/system/config/list', data).then((rsp) => rsp)
}
const configDelete = (data) => {
  return request.post('/api/system/config/delete', data).then((rsp) => rsp)
}
const configCreate = (data) => {
  return request.post('/api/system/config/create', data).then((rsp) => rsp)
}
const configUpdate = (data) => {
  return request.post('/api/system/config/update', data).then((rsp) => rsp)
}
const configState = (data) => {
  return request.post('/api/system/config/state', data).then((rsp) => rsp)
}
const configData = (data) => {
  return request.post('/api/system/config/data', data).then((rsp) => rsp)
}






// 系统管理
const authorList = (params) => {
  return request.post('/api/auth/list', params).then((rsp) => rsp)
}

const authorUpdate = (data) => {
  return request.post('/api/auth/edit', data).then((rsp) => rsp)
}

// 操作日志
const logList = (data) => {
  return request.post('/api/log/list', data).then((rsp) => rsp)
}

export default {
  userList,
  userAdd,
  userUpdate,
  userDelete,
  authorList,
  authorUpdate,
  logList,
  userState,
  userPassword,

  roleList,
  roleDelete,
  roleCreate,
  roleUpdate,
  roleTree,

  identityList,
  identityCancel,
  identityAssign,

  permissionList,
  permissionAssign,
  permissionCancel,

  configList,
  configDelete,
  configCreate,
  configUpdate,
  configState,
  configData,

  policyList,
  policyDelete,
  policyCreate,
  policyUpdate,
  policyTree,
  policySort,
  policyAll




}
