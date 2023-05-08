import request from '@/utils/request'

// 大屏授权数据
export function authScreen(params) {
    return request({
        url: 'admin/canteen/clientType/clientInfo',
        method: 'get',
        params
    })
}
