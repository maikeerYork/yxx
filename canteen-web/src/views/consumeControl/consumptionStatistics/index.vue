<template>
  <div class="OnlineOrderingStatistics">
    <!-- header -->
    <allCanteenSelect v-if="isShowAllCanteen" :canteentitle="headerTitle" :client-show="false" />
    <!-- header -->
    <canteen-header v-else :canteentitle="headerTitle"/>
    <el-row class="">
      <el-col>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <!-- nav -->
            <div class="nav padding-20">
              <!-- 时间模块 -->
              <datetime @sendDaytime="sendDaytime"/>
              <div class="content-card-box">
                <!-- 销售量统计 -->
                <div class="bar">
                  <el-card class="box-card" shadow="always">
                    <div slot="header" class="card-header">
                  <span> 消费统计趋势图 </span>
                      <a :href="downExcelurl2">
                        <el-button size="medium">
                          <i class="el-icon-download"/>
                          <span> 下载 xls </span>
                        </el-button>
                      </a>
                    </div>
                    <DinnerLineChart :need-data="miniSaleTrend_echart" />
                  </el-card>
                </div>
                <!-- 支付方式占比 -->
                <div class="pie">
                  <el-card class="box-card" shadow="always" >
                    <div slot="header" class="card-header">
                      <span> 单位消费占比 </span>
                      <a :href="downExcelurl4">
                        <el-button size="medium">
                          <i class="el-icon-download" />
                          <span> 下载 xls </span>
                        </el-button>
                      </a>
                    </div>
                    <dinnerPiechart :need-pie-data="miniPayTypeRate_echart" />
                  </el-card>
                </div>
              </div>

              <div class="content-card-box">
                <!-- 销售量统计 -->
                <div class="pie">
                  <el-card class="box-card" shadow="always">
                    <div slot="header" class="card-header">
                  <span> 个人消费统计趋势图 </span>
                      <a :href="downExcelurl">
                        <el-button size="medium">
                          <i class="el-icon-download" />
                          <span> 下载 xls </span>
                        </el-button>
                      </a>
                    </div>
                    <PersonalConsumptionStatistics :need-data="miniSaleTrend_echart_1" />
                  </el-card>
                </div>
              </div>
            </div>
        </el-tabs>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { kang_url } from '@/utils/baceurl'
import DinnerLineChart from '@/components/DinnerLineChart3/index'
import PersonalConsumptionStatistics from '@/components/DinnerLineChart4/index'
import dinnerPiechart from '@/components/dinnerPiechart1/index'
import datetime from '@/components/date/index'

import allCanteenSelect from '@/components/allCanteenSelect/index'
import canteenHeader from '@/components/canteenHeader/index'
import { totalMiniBase, miniPayTypeRate, miniSaleTotal } from '@/api/OnlineOrderingStatistics'

