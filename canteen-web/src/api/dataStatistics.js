import request from '@/utils/request'

// 获取当前食堂的终端设备
export function getEquipmentList(canteen_id, client_type = 'CLIENT_FLASH') {
  return request({
    url: '/admin/client/dev',
    method: 'get',
    params: {
      canteen_id,
      client_type
    }
  })
}

// 获取当前食堂的安卓终端设备
export function getMachineList(params) {
  return request({
    url: '/admin/equipment/listAll',
    method: 'GET',
    params,
  })
}

// 获取安卓终端设备订单统计基础信息
export function getMachineAndBase(params) {
  return request({
    url: '/admin/order/andBase',
    method: 'GET',
    timeout:60000,
    params,
  })
}

// 获取安卓终端设备订单销售额趋势
export function getMachineAndSaleTrend(params) {
  return request({
    url: '/admin/order/andSaleTrend',
    method: 'GET',
    timeout:60000,
    params,
  })
}

// 获取安卓终端设备订单销售量统计, 餐别/菜品
export function getAndSaleTotal(params) {
  return request({
    url: '/admin/order/andSaleTotal',
    method: 'GET',
    timeout:60000,
    params,
  })
}

// 获取安卓终端设备订单支付方式占比
export function getAndPayTypeRate(params) {
  return request({
    url: '/admin/order/andPayTypeRate',
    method: 'GET',
    params,
  })
}
