import request from '@/utils/request'

// 仓库入库申请列表
export function inApplyList(params) {
  return request({
    url: 'admin/ware/house/inPurchase',
    method: 'get',
    params
  })
}


// 仓库原料、分类列表
export function typeRawList(params) {
  return request({
    url: 'admin/ware/house/raw/info',
    method: 'get',
    params
  })
}

// 添加仓库入库申请
export function addInApply(data) {
  return request({
    url: 'admin/ware/house/inPurchase',
    method: 'POST',
    data
  })
}

// 采购单详情purchaseDetails
export function purchaseDetail(params, id) {
  return request({
    url: 'admin/ware/house/inApply/' + id,
    method: 'GET',
    params
  })
}

// 更新申请
export function updataApplyList(data, id) {
  return request({
    url: 'admin/ware/house/inPurchase/' + id,
    method: 'PUT',
    data
  })
}

// 删除申请
export function delnApplyList(data, id) {
  return request({
    url: 'admin/ware/house/inApply/' + id,
    method: 'DELETE',
    data
  })
}


// 获取仓库下所有的原料库存
export function wHouseAllRaw(params) {
  return request({
    url: 'admin/ware/house/raw/num',
    method: 'GET',
    params
  })
}
//采购申请详情
export function inPurchaseDetail(id,params) {
  return request({
    url: 'admin/ware/house/inPurchase/'+id,
    method: 'get',
    params
  })
}

// 获取采购定价列表
export function purchasePrice(params) {
  return request({
    url: 'admin/ware/inPurchase/price',
    method: 'GET',
    params
  })
}

// 确认原料定价统计
export function priceTotal(params) {
  return request({
    url: 'admin/ware/inPurchase/price-total',
    method: 'GET',
    params
  })
}

// 确认原料定价详情
export function confirmPriceDetail(params,id) {
  return request({
    url: `admin/ware/inPurchase/price/${id}`,
    method: 'GET',
    params
  })
}
export function updateConfirmPriceDetail(data) {
  return request({
    url: 'admin/ware/inPurchase/price',
    method: 'POST',
    data
  })
}

//供应商采购单
//供应商采购单列表
export function inventoryReview(params) {
  return request({
    url: 'admin/house/inApply/supplier',
    method: 'GET',
    params
  })
}
//供应商采购单详情
export function inventoryReviewDetail(id,params) {
  return request({
    url: `admin/house/inApply/supplier/${id}`,
    method: 'GET',
    params
  })
}
//导出供应商采购单详情







