<template>
  <div>
    <GearHeader />
    <el-card class="box-shadow-none m-20" :body-style="{ padding: '0' }">
      <div class="w-100 p-10">

        <div>
          <transition name="slide-fade">
            <div  class="screen-box p-10">
              <div>
                <el-form size="small" inline>
                  <!-- <el-form-item label="出库机构：">
                    <template>
                      <el-select v-model="orgValue" clearable placeholder="请选择">
                        <el-option
                            v-for="item in org"
                            :key="item.orgValue"
                            :label="item.label"
                            :value="item.orgValue">
                        </el-option>
                      </el-select>
                    </template>
                  </el-form-item> -->

                  <!-- <el-form-item label="食堂：">
                    <template>
                      <el-select v-model="canteenValue" clearable placeholder="请选择">
                        <el-option
                            v-for="item in canteen"
                            :key="item.canteenValue"
                            :label="item.label"
                            :value="item.canteenValue">
                        </el-option>
                      </el-select>
                    </template>
                  </el-form-item> -->

                  <!-- <el-form-item label="批次：">
                    <el-input v-model="batchNumber" placeholder="请输入内容"></el-input>
                  </el-form-item> -->
                  <!-- <el-form-item label="供应商：">
                    <el-input v-model="supplier" placeholder="请输入内容"></el-input>
                  </el-form-item> -->

                  <el-form-item label="过期状态：">
                    <template>
                      <el-select v-model="expireValue" clearable placeholder="请选择">
                        <el-option
                            v-for="item in expireType"
                            :key="item.expireValue"
                            :label="item.label"
                            :value="item.expireValue">
                        </el-option>
                      </el-select>
                    </template>
                  </el-form-item>

                  <!-- <el-form-item label="时间：">
                    <el-date-picker :clearable="false" :editable="false" v-model="select_date" type="daterange" format="yyyy年MM月dd日"
                                    unlink-panels value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" />
                  </el-form-item> -->
                </el-form>
              </div>
              <div class="flex-row justify-end">
                <el-form size="small" inline>
                  <el-form-item>
                    <el-button @click="queryData" type="primary">查询</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button @click="resetData()" type="primary" icon="el-icon-refresh"></el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </transition>
        </div>
      </div>


      <el-table :data="purchaseSummaryList" size="mini" v-loading="loading" :header-cell-style="{'text-align':'center','color':'#000'}">
        <el-table-column prop="raw_name" label="货物名称"/>
        <el-table-column prop="raw_no" label="货物编号" />
        <!-- <el-table-column prop="ProSerial" label="批次号" /> -->
        <el-table-column prop="unit_inv" label="单位" />
        <el-table-column prop="house_num" label="数量" />

        <el-table-column prop="update_at" label="最新更新日期" />
        <el-table-column prop="whouse_name" label="所属仓库" />
        <!-- <el-table-column prop="SupplierName" label="供应商" /> -->

      </el-table>
      <div class="paging">
        <el-pagination @size-change="changePageSize"  @current-change="changepageIndex" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageTotal">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { supplierMiniList } from '@/api/supplierManagement'
