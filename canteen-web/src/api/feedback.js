import request from '@/utils/request'

// 用户组人员列表
export function getFeedbackOrSuggestionList(params) {
  return request({
    url: 'admin/message',
    method: 'get',
    params
  })
}




