<template>
  <div class="comprehensive">
    <div class="content-box">

      <!-- 时间模块 -->
      <daytime @sendDaytime="sendDaytime" />
      <!--  @sendType="sendType"  -->

      <!-- 销售数据 -->
      <div class="saleNumber">
        <div>
          <div class="minbox borders">
            <div class="postiongBox">菜品总数（种）</div>
            <div class="postionNumber">{{ totalData.vision_foods_count }}</div>
          </div>
        </div>
        <div>
          <div class="minbox">
            <div class="postiongBox"> 菜品种类（种）</div>
            <div class="postionNumber">{{ totalData.vision_menu_foods_count }}</div>
          </div>
        </div>
        <div>
          <div class="minbox">
            <div class="postiongBox"> 菜品总销量（份）</div>
            <div class="postionNumber">{{ totalData.sell_count }}</div>
          </div>
        </div>
        <div>
          <div class="minbox">
            <div class="postiongBox">销售总额（元）</div>

            <div v-if="totalData.money" class="postionNumber">{{ totalData.money | price }}</div>
            <div v-else class="postionNumber">{{ totalData.money }}</div>
          </div>
        </div>
      </div>

      <!-- 数据图表 -->
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
        <line-chart :need-data="needlineData" />
      </el-card>

      <div class="content-card-box">
        <div class="bar">
          <el-card class="box-card" shadow="always" style="height:98%">
            <div slot="header" class="card-header">
              <span>
                菜品销量
              </span>
              <a :href="downExcelurl2">
                <el-button size="medium">
                  <i class="el-icon-download" />
                  <span>
                    下载 xls
                  </span>
                </el-button>
              </a>

            </div>
            <bar-chart :need-bar-data="barChartData" />
          </el-card>
        </div>
        <div class="pie">
          <el-card class="box-card" shadow="always" style="height:98%">
            <div slot="header" class="card-header">
              <span>
                各种支付方式支付占比
              </span>
              <a :href="downExcelurl3">
                <el-button size="medium">
                  <i class="el-icon-download" />
                  <span>
                    下载 xls
                  </span>
                </el-button>
              </a>
            </div>
            <pie-chart :need-pie-data="pieChartData" />
            <div>
              <el-table
                :data="pieChartData"
                size="small"
                :header-cell-style="{color:'#000', 'text-align':'center'}"
                height="150px"
              >
                <el-table-column prop="name" label="类型" />
                <el-table-column prop="money" label="金额(元)">
                  <template slot-scope="scope">
                    ￥{{ scope.row.money | price }}
                  </template>
                </el-table-column>
                <el-table-column prop="money_pct" label="占比(%)" />
              </el-table>
            </div>
          </el-card>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import barChart from '@/components/barchart'
