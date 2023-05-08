import request from '@/utils/request'

// 综合统计 之 基础统计
export function getTotalBase(params) {
  return request({
    url: 'admin/order/totalBase',
    method: 'get',
    timeout:60000,
    params
  })
}

// 综合统计 之 基础统计走势
export function getTotalBaseTrend(params) {
  return request({
    url: 'admin/order/totalBaseTrend',
    method: 'get',
    params
  })
}

// 综合统计 之 基础统计商品金额占比
export function getTotalBasePct(params) {
  return request({
    url: 'admin/order/totalBasePct',
    method: 'get',
    params
  })
}

// 综合统计 之 基础统计支付类型占比
export function getPayType(params) {
  return request({
    url: 'admin/order/totalBasePayTypePct',
    method: 'get',
    params
  })
}

// 餐盘统计 之 餐盘基础统计
export function totalDishBase(params) {
  return request({
    url: 'admin/order/totalDishBase',
    method: 'get',
    timeout:60000,
    params
  })
}

// 餐盘统计 之 餐盘销售走势
export function totalDishTrend(params) {
  return request({
    url: 'admin/order/totalDishTrend',
    method: 'get',
    timeout:60000,
    params
  })
}

// 餐盘统计 之 餐盘销售占比
export function totalDishPct(params) {
  return request({
    url: 'admin/order/totalDishPct',
    method: 'get',
    timeout:60000,
    params
  })
}

// 餐盘统计 之 餐盘销售情况-分页
export function totalDishSell(params) {
  return request({
    url: 'admin/order/totalDishSell',
    method: 'get',
    params
  })
}

// 条码统计 之 条码基础统计
export function totalCodeBase(params) {
  return request({
    url: 'admin/order/totalCodeBase',
    method: 'get',
    params
  })
}

//  条码统计 之 条码销售走势
export function totalCodeTrend(params) {
  return request({
    url: 'admin/order/totalCodeTrend',
    method: 'get',
    params
  })
}

// 条码统计 之 条码销售占比
export function totalCodePct(params) {
  return request({
    url: 'admin/order/totalCodePct',
    method: 'get',
    params
  })
}

// 条码统计 之 条码销售情况-分页
export function totalCodeSell(params) {
  return request({
    url: 'admin/order/totalCodeSell',
    method: 'get',
    params
  })
}

// 菜品统计 之 基础统计
export function getCuisineTotalBase(params) {
  return request({
    url: 'admin/order/totalFoodsBase',
    method: 'get',
    timeout:60000,
    params
  })
}

// 菜品统计 之 基础统计走势
export function getCuisineTotalBaseTrend(params) {
  return request({
    url: 'admin/order/totalFoodsTrend',
    method: 'get',
    params
  })
}
// 菜品统计 之 菜品统计支付类型占比
export function getCuisinePayType(params) {
  return request({
    url: 'admin/order/totalFoodsPayTypePct',
    method: 'get',
    params
  })
}
// 菜品统计 之 菜品销售占比
export function totalCuisineDishPct(params) {
  return request({
    url: 'admin/order/totalFoodsSell',
    method: 'get',
    timeout:60000,
    params
  })
}