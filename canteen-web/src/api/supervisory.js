import request from '@/utils/monitoring'
import axios from 'axios'
// 仓库入库申请列表
export function getMonitoring(params) {
    return request({
      url: 'admin/canteen/live/channelList',
      method: 'get',
      params
    })
  }


export function getLocalMonitoring(params){
    return axios.get('./camera.json')
}