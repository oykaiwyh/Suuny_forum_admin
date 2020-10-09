import axios from '@/libs/api.request'
import qs from 'qs'

/**
 * 
 * @param {*内容管理} 文章管理 
 */

// 获取所有文章
const getList = (options) => {
  return axios.get('/public/list?' + qs.stringify(options))
}

// 删除文章
const deletePostById = (id) => {
  return axios.get('/content/delete?tid=' + id)
}

// 更新文章
const updatePostById = (data) => {
  return axios.post('/content/update-id', data)
}



/**
 * 
 * @param {*内容管理} 标签管理 
 */
const getTags = (options) => {
  return axios.get('/admin/getTags?' + qs.stringify(options))
}

const addTag = (data) => {
  return axios.post('/admin/addTag', data)
}

const removeTag = (id) => {
  return axios.get('/admin/removeTag?ptid=' + id)
}

const updateTag = (data) => {
  return axios.post('/admin/editTag?', data)
}

export {
  getList,
  deletePostById,
  updatePostById,
  getTags,
  addTag,
  removeTag,
  updateTag,
}
