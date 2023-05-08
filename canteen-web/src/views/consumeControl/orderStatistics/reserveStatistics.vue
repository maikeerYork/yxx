<template>
  <div class="reserveStatistics pb-20">
    <div class="content-box">
      <!-- 时间模块 -->
      <daytime @sendDaytime="sendDaytime" />
      <!--  @sendType="sendType"  -->

      <!-- 预定数据模块 -->
      <div class="main_container">
        <!-- 餐别tab -->
        <div class="main_meals">
          <div class="meals_box">
            <el-button-group>
              <el-button
                v-for="(item,index) in mealsList"
                :key="index"
                type="default"
                :class="mealsIndex==index?'active':''"
                @click="change_tab(item.id,index)"
              >{{ item.dining_name }}</el-button>
            </el-button-group>
          </div>
          <a :href="downExcelurl" class="export_btn">
            <el-button size="medium">
              <i class="el-icon-download" />
              <span>
                导出 xls
              </span>
            </el-button>
          </a>
        </div>
        <div class="content-data-box">
          <!-- 预定数据柱状图表  -->
          <reserveBarchart :need-bar-data="needBarData" />
           <div class="flex-row justify-end mt-20 mb-10 pr-40">
             <el-button v-print="printObj" type="primary"  >打 印</el-button>
           </div>
          <!-- 预定数据table表格  -->
          <div class="pl-40 pr-40 w-100 print-table"  >
            <table class="w-100 my-table text-center" cellspacing="0"  id="print_detail">
              <thead>
                <tr>
                  <th>预定时间</th>
                  <th>餐别</th>
                  <th>预定菜品</th>
                  <th>
                    <div class="flex-row justify-center  align-center">
                      <div>
                        菜品单价(元)
                        <el-popover
                          placement="top"
                          width="300"
                          trigger="hover">
                          <div class="font-size-12 text-center">
                            菜品如有修改价格，仅显示当前菜品最新单价
                          </div>
                          <a href="javascript:void(0)" slot="reference" class="ml-4 el-text-primary">
                            <i class="el-icon-question"></i>
                          </a>
                        </el-popover>
                      </div>
                      <div v-if="isPriceSort"><myTableSort @sortChange="sortChangeByPrice" /></div>
                    </div>
                  </th>
                  <th>
                    <div class="flex-row align-center justify-center">
                      预定数量
                      <div v-if="isCountSort"><myTableSort @sortChange="sortChangeByCount" /></div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, rowIndex) in tableData" :key="rowIndex">
                  <td>{{row.time_start}}</td>
                  <td>{{row.dining_name}}</td>
                  <td>{{row.foods_name}}</td>
                  <td>
                    <div v-for="(item, index) in  row.spec_list" :key="index">
                      {{item.name}} <span class="text-red">￥{{(parseFloat(item.price) /100).toFixed(2)}}</span>
                    </div>
                  </td>
                  <td>
                    <el-tooltip class="item" effect="dark" placement="top-start">
                      <div slot="content">
                        <ul>
                          <li v-for="(item,index) in row.spec_list" :key="index">
                            {{ item.name }}：{{ item.val }}
                          </li>
                        </ul>
                        <div>总数量：{{ row.foods_count }}</div>
                      </div>
                      <ul>
                        <li v-for="(item,index) in row.spec_list" :key="index" class="line-limit-length">
                          {{ item.name }}:{{ item.val }}
                        </li>
                      </ul>
                    </el-tooltip>
                  </td>
                </tr>
              </tbody>
            </table>
            <div  v-if="tableData.length === 0" class="el-table__empty-block"></div>
          </div>
          <!-- 分页器 -->

          <div class="paging pb-20">
            <el-pagination
              :current-page="pageData.page"
              :page-size="pageData.page_size"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pageData.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import reserveBarchart from '@/components/reserveBarchart'
