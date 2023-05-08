import request from '@/utils/request'
// 部门列表
export function departList(params) {
  return request({
    url: '/admin/user/depart',
    method: 'GET',
    params
  })
}
// 部门树
export function departTree(params) {
  return request({
    url: 'admin/user/departs/list',
    method: 'GET',
    params
  })
}

// 添加部门
export function addDepartInfo(data) {
  return request({
    url: 'admin/user/depart',
    method: 'POST',
    data
  })
}

// 编辑部门
export function editDepartList(data, id) {
  return request({
    url: 'admin/user/depart/' + id,
    method: 'PUT',
    data
  })
}

// 删除部门
export function delDepartList(data, id) {
  return request({
    url: 'admin/user/depart/' + id,
    method: 'DELETE',
    data
  })
}

