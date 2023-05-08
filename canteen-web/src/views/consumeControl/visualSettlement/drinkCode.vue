<template>
  <div class="drinkCode">
    <div class="content-box">

      <!-- 时间模块 -->
      <daytime @sendDayDrink="sendDayDrink" />

      <!-- 销售数据 -->
      <div class="saleNumber">
        <div>
          <div class="minbox borders">
            <div class="postiongBox">饮料总类型(种)</div>
            <div class="postionNumber">{{ TotalDishBaseData.code_count }}</div>
          </div>
        </div>
        <div>
          <div class="minbox">
            <div class="postiongBox">销售总量(份)</div>
            <div class="postionNumber">{{ TotalDishBaseData.sell_count }}</div>
          </div>
        </div>
        <div>
          <div class="minbox">
            <div class="postiongBox">销售总额(元)</div>
            <div v-if="TotalDishBaseData.money" class="postionNumber">{{ TotalDishBaseData.money | price }}</div>
            <div v-else class="postionNumber">{{ TotalDishBaseData.money }}</div>
          </div>
        </div>
      </div>

      <div class="nav margin-top-20 padding-10">
        <el-tabs v-model="saleActiveName" @tab-click="dirk_chartClick">
          <el-tab-pane label="销售趋势" name="first">
            <el-card>
              <div class="clearfix" style="margin-top:15px">
                <el-radio-group v-model="saleradio1">
                  <el-radio-button label="销售额" />
                  <el-radio-button label="销售量" />
                </el-radio-group>
                <a :href="downExcelurl">
                  <el-button size="medium" style="float: right">
                    <i class="el-icon-download" />
                    <span>
                      下载 xls
                    </span>
                  </el-button>
                </a>
              </div>
              <drinkcode-linechart v-if="drink_lineShow" :dishlinedata="codeLineData" :saleradio1="saleradio1" />
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="销售占比" name="second">
            <el-card>
              <div class="clearfix" style="margin-top:15px">
                <el-radio-group v-model="saleradio2" @change="changebarchart">
                  <el-radio-button label="销售额" />
                  <el-radio-button label="销售量" />
                </el-radio-group>
                <a :href="saleradio2 == '销售额'?downExcelurl2:downExcelurl3">
                  <el-button size="medium" style="float: right">
                    <i class="el-icon-download" />
                    <span>
                      下载 xls
                    </span>
                  </el-button>
                </a>
              </div>
              <drinkcode-barchart v-if="drink_barShow" :needdrinkcode-barchart="codeBarData" />
              <drinkcode-barchart2 v-else :needdrinkcode-barchart2="codeBarData2" />
            </el-card>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 表格 -->
      <el-row class="foodbox margin-top-20">
        <el-col>
          <div class="ordertable">
            <div>营业数据情况</div>
            <div class="searchDI">
              <div>
                <el-input v-model="searchValueDrink" placeholder="请输入饮料名称或条码" class="input-with-select" @input="chageCodenull" />
              </div>
              <div>
                <el-button icon="el-icon-search" @click="drinkCodeSearch" />
              </div>
              <a :href="downExcelurl4" class="margin-left-10">
                <el-button>
                  <i class="el-icon-download" />
                  <span>
                    下载 xls
                  </span>
                </el-button>
              </a>
            </div>
          </div>
        </el-col>

        <el-col>
          <div class="tables">
            <el-table
              :data="codeTableData.data"
              style="width: 100%"
              :default-sort="{prop: 'canteen_name', order: 'descending'}"
              :header-cell-style="{'text-align':'center'}"
            >
              <el-table-column
                prop="code_name"
                label="饮料名称"
              />
              <el-table-column
                prop="canteen_name"
                label="所属档口"
              />
              <el-table-column
                prop="count"
                label="销售量（份）"
                sortable
              />
              <el-table-column
                prop="money"
                label="销售额（元）"
                sortable
              >
                <template slot-scope="scope">
                  ￥{{ scope.row.money | price }}
                </template>
              </el-table-column>
              <!-- </el-table-column> -->
              <!-- <el-table-column
                prop="address"
                label="统计"
              >
                <template slot-scope="scope">
                  <div @click="LookSaleChart(scope.row)">
                    <svg-icon icon-class="tongji" />
                  </div>
                </template>
              </el-table-column> -->
            </el-table>
          </div>
        </el-col>

        <el-col>
          <div style="overflow:hidden;background:#fff">
            <div class="paging">
              <el-pagination
                :current-page="pageData.page"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageData.page_size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pageData.total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </el-col>
      </el-row>

    </div>
  </div>
