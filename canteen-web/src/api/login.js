import request from '@/utils/request'


export function login(data) {
    return request({
      url: '/admin/login/handle',
      method: 'post',
      data
    })
  }