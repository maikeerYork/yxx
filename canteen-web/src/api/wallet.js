import request from '@/utils/request'

// 获取用户钱包
export function userAccount(params) {
  return request({
    url: '/admin/user/account',
    method: 'get',
    params
  })
}

// 获取用户提现状态
export function getWithdrawalInfoApi(params) {
  return request({
    url: '/admin/user/withdrawal/info',
    method: 'get',
    params
  })
}

// 提现审核
export function WithdrawalAuditPassApi(id, data) {
  return request({
    url: `/admin/user/batch-withdrawal/apply/${id}`,
    method: 'POST',
    data
  })
}

export function withdrawStaffUserApi(id, params) {
  return request({
    url: `/admin/user/batch-withdrawal/user/${id}`,
    method: 'get',
    params
  })
}


// 获取未绑卡会员列表
export function noBindUser(params) {
  return request({
    url: '/admin/user/nocard',
    method: 'get',
    params
  })
}

// 用户充值
export function userRecharge(account_id, obj) {
  return request({
    url: '/admin/user/account/' + account_id,
    method: 'PUT',
    data: obj
  })
}

// 充值记录
export function rechargeList(params) {
  return request({
    url: 'admin/order/rechargeList',
    method: 'GET',
    params
  })
}

// 充值类型
export function rechargeType(params) {
  return request({
    url: 'api/rechargeType',
    method: 'GET',
    params
  })
}

// 充值详情
export function rechargeDetail(params) {
  return request({
    url: 'admin/order/rechargeDetail',
    method: 'GET',
    params
  })
}

//账单记录列表
export function billsList(params) {
  return request({
    url: 'admin/user/bills',
    method: 'GET',
    params
  })
}


// 支付账单类型
export function paySourceType(params) {
  return request({
    url: 'api/paySourceType',
    method: 'GET',
    params
  })
}

// 获取支付方式
export function payTypeList(params) {
  return request({
    url: 'admin/pay/type',
    method: 'GET',
    params
  })
}


//钱包类型
export function walletTypeList(params) {
  return request({
    url: 'api/walletType',
    method: 'GET',
    params
  })
}
//导入现金进度条
export function excelWalletProgress(params) {
  return request({
    url: 'excel/wallet/state',
    method: 'GET',
    params
  })
}


// 批量餐补
export function batchSubsidy(data) {
  return request({
    url: 'admin/user/subsidy-batch',
    method: 'POST',
    data
  })
}

// 补贴列表
export function userSubsidy(params) {
  return request({
    url: 'admin/user/subsidy',
    method: 'GET',
    params
  })
}

// 补贴状态
export function subsidyStatus(data) {
  return request({
    url: 'admin/user/subsidy-status',
    method: 'POST',
    data
  })
}

// 批量导入补贴用户进度查询
export function subsidyProgress(params) {
  return request({
    url: 'admin/subsidy/batch/state',
    method: 'GET',
    params
  })
}

// 取消导入
export function closeSubsidyImport(params) {
  return request({
    url: 'admin/subsidy/batch/close',
    method: 'GET',
    params
  })
}

// 补贴充值
export function subsidyRechage(data, account_id) {
  return request({
    url: 'admin/user/subsidy/' + account_id,
    method: 'PUT',
    data
  })
}

// 获取用户列表
export function accountUser(params) {
  return request({
    url: 'admin/user/accountUser',
    method: 'GET',
    params
  })
}


//钱包提现
export function walletWithdrawal(data) {
  return request({
    url: 'admin/user/account/withdrawal',
    method: 'POST',
    data
  })
}

//充值记录统计
export function rechargeTotal(params) {
  return request({
    url: 'admin/order/rechargeTotal',
    method: 'GET',
    timeout: 30000,
    params
  })
}

//获取当前账号的子账号
export function adminUser(params) {
  return request({
    url: 'admin/adminUser',
    method: 'GET',
    params
  })
}

//获取账单统计
export function billsTotal(params) {
  return request({
    url: 'admin/user/billsTotal',
    method: 'GET',
    timeout: 60000,
    params
  })
}

