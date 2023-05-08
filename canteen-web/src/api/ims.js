import request from '@/utils/request'

//进出库明细
export function getInandOutDetail(params) {
  return request({
    url: 'admin/ware/house/inApply-detail',
    method: 'GET',
    params
  })
}

//库存盘点
export function getInventoryDetail(params) {
  return request({
    url: 'admin/ware/house/inventory-detail',
    method: 'GET',
    params
  })
}

//查询云上餐厅数据
export function getOnlineOrder(params) {
  return request({
    url: 'admin/order/onlineOrder',
    method: 'GET',
    params
  })
}