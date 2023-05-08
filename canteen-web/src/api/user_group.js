import request from '@/utils/request'

// 用户组人员列表
export function getUserGroupList(params) {
  return request({
    url: 'admin/user/group',
    method: 'get',
    params
  })
}

// 用户组人员添加
export function addUserGroupList(data) {
  return request({
    url: 'admin/user/group',
    method: 'POST',
    data
  })
}

//  用户组人员人员删除
export function deleteList(canteen_id, id) {
  return request({
    url: 'admin/user/group/' + id,
    method: 'DELETE',
    data: {
      canteen_id
    }
  })
}

//  用户组人员人员编辑
export function updateList(data, id) {
  return request({
    url: 'admin/user/group/' + id,
    method: 'PUT',
    data
  })
}

