import request from '@/utils/request'

// 获取当前食堂的终端设备
export function getEquipment(params) {
  return request({
    url: '/admin/client/dev',
    method: 'get',
    params
  })
}
