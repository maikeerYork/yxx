//采购统计
import request from '@/utils/request'

//获取采购明细的列表
export function purchaseDetails(params) {
  return request({
    url: 'admin/ware/house/purchase/detail',
    method: 'get',
    params
  })
}

//获取采购汇总的列表
export function purchaseSummary(params) {
  return request({
    url: 'admin/order/user/pay/list',
    method: 'get',
    params
  })
}

export function ConsumptionCount(params){
  return request({
    url: 'admin/order/user/pay/total',
    method: 'get',
    params
  })
}

export function miniSaleTrend(params){
  debugger;
  return request({
    url: 'admin/order/user/pay/depart-child-total',
    method: 'get',
    params
  })
}


export function consumptionTrend(params){
  return request({
    url: 'admin/order/user/pay/date-total',
    method: 'get',
    params
  })
}


export function consumptionProportion(params){
  return request({
    url: 'admin/order/user/pay/depart-total',
    method: 'get',
    params
  })
}