import { miniSaleTrend, consumptionTrend, consumptionProportion} from '@/api/consumption'
export default {
  filters: {
    price(price) {
      price = price / 100
      return price.toFixed(2)
    }
  },
  components: {
    allCanteenSelect,
    canteenHeader,
    datetime,
    DinnerLineChart,
    dinnerPiechart,
    PersonalConsumptionStatistics
  },
  props: {

  },
  data() {
    return {
      /* tap栏 */
      activeName: 'first',
      /* header */
      headerTitle: '',
      profit_cost_message: '请前往菜品管理，输入菜品成本',
      /* nav */
      initsendInfo: {}, // 初始化需要发送的数据

      totalData: {}, // 基础信息
      miniSaleTrend_echart: [], // 销售趋势
      miniSaleTrend_echart_1: [],
      miniSaleTotal_echart: [], // 菜品销售量统计
      miniSaleTotal_echart2: [], // 餐别销售量统计
      miniPayTypeRate_echart: [], // 支付方式占比

      downExcelurl: '', // 综合数据 之 基础统计 Excel 表下载
      downExcelurl2: '', // 综合数据 之 菜品 Excel 表下载
      downExcelurl3: '', // 综合数据 之 餐别 Excel 表下载
      downExcelurl4: '', // 综合数据 之 支付类型占比 Excel 表下载

      saleradio2: '菜品销量',
      cantreenChartShow: true, // 控制菜品销量和销售量的显示隐藏
      tapname: '',
      isShowAllCanteen: true
    }
  },
  computed: {
    ...mapGetters([
      'newCanteen_check'
    ])
  },
  watch: {
    newCanteen_check() {
      this.totlaBaseInfo()
    }
  },
  created() {
    /* day */
    //debugger;
    var todaytime = this.getcurrentData() // 当前起止时间
    this.$set(this.initsendInfo, 'date_start', this.getsubtractionDate(todaytime,7))
    this.$set(this.initsendInfo, 'date_end', todaytime)
    this.$set(this.initsendInfo, 'date_type', 1)
  },
  mounted() {
    this.totlaBaseInfo()
  },
  methods: {
    // 天数减法
    getsubtractionDate(currentTiem, number) {
      var Ndate = new Date(currentTiem)
      Ndate = Ndate.setDate(Ndate.getDate() - number)
      Ndate = this.getcurrentData(Ndate)
      return Ndate
    },

    // 切换tabcc
    handleClick(tab) {
      if (tab.name === 'first') {
        this.tapname = tab.name
        this.isShowAllCanteen = true
      } else if (tab.name === 'second') {
        this.tapname = tab.name
        this.isShowAllCanteen = false
      }
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
      this.$set(this.initsendInfo, 'date_type', currentDay.type)

      this.totlaBaseInfo()
    },

    // 基础统计
    totlaBaseInfo() {
      /* 拼接excel下载URL */
      this.downExcelurl = kang_url + '/excel/order/user/pay/depart-child-total' + '?' + 'canteen_id=' + this.newCanteen_check + '&' + 'date_start=' + this.initsendInfo.date_start + '&' + 'date_end=' + this.initsendInfo.date_end

      this.downExcelurl2 = kang_url + '/excel/order/user/pay/date-total' + '?' + 'canteen_id=' + this.newCanteen_check +
        '&' + 'date_start=' + this.initsendInfo.date_start + '&' + 'date_end=' + this.initsendInfo.date_end

      this.downExcelurl3 = kang_url + '/excel/orderMini/saleCount' + '?' + 'canteen_id=' + this.newCanteen_check +
        '&' + 'date_start=' + this.initsendInfo.date_start + '&' + 'date_end=' + this.initsendInfo.date_end + '&' + 'sale_type=2'

      this.downExcelurl4 = kang_url + '/excel/order/user/pay/depart-total' + '?' + 'canteen_id=' + this.newCanteen_check + '&' + 'date_start=' + this.initsendInfo.date_start + '&' + 'date_end=' + this.initsendInfo.date_end

      totalMiniBase({
        canteen_id: this.newCanteen_check,
        date_start: this.initsendInfo.date_start,
        date_end: this.initsendInfo.date_end
      }).then(response => {
        this.totalData = response.data.data

        this.getMiniSaleTrend()
      }).catch((error) => {
        console.log(error)
      })
    },

    // 销售趋势
    getMiniSaleTrend() {
      consumptionTrend({
        canteen_id: this.newCanteen_check,
        date_start: this.initsendInfo.date_start,
        date_end: this.initsendInfo.date_end
      }).then(response => {
        if(response.data.data != ''){
          this.miniSaleTrend_echart = response.data.data
        }else {
          this.miniSaleTrend_echart = [
            {date: "2022-12-18", total_price: "13443",real_price:'4545',refund_price:'456'},
            {date: "2022-12-19", total_price: "3433",real_price:'4584',refund_price:'657'},
            {date: "2022-12-20", total_price: "3223",real_price:'4556',refund_price:'546'},
            {date: "2022-12-21", total_price: "543",real_price:'3454',refund_price:'456'},
            {date: "2022-12-22", total_price: "435",real_price:'5945',refund_price:'56'},
            {date: "2022-12-23", total_price: "234",real_price:'673',refund_price:'435'},
            {date: "2022-12-24", total_price: "324",real_price:'3345',refund_price:'234'},
            {date: "2022-12-25", total_price: "1324",real_price:'3456',refund_price:'4545'},

          ]
        }
      })
      miniSaleTrend({
        canteen_id: this.newCanteen_check,
        date_start: this.initsendInfo.date_start,
        date_end: this.initsendInfo.date_end
      }).then(response => {
        response.data.data = '';
        if(response.data.data != ''){
          this.miniSaleTrend_echart_1 = response.data.data;
        }else {
          this.miniSaleTrend_echart_1 = [
            {
              "name": "永兴巷机关食堂",
              "children": [
                {
                  "name": "省文产（交流）中心",
                  "children": [
                    {
                      "name": "王思然 消费：25元",
                      "children": [
                        {"name": "红烧肉", "value": 11},
                        {"name": "青菜", "value": 4},
                        {"name": "小炒肉", "value": 10}
                      ]
                    }
                  ]
                },
                {
                  "name": "省委政法委",
                  "children": [
                    {"name": "李开红 消费：9", "value": 9},
                    {
                      "name": "李秦峰 消费：36",
                      "children": [
                        {"name": "红烧肉", "value": 11},
                        {"name": "蒜苔炒肉", "value": 15},
                        {"name": "小炒肉", "value": 10}
                      ]
                    },
                    {"name": "郭粲 消费：39", "value": 39},
                    {"name": "曾巧 消费：69.50", "value": 69.50}
                  ]
                },
                {
                  "name": "省直机关工委",
                  "children": [
                    {
                      "name": "李秦峰 消费：31",
                      "children": [
                        {"name": "顿猪脚", "value": 31}
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
        this.getMiniPayTypeRate()
      }).catch((error) => {
        console.log(error)
      })
    },
    // 支付方式占比
    getMiniPayTypeRate() {
      consumptionProportion({
        canteen_id: this.newCanteen_check,
        date_start: this.initsendInfo.date_start,
        date_end: this.initsendInfo.date_end
      }).then(response => {
        debugger;
        if (response.data.data) {
          // 模拟数据
          this.miniPayTypeRate_echart = response.data.data
        } else {
          this.miniPayTypeRate_echart = [
            {
              name:'省文产（交流）中心',
              money:7500
            },
            {
              name:'省委政法委',
              money:3000
            },{
              name:'省直机关工委',
              money:5000
            }
          ]
        }
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.OnlineOrderingStatistics {
  .header {
    margin-bottom: 0;
  }
  .nav {
    padding: 20px;
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
  /*  */
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
    /deep/.el-card__body {
      padding: 20px;
    }
  }
  .content-card-box {
    display: flex;
    .bar {
      flex: 2;
      margin-right: 10px;
    }
    .pie {
      flex: 1;
    }
  }

  .not_cost_num {
    text-align: right;
    //feng 样式调整
    font-size: 14px;
    color: #888888;
  }

  /deep/.el-tabs__header {
    background: #fff;
    padding: 0 20px;
    margin-bottom: 0;
  }
  /deep/.el-tabs__nav-wrap::after {
    //去除el-tab-pane默认下边框
    height: 0;
  }
}
</style>
