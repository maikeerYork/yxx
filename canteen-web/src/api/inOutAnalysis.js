import request from '@/utils/request'

//进销存
// 出入库金额统计
export function getMoney(params) {
    return request({
      url: '/admin/ware/house/inApply/statistics',
      method: 'GET',
      timeout:60000,
      params
    })
}
