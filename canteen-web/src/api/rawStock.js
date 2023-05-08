import request from '@/utils/request'

// 所有仓库列表
export function allWareHouseList(params) {
  return request({
    url: 'admin/ware/house/list',
    method: 'get',
    params
  })
}
// 仓库原料配置列表
export function allRawConfList(params) {
  return request({
    url: 'admin/ware/house/raw/conf',
    method: 'get',
    params
  })
}
// 添加仓库原料配置
export function addRawConf(data) {
  return request({
    url: 'admin/ware/house/raw/conf',
    method: 'POST',
    data
  })
}

// 编辑仓库原料配置
export function editRawConf(data, id) {
  return request({
    url: 'admin/ware/house/raw/conf/' + id,
    method: 'PUT',
    data
  })
}

// 删除仓库原料配置
export function delRawConf(id) {
  return request({
    url: 'admin/ware/house/raw/conf/' + id,
    method: 'DELETE',
  })
}

// 原料库存初始物资导人进度
export function importSpeed(params) {
  return request({
    url: 'admin/house/raw-import',
    method: 'GET',
    params
  })
}

// 原料库存初始物资导人取消任务
export function cancelImportTask(data) {
  return request({
    url: 'admin/house/raw-import',
    method: 'PUT',
    data
  })
}

