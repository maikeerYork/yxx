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
    url: 'admin/ware/house/purchase/summary',
    method: 'get',
    params
  })
}
