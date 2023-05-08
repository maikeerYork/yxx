<template>
  <div class="dinnerPlate">
    <div class="content-box">

      <!-- 时间模块 -->
      <daytime @sendDaytimedish="sendDaytimedish" />

      <!-- 销售数据 -->
      <div class="saleNumber">
        <div>
          <div class="minbox borders">
            <div class="postiongBox">餐盘总类型(种)</div>
            <div class="postionNumber">{{ TotalDishBaseData.dish_count }}</div>
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

      <!-- 数据图表 -->
      <div class="nav margin-top-20 padding-10">
        <el-tabs v-model="saleActiveName" @tab-click="salehandleClick">
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
              <dishlinechart v-if="chartShow" :dishlinedata="dishLineData" :saleradio1="saleradio1" />
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
              <dishbarchart v-if="cantreenChartShow" :needdish-bar-data="dishBarData" />
              <dishbarchart2 v-else :needdish-bar-data="dishBarData2" />
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
                <el-input
                  v-model="searchValue"
                  placeholder="请输入餐盘编号或名称"
                  class="input-with-select"
                  @input="chagedishnull"
                />
              </div>
              <div>
                <el-button icon="el-icon-search" @click="dinnerPlateSearch" />
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
              :data="dishTableData.data"
              style="width: 100%"
              :default-sort="{prop: 'name', order: 'descending'}"
              :header-cell-style="{'text-align':'center'}"
            >
              <el-table-column prop="name" label="餐盘编号" />
              <el-table-column prop="" label="图片" width="180">
                <template slot-scope="scope">
                  <div>
                    <el-tooltip placement="top">
                      <div slot="content">
                        <img
                          :src="scope.row.image_path"
                          style="width:255px;height:180px;border-radius: 5%;"
                          alt="图片加载失败..."
                        >
                      </div>
                      <img
                        :src="scope.row.image_path"
                        style="width:156px;height:112px;border-radius: 5%;"
                        alt="图片加载失败..."
                      >
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="dish_name" label="名称" />
              <el-table-column prop="color" label="颜色" width="180">
                <template slot-scope="scope">
                  <div>
                    <div
                      v-if="scope.row.color == '0'"
                      style="width: 25px;height: 25px;border-radius: 10%; border: 1px solid rgb(221, 221, 221); background-color: rgb(253, 253, 253);display: inline-block;box-shadow: 4px 3px 4px 0px black;"
                    />
                    <div
                      v-else-if="scope.row.color == '1'"
                      style="width: 25px; height: 25px; border-radius: 10%;border: 1px solid rgb(221, 221, 221); background-color: #00b201;display:inline-block;box-shadow: 4px 3px 4px 0px black;"
                    />
                    <div
                      v-else-if="scope.row.color == '2'"
                      style="width: 25px; height: 25px; border-radius: 10%;border: 1px solid rgb(221, 221, 221); background-color: #b90000;display:inline-block;box-shadow: 4px 3px 4px 0px black;"
                    />
                    <div
                      v-else-if="scope.row.color == '3'"
                      style="width: 25px; height: 25px; border-radius: 10%;border: 1px solid rgb(221, 221, 221); background-color: #0034c3;display:inline-block;box-shadow: 4px 3px 4px 0px black;"
                    />
                    <div
                      v-else-if="scope.row.color == '4'"
                      style="width: 25px; height: 25px; border-radius: 10%;border: 1px solid rgb(221, 221, 221); background-color: #fe7e00;display:inline-block;box-shadow: 4px 3px 4px 0px black;"
                    />
                    <div
                      v-else
                      style="width: 25px; height: 25px; border-radius: 10%;border: 1px solid rgb(221, 221, 221); background-color: #fbfe2b;display:inline-block;box-shadow: 4px 3px 4px 0px black;"
                    />
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="常用菜品" />
              <el-table-column prop="canteen_name" label="所属食堂" />
              <el-table-column prop="count" label="销售量（份）" sortable />
              <el-table-column prop="money" label="销售额（元）" sortable>
                <template slot-scope="scope">
                  ￥{{ scope.row.money | price }}
                </template>
              </el-table-column>
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

      <!-- 销售统计弹框 -->
      <el-row>
        <el-col>
          <el-dialog title="提示" :visible.sync="centerDialogVisible" width="80%" center>
            <el-tabs v-model="dialogactiveName" @tab-click="dialogTap">
              <el-tab-pane label="消费趋势" name="first">
                <el-card class="box-card">
                  <el-radio-group v-model="saleradio3" class="margin-top-20">
                    <el-radio-button label="销售额" />
                    <el-radio-button label="销售量" />
                  </el-radio-group>
                  <!-- <line-chart /> -->
                </el-card>
              </el-tab-pane>
              <el-tab-pane label="消费占比" name="second">
                <el-card class="box-card">
                  <el-radio-group v-model="saleradio4" class="margin-top-20">
                    <el-radio-button label="销售额" />
                    <el-radio-button label="销售量" />
                  </el-radio-group>
                  <!-- <bar-chart v-if="dialogChartShow" /> -->
                </el-card>
              </el-tab-pane>
            </el-tabs>
          </el-dialog>
        </el-col>
      </el-row>

    </div>
  </div>