import daytime from '@/components/dateSelect'
import { allMeals, miniReserveTop, miniReserve } from '@/api/OnlineOrderingStatistics'
import { kang_url } from '@/utils/baceurl'
import { mapGetters } from 'vuex'
import  {objArrayAsc, objArrayDesc} from  '@/utils/arrayFunction'
import  myTableSort from  '@/components/myTableSort'
export default {
  components: {
    reserveBarchart,
    daytime,
    myTableSort
  },
  props: {

  },
  data() {
    return {
      initsendInfo: {}, // 初始化数据
      needBarData: [], // barchart 需要的数据
      downExcelurl: '', // 综合数据 之 基础统计 Excel 表下载
      mealsList: [],
      mealsIndex: 0,
      tableData: [], // table表格数据
      pageData: {
        // 分页数据
        page: 1,
        page_size: 10,
        total: 0
      },
      dining_time_id: '', // 餐别id
      printObj: {
        id: 'print_detail',
        popTitle: ' ',
        extraCss: '',
        extraHead: `<meta http-equiv="Content-Language" content="zh-cn"/>,<style>  #print_detail {  }
          table {  border-collapse: collapse; font-size: 13px;} th {border: 1px solid #EBEEF5; padding: 6px 0;}
          td{border: 1px solid #EBEEF5; padding: 6px 0;color: #606266;}
         </style>`
      },
      isPriceSort: true,
      isCountSort: true,
    }
  },
  computed: {
    ...mapGetters([
      'canteen_check'
    ])
  },
  watch: {
    // 监听食堂ID
    canteen_check() {
      this.mealsIndex = 0 // 重置为默认餐别全部
      this.dining_time_id = '' // 重置餐别id为空
      this.getAllMeals()// 获取所有餐别
      this.getMiniReserveTop()// 获取预定排行柱状图数据
      this.getMiniReserve()// 获取菜品预定table表格
    }
  },
  created() {
    var todaytime = this.getcurrentData() // 当前起止时间
    this.$set(this.initsendInfo, 'date_start', todaytime)
    this.$set(this.initsendInfo, 'date_end', todaytime)
    this.getAllMeals()// 获取所有餐别
    this.getMiniReserveTop()// 获取预定排行柱状图数据
    this.getMiniReserve()// 获取菜品预定table表格

  },
  mounted() {
  },
  methods: {
    // 餐别切换
    change_tab(id, index) {
      this.pageData.page = 1
      this.mealsIndex = index
      this.dining_time_id = id
      this.getMiniReserveTop()// 获取预定排行柱状图数据
      this.getMiniReserve()// 获取菜品预定table表格
    },
    // 获取所有餐别
    getAllMeals() {
      this.$nextTick(function() {
        var obj = {}
        obj.canteen_id = this.canteen_check
        allMeals(obj).then(response => {
          this.mealsList = response.data.data.data
          this.mealsList.unshift({ id: '', dining_name: '全部' })
        }).catch((error) => {
          console.log(error)
        })
      })
    },

    // 获取预定排行柱状图数据
    getMiniReserveTop() {
      if (this.dining_time_id) {
        this.downExcelurl = kang_url + '/excel/orderMini/orderReserve' + '?' + 'canteen_id=' + this.canteen_check + '&' + 'date_start=' + this.initsendInfo.date_start + '&' + 'date_end=' + this.initsendInfo.date_end + '&' + 'dining_time_id=' + this.dining_time_id
      } else {
        this.downExcelurl = kang_url + '/excel/orderMini/orderReserve' + '?' + 'canteen_id=' + this.canteen_check + '&' + 'date_start=' + this.initsendInfo.date_start + '&' + 'date_end=' + this.initsendInfo.date_end
      }
      this.$nextTick(function() {
        var obj = {}
        obj.canteen_id = this.canteen_check
        obj.date_start = this.initsendInfo.date_start
        obj.date_end = this.initsendInfo.date_end
        if (this.dining_time_id) {
          obj.dining_time_id = this.dining_time_id
        }
        obj.rank = 10
        miniReserveTop(obj).then(response => {
          this.needBarData = response.data.data
        }).catch((error) => {
          console.log(error)
        })
      })
    },
    // 获取菜品预定table表格
    getMiniReserve() {
      this.$nextTick(function() {
        var obj = {}
        obj.canteen_id = this.canteen_check
        obj.date_start = this.initsendInfo.date_start
        obj.date_end = this.initsendInfo.date_end
        if (this.dining_time_id) {
          obj.dining_time_id = this.dining_time_id
        }
        obj.page = this.pageData.page
        obj.page_size = this.pageData.page_size
        miniReserve(obj).then(response => {
          this.tableData = response.data.data.data.map((item,index)=> Object.assign(item,
            {
              dataIndex: index +1,
              specListMax: Math.max.apply(Math,item.spec_list.map(item => { return item.price })),
              specListMin: Math.min.apply(Math,item.spec_list.map(item => { return item.price }))
            }
          ))
          console.log('this.tableData',this.tableData)
          this.pageData.total = response.data.data.total
          this.pageData.page_size = Number(response.data.data.per_page)
        }).catch((error) => {
          console.log(error)
        })
      })
    },

    // 当前标准时间转换 和 毫秒数时间转换 （注：只能转换成 年 月 日 ）
    getcurrentData(value) {
      if (value) {
        var date = new Date(value)
      } else {
        var date = new Date()
      }
      var currentDate = date.toISOString().slice(0, 10)
      return currentDate
    },

    /* 接收事件 */
    // 接收起始时间
    sendDaytime(currentDay) {
      this.$set(this.initsendInfo, 'date_start', currentDay.daytime_start_end[0])
      this.$set(this.initsendInfo, 'date_end', currentDay.daytime_start_end[1])
      this.pageData.page = 1
      this.getMiniReserveTop()// 获取预定排行柱状图数据
      this.getMiniReserve()// 获取菜品预定table表格
    },

    /*  分页 */
    handleSizeChange(val) {
      this.pageData.page_size = val
      this.getMiniReserve()
    },
    handleCurrentChange(val) {
      this.pageData.page = val
      this.getMiniReserve()
    },
    onSortChange({ column,prop, order }) {
      this.tableData.sort(this.sortPriceHandel(column, prop,order));
    },
    sortPriceHandel(column, propertyName, sort) {
      if (propertyName === 'spec_list') {
        //升序
        if (sort === 'ascending') this.tableData.sort(objArrayAsc('specListMin'))
        // 降序
        if (sort === 'descending') this.tableData.sort(objArrayDesc('specListMax'))
        if(sort === null) this.tableData.sort(objArrayAsc('dataIndex'))
      }
      if ( propertyName === 'foods_count') {
        if (sort === 'ascending') this.tableData.sort(objArrayAsc('foods_count'))
        // 降序
        if (sort === 'descending') this.tableData.sort(objArrayDesc('foods_count'))
        if(sort === null) this.tableData.sort(objArrayAsc('dataIndex'))
      }

      console.log('column',column)
      console.log('propertyName',propertyName)
      console.log('sort',sort)
    },
    sortChangeByPrice(sort) {
      if (sort === 'ascending') this.tableData.sort(objArrayAsc('specListMin'))
      // 降序
      if (sort === 'descending') this.tableData.sort(objArrayDesc('specListMax'))
      if(sort === null) this.tableData.sort(objArrayAsc('dataIndex'))
      this.isCountSort = false
      this.$nextTick(()=>{
        this.isCountSort = true
      })
    },
    sortChangeByCount(sort) {
      if (sort === 'ascending') this.tableData.sort(objArrayAsc('foods_count'))
      // 降序
      if (sort === 'descending') this.tableData.sort(objArrayDesc('foods_count'))
      if(sort === null) this.tableData.sort(objArrayAsc('dataIndex'))
      this.isPriceSort = false
      this.$nextTick(()=>{
        this.isPriceSort = true
      })
    }


  }
}
</script>