import lineChart from '@/components/linechart'
import pieChart from '@/components/piechart'
import daytime from '@/components/daytime'
import { getCuisineTotalBase, getCuisineTotalBaseTrend, totalCuisineDishPct, getCuisinePayType } from '@/api/businessStatistics'
import { SaleTrend, SaleRate, PayTypeRate } from '@/api/excel'
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
    barChart,
    lineChart,
    pieChart,
    daytime
  },
  props: {
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

      allCanteenId: '', // 所有食堂ID
      initsendInfo: {}, // 综合数据 之 初始化数据
      totalData: {}, // 综合数据 之 基础统计
      lineData: {}, // 综合数据 之 基础统计走势
      needlineData: [], // 基础统计走势 linechart 需要的数据
      barChartData: [], // 综合统计 之 基础统计商品金额占比
      pieChartData: [], // 基础统计支付类型占比

      downExcelurl: '', // 综合数据 之 基础统计 Excel 表下载
      downExcelurl2: '', // 综合数据 之 金额占比 Excel 表下载
      downExcelurl3: '' // 综合数据 之 支付类型占比 Excel 表下载
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
      this.$set(this.initsendInfo, 'canteen_id', newV)
      this.totlaBaseInfo()
    },
    // 监听设备ID
    clientid(newV, oldV) {
      this.$set(this.initsendInfo, 'client_id', newV)
      this.totlaBaseInfo()
    }
  },
  created() {
    this.$set(this.initsendInfo, 'canteen_id', this.canteenid)
    this.$set(this.initsendInfo, 'client_id', this.clientid)

    var todaytime = this.getcurrentData() // 当前起止时间
    this.$set(this.initsendInfo, 'date_start', todaytime)
    this.$set(this.initsendInfo, 'date_end', todaytime)

    this.$set(this.initsendInfo, 'date_type', 0)
  },
  mounted() {
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
      this.initsendInfo.date_type = currentDay.type
      // this.TotalBaseTrend()
      // this.TotalBasePct()
      // this.PayType()
      this.totlaBaseInfo()

      this.downExcelurl = kang_url + '/excel/visionFoodsMultiple/SaleTrend' + '?' + 'canteen_id=' + this.initsendInfo.canteen_id + '&' + 'client_id=' + this.initsendInfo.client_id + '&' + 'date_start=' + this.initsendInfo.date_start + '&' + 'date_end=' + this.initsendInfo.date_end + '&' + 'date_type=' + this.initsendInfo.date_type

      this.downExcelurl2 = kang_url + '/excel/visionFoodsMultiple/SaleRate' + '?' + 'canteen_id=' + this.initsendInfo.canteen_id + '&' + 'client_id=' + this.initsendInfo.client_id + '&' + 'date_start=' + this.initsendInfo.date_start + '&' + 'date_end=' + this.initsendInfo.date_end + '&' + 'pct_type=' + this.initsendInfo.date_type

      this.downExcelurl3 = kang_url + '/excel/visionFoodsMultiple/PayTypeRate' + '?' + 'canteen_id=' + this.initsendInfo.canteen_id + '&' + 'client_id=' + this.initsendInfo.client_id + '&' + 'date_start=' + this.initsendInfo.date_start + '&' + 'date_end=' + this.initsendInfo.date_end
    },

    /* 综合统计 */
    // 基础统计
    totlaBaseInfo() {
      this.downExcelurl = kang_url + '/excel/visionFoodsMultiple/SaleTrend' + '?' + 'canteen_id=' + this.initsendInfo.canteen_id + '&' + 'client_id=' + this.initsendInfo.client_id + '&' + 'date_start=' + this.initsendInfo.date_start + '&' + 'date_end=' + this.initsendInfo.date_end + '&' + 'date_type=' + this.initsendInfo.date_type

      this.downExcelurl2 = kang_url + '/excel/visionFoodsMultiple/SaleRate' + '?' + 'canteen_id=' + this.initsendInfo.canteen_id + '&' + 'client_id=' + this.initsendInfo.client_id + '&' + 'date_start=' + this.initsendInfo.date_start + '&' + 'date_end=' + this.initsendInfo.date_end + '&' + 'pct_type=' + this.initsendInfo.date_type

      this.downExcelurl3 = kang_url + '/excel/visionFoodsMultiple/PayTypeRate' + '?' + 'canteen_id=' + this.initsendInfo.canteen_id + '&' + 'client_id=' + this.initsendInfo.client_id + '&' + 'date_start=' + this.initsendInfo.date_start + '&' + 'date_end=' + this.initsendInfo.date_end

      this.$nextTick(function() {
        var obj = JSON.parse(JSON.stringify(this.initsendInfo))
        delete obj.date_type
        getCuisineTotalBase(obj).then(response => {
          this.totalData = response.data.data
          this.TotalBaseTrend()
        }).catch((error) => {
          console.log(error)
        })
      })
    },
    exceltotlaBaseInfo() {
      var obj = {}
      obj.canteen_id = this.initsendInfo.canteen_id
      obj.client_id = this.initsendInfo.client_id
      obj.date_start = this.initsendInfo.date_start
      obj.date_end = this.initsendInfo.date_end
      obj.date_type = this.initsendInfo.date_type
      SaleTrend(obj).then(response => {
        console.log(response.data)
      }).catch((error) => {
        console.log(error)
      })
    },
    // 基础统计走势
    TotalBaseTrend() {
      getCuisineTotalBaseTrend(this.initsendInfo).then(response => {
        this.needlineData = response.data.data
        this.TotalBasePct()
      }).catch((error) => {
        console.log(error)
      })
    },

    excelTotalBaseTrend() {
      if (this.initsendInfo.canteen_id == this.allCanteenId) {
        this.initsendInfo.client_id = 0
      }
      var obj = {}
      obj.canteen_id = this.initsendInfo.canteen_id
      obj.client_id = this.initsendInfo.client_id
      obj.date_start = this.initsendInfo.date_start
      obj.date_end = this.initsendInfo.date_end
      obj.date_type = this.initsendInfo.date_type
      SaleRate(obj).then(response => {
        console.log(response.data)
      }).catch((error) => {
        console.log(error)
      })
    },
    // 基础统计商品金额占比
    TotalBasePct() {
      this.$nextTick(function name() {
        var obj = {}
        obj.canteen_id = this.initsendInfo.canteen_id
        obj.client_id = this.initsendInfo.client_id
        obj.date_start = this.initsendInfo.date_start
        obj.date_end = this.initsendInfo.date_end
        // obj.pct_type = this.initsendInfo.date_type
        totalCuisineDishPct(obj).then(response => {
          if (response.data.data) {
            this.barChartData = response.data.data.data
            this.barChartData.forEach(item=>{
              // item.name = item.food_name
              item.money_pct = item.count
              // delete item.food_name
              delete item.count
              delete item.money
            }) 
            console.log(this.barChartData ,'9089');
            this.PayType()
          } else {
            this.barChartData = []
          }
        }).catch((error) => {
          console.log(error)
        })
      })
    },

    excelTotalBasePct() {
      var obj = {}
      obj.canteen_id = this.initsendInfo.canteen_id
      obj.client_id = this.initsendInfo.client_id
      obj.date_start = this.initsendInfo.date_start
      obj.date_end = this.initsendInfo.date_end
      obj.pct_type = this.initsendInfo.date_type
      PayTypeRate(obj).then(response => {
        console.log(response.data)
      }).catch((error) => {
        console.log(error)
      })
    },
    // 基础统计支付类型占比
    PayType(params) {
      this.$nextTick(function() {
        var obj = JSON.parse(JSON.stringify(this.initsendInfo))
        delete obj.date_type
        getCuisinePayType(obj).then(response => {
          if (response.data.data) {
            this.pieChartData = response.data.data
          }
        }).catch((error) => {
          console.log(error)
        })
      })
    }

  }
}
</script>

<style lang="scss" scoped>
.comprehensive {
  .content-box {
    padding: 20px;
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
        padding-right: 20px;
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
}
</style>
