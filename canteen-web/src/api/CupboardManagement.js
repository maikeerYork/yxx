import request from '@/utils/request'

// 获取餐柜数据

export function getCabinet(params) {
  return request({
    url: '/admin/cabinet',
    method: 'get',
    params: params
  })
}

// 添加餐柜数据
export function addCabinet(data) {
  return request({
    url: '/admin/cabinet',
    method: 'post',
    data
  })
}

// 修改餐柜数据
export function editCabinet(data) {
  const id = data.id
  delete data.id
  delete data.create_at
  return request({
    url: `/admin/cabinet/${id}`,
    method: 'put',
    data
  })
}

// 删除餐柜数据
export function deleteCabinet(id) {
  return request({
    url: `/admin/cabinet/${id}`,
    method: 'delete'
  })
}

//feng 新增
// 获取设备列表
export function equipmentManagelist(data) {
  return request({
    url: 'admin/equipment/lists',
    method: 'POST',
    data
  })
}

// 获取设备列表
export function updateEquipmentlist(data) {
  return request({
    url: 'admin/equipment/update',
    method: 'POST',
    data
  })
}

// 获取所有设备类型列表
export function clientType(params) {
  return request({
    url: 'admin/client/type',
    method: 'GET',
    params
  })
}

// 获取钱包扣费顺序
export function walletOrderType(params) {
  return request({
    url: 'api/walletOrderType',
    method: 'GET',
    params
  })
}

// 批量设置设备扣费顺序
export function batchEquipment(data) {
  return request({
    url: 'admin/equipment/batch',
    method: 'POST',
    data
  })
}

// feng 2021/10/20 新增
//获取设备列表
export function canteenClient(params) {
  return request({
    url: 'admin/canteen-client',
    method: 'GET',
    params
  })
}
//新增设备
export function addCanteenClient(data) {
  return request({
    url: 'admin/canteen-client',
    method: 'POST',
    data
  })
}
//编辑设备
export function editCanteenClient(data,id) {
  return request({
    url: 'admin/canteen-client/'+ id,
    method: 'PUT',
    data
  })
}

//获取商家码信息
export function equipmentCode(data) {
  return request({
    url: '/admin/equipment/code',
    method: 'POST',
    data
  })
}