import request from '@/utils/request'

/* 卡  */
// 卡列表
export function cardList(params) {
  return request({
    url: '/admin/user/card',
    method: 'GET',
    params
  })
}
//feng 卡状态列表

export function cardStatusList(params) {
  return request({
    url: '/admin/user/card/status/list',
    method: 'GET',
    params
  })
}

// 卡添加
export function addCard(data) {
  return request({
    url: '/admin/user/card',
    method: 'POST',
    data
  })
}

// 卡编辑
export function editCard(data, id) {
  return request({
    url: '/admin/user/card/' + id,
    method: 'PUT',
    data
  })
}

// 卡删除
export function deleteCard(data, id) {
  return request({
    url: 'admin/user/card/' + id,
    method: 'DELETE',
    data
  })
}

// 注销卡
export function logoutCard(data) {
  return request({
    url: 'admin/user/card/logout',
    method: 'POST',
    data
  })
}

// 注销卡列表
export function logoutList(params) {
  return request({
    url: 'admin/user-card/logoutList',
    method: 'GET',
    params
  })
}

//注销卡详情
export function logoutDetail(params) {
  return request({
    url: 'admin/user-card/logoutDetail',
    method: 'GET',
    params
  })
}

/* 卡类型  */
// 卡类型列表
export function cardTypeList(params) {
  return request({
    url: '/admin/user/cardtype',
    method: 'GET',
    params
  })
}

export function allCardTypeList(params) {
  return request({
    url: '/admin/user/card-type/all',
    method: 'GET',
    params
  })
}


// 卡类型添加
export function addCardType(data) {
  return request({
    url: '/admin/user/cardtype',
    method: 'POST',
    data
  })
}

// 卡类型编辑
export function editCardType(data, id) {
  return request({
    url: '/admin/user/cardtype/' + id,
    method: 'PUT',
    data
  })
}

// 卡类型删除
export function deleteCardType(data, id) {
  return request({
    url: 'admin/user/cardtype/' + id,
    method: 'DELETE',
    data
  })
}
export function setBatchSetCardType(data) {
  return request({
    url: 'admin/user/card-type/batchSetCardType',
    method: 'POST',
    data
  })
}
//批量设置卡类型


// 补卡记录 replaceList
export function replaceList(params) {
  return request({
    url: 'admin/user-card/replaceList',
    method: 'GET',
    params
  })
}


//卡详情
export function cardDetail(id, params) {
  return request({
    url: `admin/user/card/${id}`,
    method: 'GET',
    params
  })
}

//挂失补卡
export function replaceCard(data) {
  return request({
    url: 'admin/user-card/replaceCard',
    method: 'POST',
    data
  })
}

//退卡统计管理
export function logoutTotal(params) {
  return request({
    url: 'admin/user-card/logoutTotal',
    method: 'GET',
    params
  })
}

//补卡统计管理
export function replaceTotal(params) {
  return request({
    url: 'admin/user-card/replaceTotal',
    method: 'GET',
    params
  })
}

//过期卡列表
export function expiryList(params) {
  return request({
    url: 'admin/user-card/expiryList',
    method: 'GET',
    params
  })
}

//过期卡统计管理
export function expiryTotal(params) {
  return request({
    url: 'admin/user-card/expiryTotal',
    method: 'GET',
    params
  })
}

//导出用户卡信息
export function exportUserCard(params) {
  return request({
    url: 'excel/user-card/list/export',
    method: 'GET',
    params
  })
}

//卡状态总数

export function cardStatusCount(params) {
  return request({
    url: 'admin/statistics/card-type',
    method: 'GET',
    params
  })
}