</template>

<script>
import drinkcodeBarchart from '@/components/drinkcodeBarchart'
import drinkcodeLinechart from '@/components/drinkcodeLinechart'
import drinkcodeBarchart2 from '@/components/drinkcodeBarchart2'
import daytime from '@/components/daytime'
import { kang_url } from '@/utils/baceurl'
import { totalCodeBase, totalCodeTrend, totalCodePct, totalCodeSell } from '@/api/businessStatistics'
import { mapGetters } from 'vuex'
export default {
  filters: {
    price(price) {
      price = price / 100
      return price.toFixed(2)
    }
  },
  components: {
    drinkcodeBarchart,
    drinkcodeLinechart,
    drinkcodeBarchart2,
    daytime
  },
  props: {
    drinkname: {
      type: String,
      required: true
    },
    canteenid: {
      type: [String, Number],
      required: true
    },
    clientid: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      getTableList: 'all', // 防止搜索和分页混淆
      drinkchartShow: false,
      drinkCodeInfo: {
      }, // 初始化数据
      TotalDishBaseData: {}, // 饮料条码统计 之 基础统计
      codeLineData: [], // 饮料统计 之 饮料销售走势
      codeBarData: [], // 饮料统计 之 饮料销售额占比
      codeBarData2: [], // 饮料统计 之 饮料销售量占比
      codeTableData: [], // 饮料统计 之 饮料销售情况-分页
      saleActiveName: 'first',
      saleradio1: '销售额',
      saleradio2: '销售额',
      drink_lineShow: false,
      drink_barShow: false,
      currentPage4: 4,
      type: 0,
      pageData: { // 分页
        page: 1,
        page_size: 10,
        total: 10
      },
      searchValueDrink: '', // 搜索值
      centerDialogVisible: false,
      dialogactiveName: 'first', // 表格tap
      dialogChartShow: false, // 图表tap(防止图表宽度问题)
      saleradio3: '销售额',
      saleradio4: '销售额',
      downExcelurl: '', // 餐盘数据 之 基础统计 Excel 表下载
      downExcelurl2: '', // 餐盘数据 之 金额占比 Excel 表下载
      downExcelurl3: '', // 餐盘数据 之 数量占比 Excel 表下载
      downExcelurl4: '' // 餐盘数据 之 表格 Excel 表下载
    }
  },
  computed: {
    ...mapGetters([
      'allCanteenInfo'
    ])
  },
  watch: {
    // 监听食堂ID
    canteenid(newV, oldV) {
      this.$set(this.drinkCodeInfo, 'canteen_id', newV)
      if (this.drinkCodeInfo.date_start) {
        this.getTotalCodeBase()
      }
    },
    // 监听设备ID
    clientid(newV, oldV) {
      this.$set(this.drinkCodeInfo, 'client_id', newV)
      if (this.drinkCodeInfo.date_start) {
        this.getTotalCodeBase()
      }
    },
    // 监听 tabname 饮料统计
    drinkname(newV, oldV) {
      this.drink_lineShow = true
      var todaytime = this.getcurrentData() // 当前起止时间

      this.$set(this.drinkCodeInfo, 'canteen_id', this.canteenid)
      this.$set(this.drinkCodeInfo, 'client_id', this.clientid)
      this.$set(this.drinkCodeInfo, 'date_start', todaytime)
      this.$set(this.drinkCodeInfo, 'date_end', todaytime)
      this.type = 0

      this.getTotalCodeBase()
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
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
    sendDayDrink(currentDay) {
      this.$set(this.drinkCodeInfo, 'canteen_id', this.canteenid)
      this.$set(this.drinkCodeInfo, 'client_id', this.clientid)
      this.$set(this.drinkCodeInfo, 'date_start', currentDay.daytime_start_end[0])
      this.$set(this.drinkCodeInfo, 'date_end', currentDay.daytime_start_end[1])
      this.type = currentDay.type
      this.getTotalCodeBase()
    },
    /* 饮料条码统计 */
    // 饮料条码统计 之 基础统计
    getTotalCodeBase() {
      this.downExcelurl = kang_url + '/excel/code/SaleTrend' + '?' + 'canteen_id=' + this.drinkCodeInfo.canteen_id + '&' + 'client_id=' + this.drinkCodeInfo.client_id + '&' + 'date_start=' + this.drinkCodeInfo.date_start + '&' + 'date_end=' + this.drinkCodeInfo.date_end + '&' + 'date_type=' + this.type

      this.downExcelurl2 = kang_url + '/excel/code/SaleRate' + '?' + 'canteen_id=' + this.drinkCodeInfo.canteen_id + '&' + 'client_id=' + this.drinkCodeInfo.client_id + '&' + 'date_start=' + this.drinkCodeInfo.date_start + '&' + 'date_end=' + this.drinkCodeInfo.date_end + '&' + 'pct_type=1'

      this.downExcelurl3 = kang_url + '/excel/code/SaleRate' + '?' + 'canteen_id=' + this.drinkCodeInfo.canteen_id + '&' + 'client_id=' + this.drinkCodeInfo.client_id + '&' + 'date_start=' + this.drinkCodeInfo.date_start + '&' + 'date_end=' + this.drinkCodeInfo.date_end + '&' + 'pct_type=2'
      totalCodeBase(this.drinkCodeInfo).then(response => {
        this.TotalDishBaseData = response.data.data
        this.getTotalCodeTrend()
      }).catch((error) => {
        console.log(error)
      })
    },

    //  条码统计 之 条码销售走势
    getTotalCodeTrend() {

      var obj = {}
      obj.canteen_id = this.canteenid
      obj.client_id = this.drinkCodeInfo.client_id
      obj.date_start = this.drinkCodeInfo.date_start
      obj.date_end = this.drinkCodeInfo.date_end
      obj.date_type = this.type
      totalCodeTrend(obj).then(response => {
        this.codeLineData = response.data.data
        this.getTotalCodePct()
      }).catch((error) => {
        console.log(error)
      })
    },

    // 饮料统计 之 饮料销售额占比
    getTotalCodePct() {

      var obj = {}
      obj.canteen_id = this.canteenid
      obj.client_id = this.drinkCodeInfo.client_id
      obj.date_start = this.drinkCodeInfo.date_start
      obj.date_end = this.drinkCodeInfo.date_end
      obj.pct_type = 1
      totalCodePct(obj).then(response => {
        if (response.data.data == null) {
          this.codeBarData = []
        } else {
          this.codeBarData = response.data.data
        }
        this.getTotalCodePct2()
      }).catch((error) => {
        console.log(error)
      })
    },

    // 饮料统计 之 饮料销售数量占比
    getTotalCodePct2() {
      var obj = {}
      obj.canteen_id = this.canteenid
      obj.client_id = this.drinkCodeInfo.client_id
      obj.date_start = this.drinkCodeInfo.date_start
      obj.date_end = this.drinkCodeInfo.date_end
      obj.pct_type = 2
      totalCodePct(obj).then(response => {
        if (response.data.data == null) {
          this.codeBarData2 = []
        } else {
          this.codeBarData2 = response.data.data
        }
        this.getTotalCodeSell()
      }).catch((error) => {
        console.log(error)
      })
    },

    // 饮料统计 之 饮料销售情况-分页
    getTotalCodeSell() {
      if (this.getTableList === 'all') {
        this.searchValueDrink = ''
      }
      var obj = {}
      obj.canteen_id = this.canteenid
      obj.client_id = this.drinkCodeInfo.client_id
      obj.date_start = this.drinkCodeInfo.date_start
      obj.date_end = this.drinkCodeInfo.date_end
      if (this.searchValueDrink) {
        obj.query_name = this.searchValueDrink
        this.downExcelurl4 = kang_url + '/excel/code/SaleCondition' + '?' + 'canteen_id=' + obj.canteen_id + '&' + 'client_id=' + obj.client_id + '&' + 'date_start=' + this.drinkCodeInfo.date_start + '&' + 'date_end=' + this.drinkCodeInfo.date_end + '&' + 'query_name=' + obj.query_name
      }

      obj.page = this.pageData.page
      obj.page_size = this.pageData.page_size
      this.downExcelurl4 = kang_url + '/excel/code/SaleCondition' + '?' + 'canteen_id=' + obj.canteen_id + '&' + 'client_id=' + obj.client_id + '&' + 'date_start=' + this.drinkCodeInfo.date_start + '&' + 'date_end=' + this.drinkCodeInfo.date_end
      this.$nextTick(function() {
        totalCodeSell(obj).then(response => {
          this.codeTableData = response.data.data
          this.pageData.page = this.codeTableData.current_page
          if (this.codeTableData.per_page) {
            this.pageData.page_size = Number(this.codeTableData.per_page)
          }
          this.pageData.total = this.codeTableData.total
          this.searchValueDrink = ''
        }).catch((error) => {
          console.log(error)
        })
      })
    },

    // 表格搜索
    drinkCodeSearch() {
      this.pageData.page = 1
      if (this.searchValueDrink) {
        this.getTableList = 'search'
      } else {
        this.getTableList = 'all'
      }
      this.getTotalCodeSell()
    },
    // 监控搜索框
    chageCodenull(value) {
      if (!value) {
        this.getTableList = 'all'
        this.getTotalCodeSell()
      }
    },

    // 饮料弹框统计图表 tap切换()
    dirk_chartClick(tab) {
      if (tab.name == 'second') {
        this.drink_barShow = true
      }
    },

    // 销售占比 切换（销售量，销售额）
    changebarchart(value) {
      if (value == '销售量') {
        this.drink_barShow = false
      } else {
        this.drink_barShow = true
      }
    },

    // 查看统计图表
    LookSaleChart(item) {
      this.currentData = item
      this.centerDialogVisible = true
    },

    // 分页
    handleSizeChange(val) {
      this.pageData.page_size = val
      this.getTotalCodeSell()
    },
    handleCurrentChange(val) {
      this.pageData.page = val
      this.getTotalCodeSell()
    }
  }
}
</script>