//获取账单记录汇总表
export function billSummary(params) {
  return request({
    url: 'admin/order/card/txn',
    method: 'GET',
    params
  })
}

// 提现记录
export function getWithdrawalRecord(params) {
  return request({
    url: 'admin/user/withdrawal/list',
    method: 'GET',
    params
  })
}
//获取饭卡收支统计表
export function incomeAndExpenses(params) {
  return request({
    url: 'admin/order/card/incomeAndExpenses',
    method: 'GET',
    timeout: 30000,
    params
  })
}

//获取统计餐别
export function diningTime(params) {
  return request({
    url: 'admin/statistics/dining/time',
    method: 'GET',
    params
  })
}

//获取缓存统计餐别
export function cacheDiningTime(params) {
  return request({
    url: 'admin/statistics/dining-time/cache',
    method: 'GET',
    params
  })
}

//修改统计餐别
export function editDiningTime(data, id) {
  return request({
    url: `admin/statistics/dining/time/${id}`,
    method: 'PUT',
    data
  })
}
//新增统计餐别
export function addDiningTime(data) {
  return request({
    url: `admin/statistics/dining/time`,
    method: 'POST',
    data
  })
}
//删除统计餐别
export function delDiningTime(data, id) {
  return request({
    url: `admin/statistics/dining/time/${id}`,
    method: 'DELETE',
    data
  })
}


//获取每日消费统计
export function dayConsume(params) {
  return request({
    url: 'admin/order/card/dayConsume',
    method: 'GET',
    timeout: 60000,
    params
  })
}

//获取个人每日消费统计
export function userDayConsume(params) {
  return request({
    url: 'admin/order/card/userDayConsume',
    method: 'GET',
    timeout: 60000,
    params
  })
}

//获取个人每日消费统计小计
export function totalUserDayConsume(params) {
  return request({
    url: 'admin/order/card/totalUserDayConsume',
    method: 'GET',
    timeout: 60000,
    params
  })
}

//获取个人每日消费统计 取餐
export function userDayConsumeTake(params) {
  return request({
    url: 'admin/order/card/userConsume',
    method: 'GET',
    timeout: 60000,
    params
  })
}
//获取个人每日消费统计小计 取餐
export function totalUserConsume(params) {
  return request({
    url: 'admin/order/card/totalUserConsume',
    method: 'GET',
    timeout: 60000,
    params
  })
}

// EXCEL充值导入-结果查询
export function batchStatus(params) {
  return request({
    url: 'excel/wallet/batch-status',
    method: 'GET',
    params
  })
}

//EXCEL充值导入-列表  历史记录
export function batchHistory(params) {
  return request({
    url: 'excel/wallet/export/list',
    method: 'GET',
    params
  })
}


// 消费纠单/充值 账单记录/消费纠错
export function repairCorrectApi(data) {
  return request({
    url: `admin/order/repair/correct`,
    method: 'POST',
    data
  })
}


// 消费纠错 列表
export function consumeCorrectApi(params) {
  return request({
    url: 'admin/order/repair/correct',
    method: 'GET',
    params
  })
}

// 充值纠单 /消费纠错
export function queryRechargeApi(params) {
  return request({
    url: 'admin/order/repair/recharge-order',
    method: 'GET',
    params
  })
}

// 补单 消费模式
export function equipmentPatternApi(params) {
  return request({
    url: 'admin/order/replenish/get-consumption-type',
    method: 'GET',
    params
  })
}


// 补单 立即补单
export function repairReplenishApi(data) {
  return request({
    url: 'admin/order/repair/replenish',
    method: 'POST',
    data
  })
}

// 补单 历史记录
export function repairRecordApi(params) {
  return request({
    url: 'admin/order/replenish/replenish-history',
    method: 'GET',
    params
  })
}
// 补单 补单结果
export function repairResultApi(params) {
  return request({
    url: 'admin/order/replenish/get-replenish-result',
    method: 'GET',
    params
  })
}

// 补单 补单列表
export function repairListApi(params) {
  return request({
    url: 'admin/order/repair/replenish',
    method: 'GET',
    params
  })
}

