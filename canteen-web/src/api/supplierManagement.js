// 供应商管理
import request from '@/utils/request'
//获取供应商列表
export function supplierList(params) {
    return request({
      url: 'admin/ware/house/supplier',
      method: 'get',
      params
    })
}

//添加供应商
export function addSupplier(data) {
    return request({
      url: 'admin/ware/house/supplier',
      method: 'POST',
      data
    })
}
//更新供应商
export function updateSupplier(id,data) {
    return request({
      url: 'admin/ware/house/supplier/'+id,
      method: 'PUT',
      data
    })
}
//删除供应商
export function delSupplier(id,data) {
    return request({
      url: 'admin/ware/house/supplier/'+id,
      method: 'DELETE',
      data
    })
}

//供应商详情
export function supplierDetail(id,params) {
    return request({
      url: 'admin/ware/house/supplier/'+id,
      method: 'get',
      params
    })
}
//获取导入进度查询
export function importSpeed(params) {
    return request({
      url: 'admin/ware/house/supplier-import',
      method: 'get',
      params
    })
}

//取消导入任务
export function cancelImportTask(data) {
    return request({
      url: 'admin/ware/house/supplier-import',
      method: 'PUT',
      data
    })
}

// 供应商MINI列表
export function supplierMiniList(params) {
  return request({
    url: 'admin/ware/house/supplier-mini',
    method: 'get',
    params
  })
}
