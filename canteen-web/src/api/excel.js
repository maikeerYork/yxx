import request from '@/utils/request'

// 综合统计 之 基础统计
export function SaleTrend(params) {
  return request({
    url: 'excel/multiple/SaleTrend',
    method: 'get',
    params
  })
}

export function SaleRate(params) {
  return request({
    url: 'excel/multiple/SaleRate',
    method: 'get',
    params
  })
}

export function PayTypeRate(params) {
  return request({
    url: 'excel/multiple/PayTypeRate',
    method: 'get',
    params
  })
}

export function dishSaleTrend(params) {
  return request({
    url: 'excel/dish/SaleTrend',
    method: 'get',
    params
  })
}

export function dishSaleRate(params) {
  return request({
    url: 'excel/dish/SaleRate',
    method: 'get',
    params
  })
}

export function dishSaleCondition(params) {
  return request({
    url: 'excel/dish/SaleCondition',
    method: 'get',
    params
  })
}

export function codeSaleTrend(params) {
  return request({
    url: 'excel/code/SaleTrend',
    method: 'get',
    params
  })
}

export function codeSaleRate(params) {
  return request({
    url: 'excel/code/SaleRate',
    method: 'get',
    params
  })
}

export function codeSaleCondition(params) {
  return request({
    url: 'excel/code/SaleCondition',
    method: 'get',
    params
  })
}

export function dinnerorder(params) {
  return request({
    url: 'excel/detail/order',
    method: 'get',
    params
  })
}