</template>

<script>
import dishlinechart from '@/components/dishlinechart'
import dishbarchart from '@/components/dishbarchart'
import dishbarchart2 from '@/components/dishbarchart2'
import daytime from '@/components/daytime'
import { totalDishBase, totalDishTrend, totalDishPct, totalDishSell } from '@/api/businessStatistics'
import { kang_url } from '@/utils/baceurl'
import { mapGetters } from 'vuex'
export default {
  filters: {
    price(price) {
      price = price / 100
      return price.toFixed(2)
    }
  },
  components: {
    dishbarchart,
    dishlinechart,
    dishbarchart2,
    daytime
  },
  props: {
    tapname: {
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
      date_type: null, // type
      allCanteenId: '', // 所有食堂ID
      dinnerPlateInfo: {}, // 初始化数据
      TotalDishBaseData: {}, // 餐盘统计 之 餐盘基础统计
      dishLineData: [], // 餐盘统计 之 餐盘销售走势
      dishBarData: [], // 餐盘统计 之 餐盘销售额占比
      dishBarData2: [], // 餐盘统计 之 餐盘销售量占比
      dishTableData: [], // 餐盘统计 之 餐盘销售情况-分页
      saleActiveName: 'first',
      saleradio1: '销售额',
      chartShow: false,
      saleradio2: '销售额',
      cantreenChartShow: false,
      pageData: { // 分页
        page: 1,
        page_size: 10,
        total: 10
      },
      searchValue: '', // 搜索值
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
      'allCanteenInfo',
      'type'
    ])
  },
  watch: {

    // 监听食堂ID
    canteenid(newV, oldV) {
      this.$set(this.dinnerPlateInfo, 'canteen_id', newV)
      if (this.dinnerPlateInfo.date_start) {
        this.getTotalDishBase()
      }
    },

    // 监听设备ID
    clientid(newV, oldV) {
      this.$set(this.dinnerPlateInfo, 'client_id', newV)
      if (this.dinnerPlateInfo.date_start) {
        this.getTotalDishBase()
      }
    },

    // 监听 tabname 餐盘统计
    tapname(newV, oldV) {
      this.chartShow = true
      var todaytime = this.getcurrentData() // 当前起止时间

      this.dinnerPlateInfo = Object.assign({}, this.dinnerPlateInfo, {
        canteen_id: this.canteenid,
        client_id: this.clientid,
        date_start: todaytime,
        date_end: todaytime
      })
      this.date_type = 0

      this.getTotalDishBase()
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
    sendDaytimedish(currentDay) {
      this.$set(this.dinnerPlateInfo, 'canteen_id', this.canteenid)
      this.$set(this.dinnerPlateInfo, 'client_id', this.clientid)
      this.$set(this.dinnerPlateInfo, 'date_start', currentDay.daytime_start_end[0])
      this.$set(this.dinnerPlateInfo, 'date_end', currentDay.daytime_start_end[1])
      this.date_type = currentDay.type

      this.getTotalDishBase()
    },

    /* 餐盘统计 */
    // 餐盘统计 之 餐盘基础统计
    getTotalDishBase() {

      this.downExcelurl = kang_url + '/excel/dish/SaleTrend' + '?' + 'canteen_id=' + this.dinnerPlateInfo.canteen_id + '&' + 'client_id=' + this.dinnerPlateInfo.client_id + '&' + 'date_start=' + this.dinnerPlateInfo.date_start + '&' + 'date_end=' + this.dinnerPlateInfo.date_end + '&' + 'date_type=' + this.date_type

      this.downExcelurl2 = kang_url + '/excel/dish/SaleRate' + '?' + 'canteen_id=' + this.dinnerPlateInfo.canteen_id + '&' + 'client_id=' + this.dinnerPlateInfo.client_id + '&' + 'date_start=' + this.dinnerPlateInfo.date_start + '&' + 'date_end=' + this.dinnerPlateInfo.date_end + '&' + 'pct_type=1'

      this.downExcelurl3 = kang_url + '/excel/dish/SaleRate' + '?' + 'canteen_id=' + this.dinnerPlateInfo.canteen_id + '&' + 'client_id=' + this.dinnerPlateInfo.client_id + '&' + 'date_start=' + this.dinnerPlateInfo.date_start + '&' + 'date_end=' + this.dinnerPlateInfo.date_end + '&' + 'pct_type=2'

      this.$nextTick(function() {
        totalDishBase(this.dinnerPlateInfo).then(response => {
          this.TotalDishBaseData = response.data.data
          this.getTotalDishTrend()
        }).catch((error) => {
          console.log(error)
        })
      })
    },

    // 餐盘统计 之 餐盘销售走势
    getTotalDishTrend() {

      var obj = {}
      obj.canteen_id = this.canteenid
      obj.client_id = this.dinnerPlateInfo.client_id
      obj.date_start = this.dinnerPlateInfo.date_start
      obj.date_end = this.dinnerPlateInfo.date_end
      obj.date_type = this.date_type
      this.$nextTick(function() {
        totalDishTrend(obj).then(response => {
          this.dishLineData = response.data.data
          this.getTotalDishPct()
        }).catch((error) => {
          console.log(error)
        })
      })
    },

    // 餐盘统计 之 餐盘销售额占比
    async getTotalDishPct() {

      var obj = {}
      obj.canteen_id = this.canteenid
      obj.client_id = this.dinnerPlateInfo.client_id
      obj.date_start = this.dinnerPlateInfo.date_start
      obj.date_end = this.dinnerPlateInfo.date_end
      obj.pct_type = 1
      await totalDishPct(obj).then(response => {
        if (response.data.data == null) {
          this.dishBarData = []
        } else {
          this.dishBarData = response.data.data
        }
        this.getTotalDishPct2()
      }).catch((error) => {
        console.log(error)
      })
    },

    // 餐盘统计 之 餐盘销售数量占比
    async getTotalDishPct2() {

      var obj = {}
      obj.canteen_id = this.canteenid
      obj.client_id = this.dinnerPlateInfo.client_id
      obj.date_start = this.dinnerPlateInfo.date_start
      obj.date_end = this.dinnerPlateInfo.date_end
      obj.pct_type = 2
      await totalDishPct(obj).then(response => {
        if (response.data.data == null) {
          this.dishBarData2 = []
        } else {
          this.dishBarData2 = response.data.data
        }
        this.getTotalDishSell()
      }).catch((error) => {
        console.log(error)
      })
    },

    // 餐盘统计 之 餐盘销售情况-分页
    getTotalDishSell() {

      if (this.getTableList === 'all') {
        this.searchValue = ''
      }
      var obj = {}
      obj.canteen_id = this.canteenid
      obj.client_id = this.dinnerPlateInfo.client_id
      obj.date_start = this.dinnerPlateInfo.date_start
      obj.date_end = this.dinnerPlateInfo.date_end
      if (this.searchValue) {
        obj.query_dish = this.searchValue
        this.downExcelurl4 = kang_url + '/excel/dish/SaleCondition' + '?' + 'canteen_id=' + obj.canteen_id + '&' + 'client_id=' + obj.client_id + '&' + 'date_start=' + this.dinnerPlateInfo.date_start + '&' + 'date_end=' + this.dinnerPlateInfo.date_end + '&' + 'query_dish=' + obj.query_dish
      }
      obj.page = this.pageData.page
      obj.page_size = this.pageData.page_size
      this.downExcelurl4 = kang_url + '/excel/dish/SaleCondition' + '?' + 'canteen_id=' + obj.canteen_id + '&' + 'client_id=' + obj.client_id + '&' + 'date_start=' + this.dinnerPlateInfo.date_start + '&' + 'date_end=' + this.dinnerPlateInfo.date_end
      this.$nextTick(function() {
        totalDishSell(obj).then(response => {
          this.dishTableData = response.data.data
          this.pageData.page = this.dishTableData.current_page
          if (this.dishTableData.per_page) {
            this.pageData.page_size = Number(this.dishTableData.per_page)
          }
          this.pageData.total = this.dishTableData.total
        }).catch((error) => {
          console.log(error)
        })
      })
    },

    // tap 切换（销售趋势，销售占比）
    salehandleClick(tab) {
      if (tab.name == 'second') {
        this.cantreenChartShow = true
      }
    },

    // 销售占比 切换（销售量，销售额）
    changebarchart(value) {
      if (value == '销售量') {
        this.cantreenChartShow = false
      } else {
        this.cantreenChartShow = true
      }
    },

    // 表格搜索
    dinnerPlateSearch() {
      this.pageData.page = 1
      if (this.searchValue) {
        this.getTableList = 'search'
      } else {
        this.getTableList = 'all'
      }
      this.getTotalDishSell()
    },

    // 查看(弹框)统计图表
    LookSaleChart(item) {
      // this.currentData = item
      this.centerDialogVisible = true
    },

    // 餐盘弹框统计图表 tap切换()
    dialogTap(tab) {
      if (tab.name == 'second') {
        this.dialogChartShow = true
      }
    },

    // 监控搜索框
    chagedishnull(value) {
      if (!value) {
        this.getTableList = 'all'
        this.getTotalDishSell()
      }
    },
    // 分页
    handleSizeChange(val) {
      this.pageData.page_size = val
      this.getTotalDishSell()
    },
    handleCurrentChange(val) {
      this.pageData.page = val
      this.getTotalDishSell()
    }

  }
}
</script>

