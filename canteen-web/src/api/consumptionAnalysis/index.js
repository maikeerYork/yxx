import request from '@/utils/request'

// 获取当前食堂的终端设备
export function getDayConsume(params) {
  return request({
    url: 'admin/order/card/dayConsume-price',
    method: 'get',
    params
  })
}