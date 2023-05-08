<template>
  <div>
    <!-- <div class="bg-white p-20">
      <el-select v-model="canteenId" placeholder="请选择" @change="changecanteen">
        <el-option v-for="item in canteenType" :key="item.index" :label="item.canteen_name"
                   :value="item.canteen_id"> </el-option>
      </el-select>
    </div> -->
    <GearHeader />
    <el-card class="box-shadow-none m-20" :body-style="{ padding: '0' }">
      <div class="w-100 p-10">
        <div class="flex-row align-center p-10 justify-between">
          <div class="toggle-box font-size-14">
            <a @click="toggleScreen" href="javascript:void(0)"
               class="el-text-primary "
               :title=" isShowScreen === true ? '点击收起搜索条件' : '点击展开搜索条件'">
              筛选
              <i :class="isShowScreen === true ? 'el-icon-arrow-down icon-show': 'el-icon-arrow-down icon-hide' " ></i>
            </a>
            <span class="ml-5" v-if="!isShowScreen">
                  已选条件：
                <el-tag size="small" >起止时间：{{select_date[0]}} - {{select_date[1]}}</el-tag>
            </span>
          </div>
          <div>
<!--            <el-button size="small" type="primary">刷新</el-button>-->
<!--            <el-button size="small" type="primary">打印</el-button>-->
            <a :href="downloadUrl">
              <el-button type="warning" size="small" icon="el-icon-download">导出</el-button>
            </a>
          </div>
        </div>
        <div>
          <transition name="slide-fade">
            <div v-show="isShowScreen" class="screen-box p-10">
              <div>
                <el-form size="small" inline>
                  <el-form-item label="起止时间">
                    <el-date-picker :clearable="false" :editable="false" v-model="select_date" type="daterange" format="yyyy年MM月dd日"
                      unlink-panels value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" />
                  </el-form-item>
                  <el-form-item>
                    <el-select v-model="summaryId" placeholder="选择汇总方式">
                      <el-option
                        v-for="item in summaryList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="原料">
                    <div class="flex-row">
                      <div>
                        <el-tag  v-if="raw_id_list.length>0" @close="removeRawId(raw_id_list[0].id)"  size="small" closable>{{raw_id_list[0].raw_name}}</el-tag>
                        <el-popover
                          v-if="raw_id_list.length>1"
                          placement="bottom"
                          width="300"
                          trigger="hover">
                          <div >
                            <el-form inline size="small">
                              <el-form-item v-for="(item, index) in raw_id_list"  class="mb-10"  v-if="index != 0" :key="item.id" >
                                <el-tag  size="small" @close="removeRawId(item.id)" closable>{{item.raw_name}}</el-tag>
                              </el-form-item>
                            </el-form>
                          </div>
                          <a slot="reference" class="mr-12"  href="javascript:;">
                            <el-tag  size="small">+ {{raw_id_list.length-1}}(查看)</el-tag>
                          </a>
                        </el-popover>
                      </div>
                      <a  v-if="raw_id_list.length > 0" title="点击选择原料" class="el-text-primary font-size-15 ml-12" @click="selectRawMaterialClick()" href="javascript:void(0)">
                        <i  class="el-icon-more"></i>
                      </a>
                      <div class="select-raw" v-if="raw_id_list.length === 0">
                        <span class="el-text-info mr-15">请选择原料</span>
                        <a  title="点击选择原料" class="el-text-primary font-size-15" @click="selectRawMaterialClick()" href="javascript:void(0)">
                          <i  class="el-icon-more"></i>
                        </a>
                      </div>
                    </div>
                  </el-form-item>
                  <el-form-item label="仓库">
                    <el-select v-model="wHouse_id" placeholder="请选择" clearable>
                      <el-option v-for="(item,index) in wareHouseList" :key="index" :label="item.whouse_name"
                                 :value="item.id" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="供应商" v-if="summaryId===2">
                    <el-select v-model="supplierId" placeholder="请选择供应商">
                      <el-option
                        v-for="item in supplierMini"
                        :key="item.id"
                        :label=" item.sup_name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
