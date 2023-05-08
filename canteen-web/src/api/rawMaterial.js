import request from '@/utils/request'

// 单位列表
export function unitList(params) {
  return request({
    url: 'admin/ware/unit',
    method: 'get',
    params
  })
}
// 添加单位
export function addUnitList(data) {
  return request({
    url: 'admin/ware/unit',
    method: 'POST',
    data
  })
}

// 编辑单位
export function editUnitList(data, id) {
  return request({
    url: 'admin/ware/unit/' + id,
    method: 'PUT',
    data
  })
}

// 删除单位
export function delUnitList(id) {
  return request({
    url: 'admin/ware/unit/' + id,
    method: 'DELETE',
  })
}

// 分类列表
export function typeList(params) {
  return request({
    url: 'admin/ware/raw/type',
    method: 'get',
    params
  })
}
// 添加分类
export function addTypeList(data) {
  return request({
    url: 'admin/ware/raw/type',
    method: 'POST',
    data
  })
}

// 编辑分类
export function editTypeList(data, id) {
  return request({
    url: 'admin/ware/raw/type/' + id,
    method: 'PUT',
    data
  })
}

// 删除单位
export function delTypeList(id) {
  return request({
    url: 'admin/ware/raw/type/' + id,
    method: 'DELETE',
  })
}

// 原料列表
export function rawList(params) {
  return request({
    url: 'admin/ware/raw',
    method: 'get',
    params
  })
}

// 添加原料
export function addRawList(data) {
  return request({
    url: 'admin/ware/raw',
    method: 'POST',
    data
  })
}

// 编辑原料
export function editRawList(data, id) {
  return request({
    url: 'admin/ware/raw/' + id,
    method: 'PUT',
    data
  })
}

// 原料删除
export function delRawList(id) {
  return request({
    url: 'admin/ware/raw/' + id,
    method: 'DELETE',
  })
}

// 批量导入原料进度
export function importSpeed(params) {
  return request({
    url: 'admin/ware/raw-import',
    method: 'GET',
    params
  })
}

// 批量导入取消任务
export function cancelImportTask(data) {
  return request({
    url: 'admin/ware/raw/import',
    method: 'PUT',
    data
  })
}

//admin//ware/house/raw-type
//仓库原料分类列表
export function rawTypes(params) {
  return request({
    url: 'admin/ware/house/raw-type',
    method: 'get',
    params
  })
}