<style lang="scss" scoped>
.reserveStatistics {
  .my-table {
    border-collapse: collapse;
    border: 1px solid #EBEEF5;
    font-size: 13px;
    td,th {
      padding: 8px 0;
      border: 1px solid #EBEEF5;
    }
    td{
      color: #606266;
    }

  }
  .content-box {
    padding: 20px;
  }
  .content-data-box {
    background: #fff;
    width: 100%;
    box-sizing: border-box;
  }

  .main_meals {
    background: #fff;
    margin-top: 20px;
    padding: 20px 0;
    display: flex;
    justify-content: center;
    position: relative;
  }

  .meals_box {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    max-width: 500px;
  }
  .meals_item {
    padding: 5px 20px;
    border: 1px solid #eee;
    border-radius: 5px;
    cursor: pointer;
  }
  .active {
    background: #409eff;
    border: 1px solid #409eff;
    color: #fff;
  }
  .export_btn {
    position: absolute;
    right: 20px;
  }
  .paginationBox {
    margin-bottom: 20px;
    margin-right: 20px;
    background: #fff;
  }
}
.item {
  margin: 4px;
}
ul {
  padding: 0 !important;
}
li {
  list-style-type: none !important;
}
.line-limit-length {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; //文本不换行，这样超出一行的部分被截取，显示...
  width: 120px;
  margin: auto;
  cursor: pointer;
}
</style>