<!--                  <el-form-item label="单据编号">-->
<!--                    <el-input v-model.trim="keywords" placeholder="请输入单据编号"></el-input>-->
<!--                  </el-form-item>-->
                  <el-form-item label="申购人员"  v-if="summaryId===3">
                    <el-select v-model="admin_username" clearable  placeholder="请选择">
                      <el-option v-for="(item,index) in adminUserList" :key="index" :label="item.username"
                                 :value="item.username" />
                    </el-select>
                  </el-form-item>
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
       <div class="text-center font-size-18 mb-15">采购汇总表({{summaryList.find(x=>x.id === summaryId ).name}})</div>
      <el-table
        :data="purchaseSummaryList" size="mini" v-loading="loading"
        :header-cell-style="{'text-align':'center','color':'#000'}">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="type_name" label="原料分类" />
        <el-table-column prop="raw_no" label="原料编码" />
        <el-table-column prop="raw_name" label="原料名称" />
        <el-table-column prop="spec" label="规格" />
        <el-table-column prop="whouse_name" label="仓库名称" />
        <el-table-column prop="unit_purc" label="采购单位" />
        <el-table-column prop="num" label="实际入库数" />
        <el-table-column >
          <template slot="header" >
            平均单价
            <el-popover placement="top" width="300"
               popper-class="purchaseSummary-thead-tip" trigger="hover">
              <div >
                平均单价：只取确认定价的数据。
                一个原料，在7.1-7.15提交确认2个单价，一个未确认，则10元，15元，0元。
                取一个平均单价（10+15+0）/3=8.33元
              </div>
              <a slot="reference" class="el-text-primary" href="javascript:;">
                <i class="el-icon-question"></i>
              </a>
            </el-popover>
          </template>
          <template slot-scope="scope">
            <div class="text-red">
              ￥{{scope.row.price | price}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="采购总金额" >
<!--          <template slot="header" >-->
<!--            采购总金额-->
<!--            <el-popover placement="top-start" width="180"-->
<!--                popper-class="purchaseSummary-thead-tip "   trigger="hover">-->
<!--              <div>-->
<!--                采购总金额=数量*平均单价-->
<!--              </div>-->
<!--              <a slot="reference" class="el-text-primary" href="javascript:;">-->
<!--                <i class="el-icon-question"></i>-->
<!--              </a>-->
<!--            </el-popover>-->
<!--          </template>-->
          <template slot-scope="scope">
            <div class="text-red">
              ￥{{scope.row.sum | price}}
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="paging">
        <el-pagination
          @size-change="changePageSize"
          @current-change="changepageIndex"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageTotal">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog
      title="选择原料"
      :visible.sync="rawMaterialDialogVisible"
      :close-on-click-modal = "false"
      @close="rawMaterialDialogClosed()"
      center
      width="666px">
      <div>
        <el-row>
          <el-col :span="24">
            <el-form size="small" inline>
              <el-form-item >
                <el-input clearable  v-model.trim="rawKeyWords" placeholder="输入商品编号/商品名称/规格型号"></el-input>
              </el-form-item>
              <el-form-item label="仓库">
                <el-select v-model="rawHouse_id"  placeholder="请选择仓库" @change="selectWh">
                  <el-option v-for="item in rawWareHouseList" :key="item.id" :label="item.whouse_name" :value="item.id" />
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <ul class="list-style-none p-0 mt-20" v-if="totalTypeData.length>0">
              <li
                v-for="(item,index) in totalTypeData" :key="index"
                :class="item.id === raw_type_id ? 'el-bg-primary text-white pt-10 pb-10' : 'bg-white text-black pt-10 pb-10'">
                <a href="javascript:;" class="text-center font-size-14" @click="selectTypeIndex(item.id)">
                  <div class="pt-10 pb-10">
                    {{item.type_name}}
                  </div>
                </a>
              </li>
            </ul>
            <div class="no_type_box" v-else>暂无分类</div>
          </el-col>
          <el-col :span="18" class="dialog-right">
            <el-table
              :data="rawDataList"  size="mini" class="w-100"
              :header-cell-style="{'text-align':'center','color':'#000'}"
              style="width: 100%">
              <el-table-column>
                <template slot="header">
                  <div class="font-size-12  text-black">
                    <el-checkbox @change="changerawCheckedAll()"
                     :indeterminate="this.rawDataList.filter(x=> x.checked === true).length !== this.rawDataList.length && this.rawDataList.filter(x=> x.checked === true).length>0"
                     :disabled="this.rawDataList.length === 0"
                     v-model="rawCheckedAll" />
                  </div>
                </template>
                <template slot-scope="scope">
                  <el-checkbox @change="changeRawChecked()" v-model="scope.row.checked"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column prop="raw_name" label="原料" />
              <el-table-column prop="raw_no" label="原料编码" />
              <el-table-column prop="house_num" label="当前库存" />
              <el-table-column prop="unit_inv" label="单位" />
            </el-table>
            <div class="paging">
              <el-pagination
                small
                @size-change="rawChangePageSize"
                @current-change="rawChangepageIndex"
                :current-page="rawPageIndex"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="rawPageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="rawPageTotal">
              </el-pagination>
            </div>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="rawMaterialDialogVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="selectRawMaterial()">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import { supplierMiniList } from '@/api/supplierManagement'
  import { allWareHouseList } from '@/api/rawStock'
  import { rawList,  typeList } from '@/api/rawMaterial'
  import { typeRawList, addInApply, wHouseAllRaw } from '@/api/purchaseWh'
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
        canteenType: [], // 食堂类型
        canteenId: '1,2,3', // 食堂ID
        allcanteenType: {}, // 全部食堂（追加数据）
        canteenId_arry: [], // 全部食堂ID
        wareHouseList: [],
        wHouse_id: '',
        pageSize: 10,
        pageTotal: 0,
        pageIndex: 1,
        keywords: '',
        isQuery: false,
        select_date: [],
        supplierMini: [],
        supplierId: '',
        list: [],
        isShowScreen: true,
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
      //  汇总方式
        summaryList: [
          {
            id: 1,
            name: '按原料汇总'
          },
          {
            id: 2,
            name: '按供应商汇总'
          },
          {
            id: 3,
            name: '按申购人员汇总'
          }
        ],
        summaryId: 1,
        purchaseSummaryList: [],
      //  要提交的原料id
        raw_id_list: [],
      //  操作人
        admin_username: '',
        adminUserList: [],
        loading: false ,
        downloadUrl: '',

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
          console.log('获取仓库原料库存', response)
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
          canteen_id: this.canteenId,
          date_start: this.select_date[0],
          date_end: this.select_date[1],
          house_id: this.wHouse_id,
          summary_type: this.summaryId,
          page: this.pageIndex,
          page_size: this.pageSize
        }
        // if(this.keywords !== '') Object.assign(obj, {apply_no: this.keywords})
        if(this.supplierId !== '') Object.assign(obj, {supplier_id: this.supplierId})
        // if(this.purchaseTypeId !== '')  Object.assign(obj, {category_id: this.purchaseTypeId})
        if(this.admin_username !== '') Object.assign(obj, {username: this.admin_username})
        if(this.raw_id_list.length > 0)  Object.assign(obj, {raw_id: this.raw_id_list.map(y=>y.id).join(',')})
        purchaseSummary(obj).then(res=>{
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
      this.getAdminUser()
      this.getAllWareHouseList()
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
