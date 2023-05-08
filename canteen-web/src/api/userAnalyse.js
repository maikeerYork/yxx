import request from '@/utils/request'


export function getStrip(params) {
    return request({
      url: '/admin/order/card/incomeAndExpenses',
      method: 'GET',
      timeout:60000,
      params
    })
}