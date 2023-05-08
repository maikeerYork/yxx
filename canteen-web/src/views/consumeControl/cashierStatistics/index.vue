<template>
  <div class="terminalStatistics">
    <!-- header -->
    <allCanteenSelect :canteentitle="headerTitle" :client-type="client" :client-show="true" />

    <!-- nav -->
    <div class="nav">
      <!-- 时间模块 -->
      <daytime @sendDaytime="sendDaytime" />

      <!-- 基础信息 -->
      <div class="saleNumber">

        <div>
          <div class="minbox">
            <div class="postiongBox">销售总额（元）</div>
            <div v-if="totalData.sell_money && totalData.sell_money !==0" class="postionNumber">
              {{ totalData.sell_money | price }}</div>
            <div v-else class="postionNumber">{{ totalData.sell_money }}</div>
          </div>
        </div>

        <div>
          <div class="minbox">
            <div class="postiongBox">利润总额（元）</div>
            <div v-if="totalData.profit && totalData.profit !== 0" class="postionNumber">{{ totalData.profit| price }}
            </div>
            <div v-else class="postionNumber">{{ totalData.profit }}</div>
            <div v-if="totalData.not_cost_num > 0" class="not_cost_num" :title="profit_cost_message">
              <router-link :to="{path:'/menuManage/table'}" style="color: blue">{{ totalData.not_cost_num }}样</router-link>
              菜品未计入
            </div>
          </div>
        </div>

        <div>
          <div class="minbox">
            <div class="postiongBox">用餐人次</div>
            <div class="postionNumber">{{ totalData.sell_count }}</div>
          </div>
        </div>
        <div>
          <div class="minbox">
            <div class="postiongBox">菜品种类</div>
            <div class="postionNumber">{{ totalData.foods_kinds }}</div>
          </div>
        </div>
      </div>

      <!-- 销售趋势 -->
      <el-card class="box-card" shadow="always">
        <div slot="header" class="card-header">
          <span>
            销售趋势
          </span>
          <a :href="downExcelurl">
            <el-button size="medium">
              <i class="el-icon-download" />
              <span>
                下载 xls
              </span>
            </el-button>
          </a>
        </div>
        <DinnerLineChart :need-data="miniSaleTrend_echart" />
      </el-card>
      <div class="content-card-box">
        <!-- 销售量统计 -->
        <div class="bar">
          <el-card class="box-card" shadow="always">
            <div slot="header" class="card-header">
              <el-radio-group v-model="saleradio2" @change="changebarchart">
                <el-radio-button label="菜品销量" />
                <el-radio-button label="餐别销量" />
              </el-radio-group>
              <a :href="saleradio2 == '菜品销量'?downExcelurl2:downExcelurl3">
                <el-button size="medium" style="float: right">
                  <i class="el-icon-download" />
                  <span>
                    下载 xls
                  </span>
                </el-button>
              </a>
            </div>
            <DinnerBarChart v-if="cantreenChartShow" :needdish-bar-data="miniSaleTotal_echart" />
            <DinnerBarChart2 v-else :needdish-bar-data="miniSaleTotal_echart2" />
          </el-card>
        </div>
        <!-- 支付方式占比 -->
        <div class="pie">
          <el-card class="box-card" shadow="always" style="height:98%">
            <div slot="header" class="card-header">
              <span>
                支付方式占比
              </span>
              <a :href="downExcelurl4">
                <el-button size="medium">
                  <i class="el-icon-download" />
                  <span>
                    下载 xls
                  </span>
                </el-button>
              </a>
            </div>
            <dinnerPiechart :need-pie-data="miniPayTypeRate_echart" />
          </el-card>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { kang_url } from '@/utils/baceurl'
