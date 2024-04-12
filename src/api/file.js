import request from '@/utils/request'

// 文件上传
const fileUpload = (data) => {
  return request.post('/api/system/file/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } }).then((rsp) => rsp)
}

// http://jsb-048:8000/api/system/file/upload
export default {
  fileUpload,
}