<style lang="scss" scoped>
.dinnerPlate {
  .bg-white {
    // background-color: white;
  }
  .content-box {
    margin: 20px;
    .box-card {
      overflow: visible;
      margin-top: 20px;
      box-shadow: rgba(60, 64, 67, 0.3) 0 1px 2px 0,
        rgba(60, 64, 67, 0.15) 0 1px 3px 1px;
      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .el-card__body {
        padding: 0;
      }
    }
    .content-card-box {
      display: flex;
      .bar {
        flex: 2;
        margin-right: 20px;
      }
      .pie {
        flex: 1;
      }
    }
  }
  .saleNumber {
    height: 144px;
    background: #fff;
    display: flex;
    margin-top: 20px;
    border: 1px solid #ddd;
    > div {
      flex: 1;
      display: flex;
      align-items: center;
    }
    .minbox {
      height: 80%;
      width: 80%;
      display: flex;
      flex-direction: column;
      padding: 30px;
      border-left: 1px solid #ddd;
      // background-color: #f0f2f5;
      &:hover {
        box-shadow: 2px 1px 8px 2px rgba(0, 0, 0, 0.09),
          0px -1px 0px 0px rgba(0, 0, 0, 0.02);
      }
    }
    .borders {
      border-left: none;
    }
  }
  .postiongBox {
    margin-bottom: 10px;
    font-size: 12px;
    color: #888888;
  }
  .postionNumber {
    font-size: 30px;
    color: rgba(0, 0, 0, 0.85);
  }
  .nav {
    background-color: #fff;
    box-shadow: rgba(60, 64, 67, 0.3) 0 1px 2px 0,
      rgba(60, 64, 67, 0.15) 0 1px 3px 1px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both;
  }
  .paging {
    padding: 20px;
    background: #fff;
    float: right;
  }
  .searchDI {
    display: flex;
  }
}
</style>