import { allWareHouseList,allRawConfList } from '@/api/rawStock'
import { rawList,  typeList } from '@/api/rawMaterial'
import { wHouseAllRaw } from '@/api/purchaseWh'
import {  purchaseSummary } from '@/api/purchaseStatistics'
import { adminUser } from '@/api/wallet'
import { kang_url } from '@/utils/baceurl'
import GearHeader from '@/components/GearHeader'
export  default  {
  filters: {
    price(price) {
      price = price / 100
      return price.toFixed(2)
    }
  },
  data() {
    return {
      batchNumber:'',
      supplier:'',
      canteenType: [], // 食堂类型
      canteenId: '1,2,3', // 食堂ID
      allcanteenType: {}, // 全部食堂（追加数据）
      canteenId_arry: [], // 全部食堂ID
      wareHouseList: [],
      wHouse_id: '',
      pageSize: 10,
      pageTotal: 0,
      pageIndex: 1,
      type: '1',
      keywords: '',
      isQuery: false,
      select_date: [],
      supplierMini: [],
      supplierId: '',
      list: [],
      isShowScreen: false,
      rawMaterialDialogVisible: false,
      totalBaseData: [],
      // 所有分类
      totalTypeData: [],
      raw_type_id: '',
      rawPageTotal: 0,
      rawPageIndex: 1,
      rawPageSize: 10,
      rawKeyWords: '',
      rawDataList: [],
      rawWareHouseList: [],
      rawHouse_id: '',
      wHouseRawList: [],
      rawCheckedAll: false,
      summaryId: 1,
      purchaseSummaryList: [],
      //  要提交的原料id
      raw_id_list: [],
      //  操作人
      admin_username: '',
      adminUserList: [],
      loading: false ,
      downloadUrl: '',
      org: [{
        orgValue: '1',
        label: '全部'
      }, {
        orgValue: '2',
        label: '永兴巷机关食堂'
      }],
      orgValue: '全部',
      canteen: [{
        canteenValue: '1',
        label: '全部'
      }, {
        canteenValue: '2',
        label: '永兴巷机关食堂'
      }, {
        canteenValue: '3',
        label: '永兴巷小卖部'
      }],
      canteenValue: '全部',
      expireType:[{
        expireValue:'1',
        label: '全部'
      },{
        expireValue:'2',
        label: '已过期'
      },{
        expireValue:'3',
        label: '未过期'
      },{
        expireValue:'4',
        label: '即将过期'
      },
      ],
      expireValue: '全部',
    }
  },
  components: {
    GearHeader
  },
  methods: {
    // 食堂初始化
    canteenInit() {
      this.canteenId = this.newCanteen_check
    },
    getSupplierMini() {
      supplierMiniList({canteen_id: this.canteenId}).then(res=> {
        this.supplierMini = res.data.data
      }).catch(err=>console.log(err))
    },
    // 选择食堂操作
    changecanteen(value) {
      // this.isSearch = false
      this.canteenId = value
      this.pageIndex = 1
      this.getPurchaseSummaryList()
    },
    getAllWareHouseList() {
      allWareHouseList({}).then(response => {
        this.wareHouseList = response.data.data
        this.rawWareHouseList = JSON.parse(JSON.stringify(response.data.data))
        if(this.rawWareHouseList.length >0) this.rawHouse_id = this.rawWareHouseList[0].id
        if (this.wareHouseList.length > 0) {
          this.wareHouseList.unshift({
            id: '',
            whouse_name: '全部'
          })
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    changePageSize(newPageSize) {
      this.isClickQuery()
      this.pageIndex = 1
      this.pageSize = newPageSize
      this.getPurchaseSummaryList()
    },
    changepageIndex(newPageIndex) {
      this.isClickQuery()
      this.pageIndex = newPageIndex
      this.getPurchaseSummaryList()
    },
    queryData() {
      this.isQuery = true
      if(this.summaryId ===1) {
        this.supplierId = ''
        this.admin_username = ''
      }
      if(this.summaryId ===2) {
        // this.supplierId = ''
        this.admin_username = ''
      }
      if(this.summaryId ===3) {
        this.supplierId = ''
        // this.admin_username = ''
      }
      this.getPurchaseSummaryList()
    },
    resetData() {
      this.isQuery = false
      this.pageSize =10
      this.pageIndex = 1
      this.canteenInit()
      this.getCurrentMounth()
      this.wHouse_id = ''
      this.raw_id_list = []
      this.summaryId = 1
      this.supplierId = ''
      this.admin_username = ''
      this.getPurchaseSummaryList()
    },
    isClickQuery() {
      if(!this.isQuery) {
        // this.keywords = ''
        // this.select_date = []
        // this.canteenInit()
        // this.getCurrentMounth()
        this.wHouse_id = ''
        this.raw_id_list = []
        this.summaryId = 1
        this.supplierId = ''
        this.admin_username = ''
      }
    },
    toggleScreen() {
      this.isShowScreen = !this.isShowScreen
    },
    selectRawMaterialClick() {
      this.getTypeList()
      this.getwHouseRawList()
      this.getRawList()
      this.rawCheckedAll = false
      this.rawMaterialDialogVisible = true
    },
    // 获取所有分类
    getTypeList() {
      typeList({page: 0}).then(response => {
        this.totalTypeData = response.data.data
        if (this.totalTypeData.length > 0) {
          this.totalTypeData.unshift({
            id: '',
            type_name: '全部'
          })
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    selectTypeIndex(id) {
      if(id === this.raw_type_id) return
      // this.activeIndex = index
      this.raw_type_id = id
      this.getRawList()
    },
    rawChangePageSize(newPageSize) {
      this.rawPageIndex = 1
      this.rawPageSize = newPageSize
      this.getRawList()
    },
    rawChangepageIndex(newPageIndex) {
      this.rawPageIndex = newPageIndex
      this.getRawList()
    },
    // 获取原料列表
    getRawList() {

      // var obj = {}
      // obj.page = this.pageData.page
      // obj.page_size = this.pageData.page_size
      // obj.raw_type = this.raw_type_id
      // if (this.formInline.keywords) {
      //   obj.keywords = this.formInline.keywords
      // }
      let obj = {
        page: this.rawPageIndex,
        page_size: this.rawPageSize,
        raw_type: this.raw_type_id
      }
      if(this.rawKeyWords!== '') Object.assign(obj,{keywords: this.rawKeyWords})
      // this.exportExcelurl = `${kang_url}/excel/ware/raw/list?canteen_id=${this.canteenId}&raw_type=${this.raw_type_id}&keywords=${this.formInline.keywords}` //原料导出
      rawList(obj).then(response => {
        // this.rawDataList = response.data.data.data.map(i=>Object.assign(i,{checked: false}))
        this.rawDataList =  response.data.data.data.map(i=>{
          const item = this.wHouseRawList.find(j=>j.raw_id === i.id)
          if(item) {
            return Object.assign(i,{house_num: item.house_num, checked: false})
          }
          return Object.assign(i,{house_num: 0, checked: false})
        })
        // this.pageData.page = response.data.data.current_page
        this.rawPageTotal = response.data.data.total
        // this.pageData.page_size = response.data.data.per_page
      }).catch((error) => {
        console.log(error)
      })
    },
    getwHouseRawList() {
      var obj = {}
      obj.house_id = this.rawHouse_id
      wHouseAllRaw(obj).then(response => {
        this.wHouseRawList = response.data.data
      }).catch((error) => {
        console.log(error)
      })
    },
    changeRawChecked() {
      const count = this.rawDataList.filter(x=> x.checked === true).length
      this.rawCheckedAll = count === this.rawDataList.length
    },
    changerawCheckedAll() {
      this.rawDataList=  this.rawDataList.map(i=>Object.assign(i,{
        checked: this.rawCheckedAll
      }))
    },
    //选择仓库
    selectWh() {
      this.getwHouseRawList()
      this.getRawList()
    },
    getNowFormatDate() {
      let date = new Date();
      let seperator1 = "-";
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      let currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    },
    //获取当前月
    getCurrentMounth() {
      const arr = this.getNowFormatDate().split('-')
      // const currentMounthOneDay =
      this.select_date = [`${arr[0]}-${arr[1]}-01`,this.getNowFormatDate()]

    },
    selectRawMaterial() {
      this.raw_id_list =  this.rawDataList.filter(x=> x.checked === true)
      this.rawMaterialDialogVisible = false
    },
    //获取当前账号的子账号
    getAdminUser(){
      adminUser({}).then(response => {
        this.adminUserList = response.data.data
      }).catch(error => {
        console.log(error)
      })
    },
    //  获取数据
    getPurchaseSummaryList() {
      // purchaseSummaryList
      this.loading = true
      let obj = {
        // canteen_id: this.canteenId,
        // date_start: this.select_date[0],
        // date_end: this.select_date[1],
        raw_type : 0,
        house_id: this.wHouse_id,
        // summary_type: this.summaryId,
        page: this.pageIndex,
        page_size: this.pageSize
      }
      // if(this.keywords !== '') Object.assign(obj, {apply_no: this.keywords})
      if(this.supplierId !== '') Object.assign(obj, {supplier_id: this.supplierId})
      // if(this.purchaseTypeId !== '')  Object.assign(obj, {category_id: this.purchaseTypeId})
      if(this.admin_username !== '') Object.assign(obj, {username: this.admin_username})
      if(this.raw_id_list.length > 0)  Object.assign(obj, {raw_id: this.raw_id_list.map(y=>y.id).join(',')})
      // axios.get('./inventoryInquiry.json').then(res=>{

      //   const{data:{data:{total,data}}} =res
      //   this.purchaseSummaryList = res.data.data
      //   this.pageTotal = res.data.total
      //   this.initDownLoadUrl()
      //   this.hideLoading()
      //   //this.purchaseSummaryList = data
      // })
      allRawConfList(obj).then(res=>{
        const{data:{data:{total,data}}} =res
        this.purchaseSummaryList = data
        this.pageTotal = total
        this.initDownLoadUrl()
        this.hideLoading()
      }).catch(err=>{
        console.error(err)
        this.hideLoading()
      })
    },
    hideLoading() {
      setTimeout(()=>{
        this.loading = false
      },300)
    },
    // 初始化下载链接
    initDownLoadUrl() {
      this.downloadUrl = `${kang_url}/excel/ware/purchase/summary/export?canteen_id=${this.canteenId}&
        date_start=${this.select_date[0]}&date_end=${this.select_date[1]}&house_id=${this.wHouse_id}&
        summary_type=${this.summaryId}
        ${this.supplierId !== '' ? '&supplier_id='+this.supplierId : ''}
        ${this.admin_username !=='' ? '&username='+this.admin_username : ''}
        ${this.raw_id_list.length>0 ? '&raw_id='+this.raw_id_list.map(y=>y.id).join(',') : ''}`
      // console.log('this.downloadUrl',this.downloadUrl)
    },
    rawMaterialDialogClosed() {
      this.rawKeyWords = ''
    },
    removeRawId(id) {
      const index = this.raw_id_list.findIndex(x=>x.id === id)
      this.raw_id_list.splice(index,1)
    }
  },
  created() {

  },
  mounted(){
    this.getCurrentMounth()
    this.canteenInit()
    // this.getAdminUser()
    // this.getAllWareHouseList()
    this.getSupplierMini()
    this.getPurchaseSummaryList()
  },
  watch:{
    rawKeyWords(curVal, oldVal) {
      //实现input连续输入，只发一次请求
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.getRawList()
      }, 500)
    },
    newCanteen_check() {
      this.canteenId = this.newCanteen_check
      this.pageIndex = 1
      this.getPurchaseSummaryList()
    }
  },
  computed: {
    ...mapGetters(['canteen_info', 'canteen_check','newCanteen_check'])
  }
}
</script>
<style lang="scss" scoped>
.screen-box {

  /*border: 1px solid #EBEEF5;*/
}
.dialog-right {
  border-left: 1px solid #EBEEF5;
}
.toggle-box::after {
  position: absolute;
  z-index: 2;
  width: 100px;
  height: 60px;
  border:  1px solid #EBEEF5;
}
.slide-fade-enter-active {
  /*background: green;*/
  /*transition: all .3s ease;*/
  transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  transform: translateY(20);
  opacity: 0;
}
.slide-fade-leave-active {
  transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  /*background: pink;*/
}
.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */ {
  /*transform: translateX(10px);*/
  /*opacity: 0;*/
  transform: translateY(-20);
  opacity: 0;
  /*background: red;*/
}
.icon-show {
  /*ease-in-out 0s 1 alternate forwards*/
  animation:icon-show .2s linear forwards;
}
.icon-hide {
  animation:icon-hide .2s linear forwards ;
}
@keyframes icon-show{
  0%{-webkit-transform:rotate(0deg);}
  25%{-webkit-transform:rotate(45deg);}
  50%{-webkit-transform:rotate(90deg);}
  75%{-webkit-transform:rotate(135deg);}
  100%{-webkit-transform:rotate(180deg);}
}
@keyframes icon-hide{
  0%{-webkit-transform:rotate(180deg);}
  25%{-webkit-transform:rotate(135deg);}
  50%{-webkit-transform:rotate(90deg);}
  75%{-webkit-transform:rotate(45deg);}
  100%{-webkit-transform:rotate(0deg);}
}
.select-raw {
  border-bottom: 1px solid #C0C4CC;
}

</style>
<style>
.purchaseSummary-thead-tip  {
  background:#909399 ;
  color: #fff;
  border: none;
}
</style>