<style lang="scss" scoped>

.drinkCode{
  .bg-white{
    // background-color: white;
  }
  .searchDI{
    display: flex;
  }
  .content-box{
      margin: 20px;
      .box-card{
        overflow: visible;
        margin-top: 20px;
        box-shadow: rgba(60, 64, 67, 0.3) 0 1px 2px 0, rgba(60, 64, 67, 0.15) 0 1px 3px 1px;
        .card-header{
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .el-card__body{
          padding: 0;
        }
      }
      .content-card-box{
        display: flex;
        .bar{
          flex: 2;
          margin-right: 20px;
        }
        .pie{
          flex: 1;
        }
      }
  }
  .saleNumber{
       height: 144px;
       background: #fff;
       display: flex;
       margin-top: 20px;
       border: 1px solid #ddd;
       >div{
         flex: 1;
         display: flex;
         align-items: center;
       }
       .minbox{
         height: 80%;
         width: 80%;
         display: flex;
         flex-direction: column;
        padding: 30px;
        border-left:1px solid #ddd;
        // background-color: #f0f2f5;
        &:hover{
               box-shadow: 2px 1px 8px 2px rgba(0, 0, 0, 0.09), 0px -1px 0px 0px rgba(0, 0, 0, 0.02);
        }
       }
      .borders{
        border-left: none;
      }
    }
  .postiongBox{
    margin-bottom: 10px;
    font-size: 12px;
    color: #888888;
  }
  .postionNumber{
    font-size: 30px;
    color: rgba(0,0,0,.85);
  }
  .nav{
    background-color: #fff;
    box-shadow: rgba(60, 64, 67, 0.3) 0 1px 2px 0, rgba(60, 64, 67, 0.15) 0 1px 3px 1px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .paging{
    padding: 20px;
    background: #fff;
    float:right;
  }
}
</style>
