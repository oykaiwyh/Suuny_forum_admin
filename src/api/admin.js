import axios from '@/libs/api.request'
import qs from 'qs'



/**
 * 用户管理
 * @param {*} sid 唯一标识
 */
// 获取用户列表
const getUserList = (params) => {
  return axios.get('/admin/users?' + qs.stringify(params))
}

// 更新某个用户
const updateUsertById = (data) => {
  return axios.post('/admin/update-user', data)
}

// 批量用户
const updateUsertBatchById = (data) => {
  return axios.post('/admin/updateUserSettings', data)
}

// 删除某个用户(批量)
const deleteUserById = (ids) => {
  return axios.post('/admin/delete-user?', {
    ids
  })
}

// 删除某个用户
const checkUsername = (username) => {
  return axios.get('/admin/checkname?username=' + username)
}

// 增加某个用户
const addUser = (data) => {
  return axios.post('/admin/addUser', data)
}


const addMenu = (data) => axios.post('/admin/addMenu', data)
const getMenu = () => axios.get('/admin/getMenu')
const updateMenu = (data) => axios.post('/admin/updateMenu', data)
const deleteMenu = (data) => axios.post('/admin/deleteMenu', data)

const addRole = (data) => axios.post('/admin/addRole', data)
const getRoles = () => axios.get('/admin/getRoles')
const updateRole = (data) => axios.post('/admin/updateRole', data)
const deleteRole = (data) => axios.post('/admin/deleteRole', data)

const getRoleNames = () => axios.get('/admin/getRolesNames')




export {
  getUserList,
  updateUsertById,
  updateUsertBatchById,
  deleteUserById,
  checkUsername,
  addUser,
  addMenu,
  getMenu,
  updateMenu,
  deleteMenu,
  addRole,
  getRoles,
  updateRole,
  deleteRole,
  getRoleNames
}
