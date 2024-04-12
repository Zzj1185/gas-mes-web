import request from '@/utils/request'

// 所有用户
const allUser = (data) => request.post('/api/user/all', data)

// web2.0
// 创建用户
const createUser = (data) => request.post('/api/user/create', data)
// 删除用户
const deleteUser = (data) => request.post('/api/user/delete', data)
// 用户列表
const UserList = (data) => request.post('/api/user/list', data)
// 设置用户密码
const setUserPassword = (data) => request.post('/api/user/set/password', data)
// 设置用户状态
const setUserState = (data) => request.post('/api/user/set/state', data)

// 更新用户
const userUpdate = (data) => request.post('/api/user/update', data)










export default {
  allUser,

  createUser,
  deleteUser,
  UserList,
  setUserPassword,
  setUserState,
  userUpdate



}