import DinnerLineChart from '@/components/DinnerLineChart'
import DinnerBarChart from '@/components/DinnerBarChart'
import DinnerBarChart2 from '@/components/DinnerBarChart2'
import dinnerPiechart from '@/components/dinnerPiechart'
import daytime from '@/components/daytime'
import allCanteenSelect from '@/components/allCanteenSelect'
import { getMachineList, getMachineAndBase, getMachineAndSaleTrend, getAndSaleTotal, getAndPayTypeRate } from '@/api/dataStatistics'
export default {
  filters: {
    price(price) {
      price = price / 100
      return price.toFixed(2)
    }
  },
  components: {
    allCanteenSelect,
    daytime,
    DinnerLineChart,
    dinnerPiechart,
    DinnerBarChart,
    DinnerBarChart2
  },
  props: {

  },
  data() {
    return {
      profit_cost_message: '请前往菜品管理，输入菜品成本',
      /* header */
      headerTitle: '',
      canteenId: null,
      clientId: null,
      client: 'CLIENT_ANDROID',

      /* nav */
      initsendInfo: {}, // 初始化需要发送的数据

      totalData: {}, // 基础信息
      miniSaleTrend_echart: [], // 销售趋势
      miniSaleTotal_echart: [], // 菜品销售量统计
      miniSaleTotal_echart2: [], // 餐别销售量统计
      miniPayTypeRate_echart: [], // 支付方式占比

      downExcelurl: '', // 综合数据 之 基础统计 Excel 表下载
      downExcelurl2: '', // 综合数据 之 菜品 Excel 表下载
      downExcelurl3: '', // 综合数据 之 餐别 Excel 表下载
      downExcelurl4: '', // 综合数据 之 支付类型占比 Excel 表下载

      saleradio2: '菜品销量',
      cantreenChartShow: true // 控制菜品销量和销售量的显示隐藏
    }
  },
  computed: {
    ...mapGetters([
      'newCanteen_check',
      'newClient_id'
    ])
  },
  watch: {
    newCanteen_check() {
      this.canteenId = this.newCanteen_check
      this.totlaBaseInfo()
    },
    newClient_id() {
      this.clientId = this.newClient_id
      this.totlaBaseInfo()
    }
  },
  created() {

  },
  mounted() {
    /* header */
    this.canteenId = this.newCanteen_check
    this.clientId = this.newClient_id
    /* day */
    var todaytime = this.getcurrentData() // 当前起止时间
    this.$set(this.initsendInfo, 'date_start', todaytime)
    this.$set(this.initsendInfo, 'date_end', todaytime)
    this.$set(this.initsendInfo, 'date_type', 0)

    this.totlaBaseInfo()
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
    sendDaytime(currentDay) {
      this.$set(this.initsendInfo, 'date_start', currentDay.daytime_start_end[0])
      this.$set(this.initsendInfo, 'date_end', currentDay.daytime_start_end[1])
      this.$set(this.initsendInfo, 'date_type', currentDay.type)

      this.totlaBaseInfo()
    },

    // 基础统计
    totlaBaseInfo() {
      /* 拼接excel下载URL */
      this.downExcelurl = kang_url + '/excel/orderAndClient/saleTrend' + '?' + 'canteen_id=' + this.canteenId + '&' + 'client_id=' + this.clientId + '&' + 'date_start=' + this.initsendInfo.date_start + '&' + 'date_end=' + this.initsendInfo.date_end + '&' + 'date_type=' + this.initsendInfo.date_type

      this.downExcelurl2 = kang_url + '/excel/orderAndClient/saleCount' + '?' + 'canteen_id=' + this.canteenId +
        '&' + 'client_id=' + this.clientId + '&' + 'date_start=' + this.initsendInfo.date_start + '&' + 'date_end=' + this.initsendInfo.date_end + '&' + 'sale_type=1'

      this.downExcelurl3 = kang_url + '/excel/orderAndClient/saleCount' + '?' + 'canteen_id=' + this.canteenId +
        '&' + 'client_id=' + this.clientId + '&' + 'date_start=' + this.initsendInfo.date_start + '&' + 'date_end=' + this.initsendInfo.date_end + '&' + 'sale_type=2'

      this.downExcelurl4 = kang_url + '/excel/orderAndClient/payTypeRate' + '?' + 'canteen_id=' + this.canteenId + '&' + 'client_id=' + this.clientId + '&' + 'date_start=' + this.initsendInfo.date_start + '&' + 'date_end=' + this.initsendInfo.date_end

      getMachineAndBase({
        canteen_id: this.canteenId,
        date_start: this.initsendInfo.date_start,
        date_end: this.initsendInfo.date_end,
        client_id: this.clientId
      }).then(response => {
        this.totalData = response.data.data
        this.getMiniSaleTrend()
      }).catch((error) => {
        console.log(error)
      })
    },

    // 销售趋势
    getMiniSaleTrend() {
      getMachineAndSaleTrend({
        canteen_id: this.canteenId,
        date_start: this.initsendInfo.date_start,
        date_end: this.initsendInfo.date_end,
        date_type: this.initsendInfo.date_type,
        client_id: this.clientId
      }).then(response => {
        this.miniSaleTrend_echart = response.data.data
        this.getMiniSaleTotal(1)
        this.getMiniSaleTotal(2)
        this.getMiniPayTypeRate()
      }).catch((error) => {
        console.log(error)
      })
    },

    // 销售量统计
    getMiniSaleTotal(saleType) {
      getAndSaleTotal({
        canteen_id: this.canteenId,
        date_start: this.initsendInfo.date_start,
        date_end: this.initsendInfo.date_end,
        sale_type: saleType,
        client_id: this.clientId
      }).then(response => {
        if (saleType === 1) {
          if (response.data.data) {
            this.miniSaleTotal_echart = response.data.data
          } else {
            this.miniSaleTotal_echart = []
          }
        } else {
          if (response.data.data) {
            this.miniSaleTotal_echart2 = response.data.data
          } else {
            this.miniSaleTotal_echart2 = []
          }
        }
      }).catch((error) => {
        console.log(error)
      })
    },

    // 支付方式占比
    getMiniPayTypeRate() {
      getAndPayTypeRate({
        canteen_id: this.canteenId,
        date_start: this.initsendInfo.date_start,
        date_end: this.initsendInfo.date_end,
        client_id: this.clientId
      }).then(response => {
        if (response.data.data) {
          this.miniPayTypeRate_echart = response.data.data
        } else {
          this.miniPayTypeRate_echart = []
        }
      }).catch((error) => {
        console.log(error)
      })
    },

    // 销售占比 切换（餐别销量，菜品销量）
    changebarchart(value) {
      if (value == '菜品销量') {
        this.cantreenChartShow = true
      } else {
        this.cantreenChartShow = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.terminalStatistics {
  /deep/ .el-table {
    width: 99.9% !important;
  }
  .header {
    background-color: #fff;
    padding: 20px 40px;
    margin-bottom: 20px;
    .titleName {
      font-size: 16px;
    }
    .title {
      font-size: 20px;
      margin-right: 40px;
    }
  }
  .nav {
    padding: 20px 20px 20px;
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
    /deep/ .el-card__body {
      padding: 20px;
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

  .not_cost_num {
    text-align: right;
    //feng 样式调整
    font-size: 14px;
    color: #888888;
  }
}
</style>