// 补单 进度条
export function progressApi(params) {
  return request({
    url: 'admin/order/replenish/get-replenish-speedofprogress',
    method: 'GET',
    params
  })
}
// 补单 重新补单
export function replenishAgainApi(data) {
  return request({
    url: 'admin/order/replenish/replenish-again',
    method: 'POST',
    data
  })
}
// 充值详情修改/备注
export function rechargeEditRemarkApi(data) {
  return request({
    url: 'admin/order/update-recharge-remark',
    method: 'POST',
    data
  })
}

// 提交批量提现
export function addBatchWithdrawalApi(data) {
  return request({
    url: 'admin/user/batch-withdrawal/add',
    method: 'POST',
    data
  })
}

// 批量提现 进度条
export function withdrawProgressApi(params) {
  return request({
    url: 'admin/user/batch-withdrawal/get-replenish-speedofprogress',
    method: 'GET',
    params
  })
}

// 批量提现结果
export function withdrawResultApi(params) {
  return request({
    url: 'admin/user/batch-withdrawal/get-batch-withdrawal-result',
    method: 'GET',
    params
  })
}

// 批量历史记录
export function withdrawHistoryRecordApi(params) {
  return request({
    url: 'admin/user/batch-withdrawal/get-batch-withdrawal-history',
    method: 'GET',
    params
  })
}

// 重新提现
export function againWithdrawApi(data) {
  return request({
    url: 'admin/user/batch-withdrawal/batch-withdrawal-again',
    method: 'POST',
    data
  })
}
// 自动发放补贴列表
export function automaticSubsidyApi(params) {
  return request({
    url: 'admin/user/automatic-subsidy/index',
    method: 'GET',
    params
  })
}

// 添加自动补贴活动
export function addAutomaticSubsidy(data) {
  return request({
    url: 'admin/user/automatic-subsidy/add',
    method: 'POST',
    data
  })
}
// 编辑自动补贴活动
export function editAutomaticSubsidy(data) {
  return request({
    url: 'admin/user/automatic-subsidy/edit',
    method: 'POST',
    data
  })
}

// 根据选额用户id获取对应数据 /编辑自动
export function editGetUserInfo(data) {
  return request({
    url: 'admin/user/automatic-subsidy/get-user-info',
    method: 'post',
    data
  })
}

// 根据选额用户id获取对应数据 /编辑自动
export function automaticSubsidyHistoryApi(params) {
  return request({
    url: 'admin/user/automatic-subsidy/get-automatic-subsidy-history',
    method: 'GET',
    params
  })
}
// 重新补贴/自动
export function againAutomaticSubsidyApi(data) {
  return request({
    url: 'admin/user/automatic-subsidy/automatic-subsidy-again',
    method: 'POST',
    data
  })
}
// 删除自动补贴
export function deleteAutomaticSubsidyApi(data) {
  return request({
    url: 'admin/user/automatic-subsidy/del-automatic-subsidy',
    method: 'POST',
    data
  })
}
// 删除自动补贴
export function alterAutomaticSubsidStatusyApi(data) {
  return request({
    url: 'admin/user/automatic-subsidy/edit-automatic-subsidy-status',
    method: 'POST',
    data
  })
}


// 获取导入补贴结果
export function subsidyResult(params) {
  return request({
    url: 'admin/subsidy/batch/result',
    method: 'GET',
    params
  })
}

// 获取导入补贴结果
export function subsidyBathHistory(params) {
  return request({
    url: 'admin/subsidy/batch/subsidyBathHistory',
    method: 'GET',
    params
  })
}

// 获取导入补贴结果
export function excelWalletResult(params) {
  return request({
    url: 'excel/wallet/result',
    method: 'GET',
    params
  })
}

// 获取钱包余额明细
export function balanceReport(params) {
  return request({
    url: 'admin/user/wallet-balance-report/index',
    method: 'GET',
    params
  })
}

// 总食堂报表
export function orderTotalReport(params) {
  return request({
    url: 'admin/order/total-report',
    method: 'GET',
    params
  })
}

// 获取反馈建议
export function getFeedList(params) {
  return request({
    url: 'ser/api/feedlist',
    method: 'GET',
    params
  })
}