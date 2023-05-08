<template>
  <div class="businessStatistics">
    <!-- header -->
    <allCanteenSelect :canteentitle="headerTitle" :client-type="client" :client-show="true" />

    <!-- nav -->
    <el-row>
      <el-col>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <!-- first -->
          <el-tab-pane label="综合统计" name="first">
            <comprehensive :canteenid="canteenId" :clientid="clientId" />
          </el-tab-pane>

          <!-- second -->
          <el-tab-pane label="餐盘统计" name="second">
            <dinner-plate :canteenid="canteenId" :clientid="clientId" :tapname="tapname" />
          </el-tab-pane>

          <!-- third -->
          <el-tab-pane label="饮料统计" name="third" >
            <drink-code :canteenid="canteenId" :clientid="clientId" :drinkname="drinkname" />
          </el-tab-pane>

          <!-- fourth -->
          <el-tab-pane label="菜品统计" name="fourth">
            <!-- <div class="developedBox">待开发</div> -->
            <dishes-statistics :canteenid="canteenId" :clientid="clientId" :tapname="tapname" v-if="show"/>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import comprehensive from './comprehensive'
import dinnerPlate from './dinnerPlate'
import drinkCode from './drinkCode'
import dishesStatistics from './dishesStatistics'
import allCanteenSelect from '@/components/allCanteenSelect'
import { mapGetters } from 'vuex'
export default {
  components: {
    comprehensive,
    dinnerPlate,
    drinkCode,
    allCanteenSelect,
    dishesStatistics
  },
  props: {

  },
  data() {
    return {
      /* header */
      canteenId: null, // 食堂ID
      clientId: null, // 食堂设备ID
      client: 'CLIENT_FLASH,CLIENT_AI_FPVS', // 设备种类

      /* 视觉结算统计 */
      headerTitle: '视觉结算统计', // 模块名
      centerDialogVisible: false,

      options: [],
      value: '',
      activeName: 'first',
      cantreenChartShow: false,
      dialogChartShow: false,
      drink_lineShow: false,
      drink_barShow: false,
      tapname: '',
      drinkname: '',
      show:false
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
    },
    newClient_id() {
      this.clientId = this.newClient_id
    }
  },
  created() {
    this.canteenId = this.newCanteen_check
    this.clientId = this.newClient_id
  },
  mounted() {
  },
  methods: {
    // tap切换 （综合统计，餐盘统计，饮料统计，菜品分析）
    handleClick(tab) {
      // if (tab.name === 'first') {
      // }
      this.show = false
      if (tab.name === 'second') {
        this.tapname = tab.name
      }
      if (tab.name === 'third') {
        this.drink_lineShow = true
        this.drinkname = tab.name
      }
      if (tab.name === 'fourth') {
        this.show = true
      }
    },

    // 查看统计图表
    LookSaleChart(item) {
      this.currentData = item
      this.centerDialogVisible = true
    },

    // tap 切换（销售趋势，销售占比）
    salehandleClick(tab) {
      if (tab.name == 'second') {
        this.cantreenChartShow = true
      }
    }

  }
}
</script>

<style lang="scss">
.businessStatistics {
  .bg-white {
    background-color: white;
  }
  .title {
    font-size: 20px;
  }
  .header {
    background-color: #fff;
    padding: 20px 40px;
    // margin-bottom: 20px;
    .titleName {
      font-size: 16px;
    }
    .title {
      font-size: 20px;
      margin-right: 40px;
    }
  }
  .developedBox {
    padding-top: 100px;
    text-align: center;
    font-size: 32px;
  }

  .ordertable {
    min-height: 65px;
    padding: 0 24px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 16px;
    line-height: 65px;
    border-bottom: 1px solid #ddd;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
  }

  .paging {
    padding: 20px;
    background: #fff;
    float: right;
  }
  .svg-icon {
    font-size: 25px;
    cursor: pointer;
  }
  .nav {
    background-color: #fff;
    box-shadow: rgba(60, 64, 67, 0.3) 0 1px 2px 0,
      rgba(60, 64, 67, 0.15) 0 1px 3px 1px;
  }
  .foodbox {
    box-shadow: rgba(60, 64, 67, 0.3) 0 1px 2px 0,
      rgba(60, 64, 67, 0.15) 0 1px 3px 1px;
  }
  .saleNumber {
    height: 144px;
    background: #fff;
    display: flex;
    margin-top: 20px;
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
  .el-tabs__content {
    background-color: #f0f2f5;
  }
  .el-tabs__header {
    background: #fff;
    padding: 0 20px;
    margin-bottom: 0;
  }
}
</style>
