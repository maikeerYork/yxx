import request from '@/utils/request'

// 基础信息
export function totalMiniBase(params) {
  return request({
    url: '/admin/order/miniBase',
    method: 'get',
    timeout:60000,
    params
  })
}

// 支付方式占比
export function miniPayTypeRate(params) {
  return request({
    url: 'admin/order/miniPayTypeRate',
    method: 'get',
    params
  })
}

// 销售量统计
export function miniSaleTotal(params) {
  return request({
    url: '/admin/order/miniSaleTotal',
    method: 'get',
    timeout:60000,
    params
  })
}

// 销售量统计
export function miniSaleTrend(params) {
  return request({
    url: '/admin/order/miniSaleTrend',
    method: 'get',
    timeout:60000,
    params
  })
}

// 获取所有餐别
export function allMeals(params) {
  return request({
    url: '/admin/diningTime',
    method: 'get',
    params
  })
}

// 获取预定排行柱状图数据
export function miniReserveTop(params) {
  return request({
    url: '/admin/order/miniReserveTop',
    method: 'get',
    params
  })
}

// 获取菜品预定统计table表格数据
export function miniReserve(params) {
  return request({
    url: '/admin/order/miniReserve',
    method: 'get',
    params
  })
}