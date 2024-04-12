import request from '@/utils/request'

// 知识库
const archiveList = (data) => {
  return request.post('/api/knowledge/archive/list', data).then((rsp) => rsp)
}

const archiveAdd = (data) => {
  return request.post('/api/knowledge/archive/create', data).then((rsp) => rsp)
}

const archiveEdit = (data) => {
  return request.post('/api/knowledge/archive/update', data).then((rsp) => rsp)
}

const archiveDelete = (data) => {
  return request.post('/api/knowledge/archive/delete', data).then((rsp) => rsp)
}


// 知识类别
const categoryAll = (data) => request.post('/api/knowledge/category/all', data)
const categoryCreate = (data) => request.post('/api/knowledge/category/create', data)
const categoryDelete = (data) => request.post('/api/knowledge/category/delete', data)
const categoryList = (data) => request.post('/api/knowledge/category/list', data)
const categoryUpdate = (data) => request.post('/api/knowledge/category/update', data)



export default {
  archiveList,
  archiveAdd,
  archiveEdit,
  archiveDelete,
  categoryCreate,
  categoryDelete,
  categoryList,
  categoryUpdate,
  categoryAll




}
