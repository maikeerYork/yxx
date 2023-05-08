<template>
  <div class="container">
    <div class="main">
      <div class="header mb-20">
        <div class="mr-20">
          <el-date-picker
            v-model="monthVal"
            type="month"
            size="small"
            placeholder="选择月"
            value-format="yyyy-MM"
          >
          </el-date-picker>
        </div>
        <el-button type="primary" size="small" @click="handleStatistics">统计</el-button>
      </div>
      <div class="w-100 h-94">
        <div id="myChart" style="width: 100%; height: 100%"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { getDayConsume } from "@/api/consumptionAnalysis/index";
import { getNowFormatDate } from "@/utils/dateFunction";
import { mapGetters } from "vuex";
export default {
  name: "consumptionAnalysis",
  data() {
    return {
      monthVal: "",
      dataList: [],
      mychartResize: null,
    };
  },
  computed: {
    ...mapGetters(["canteen_info"]),
  },
  methods: {
    handleStatistics() {
      this.getDataList();
    },
    // 获取数据列表
    getDataList() {
      let params = {
        canteen_id: this.canteen_info.map((x) => x.canteen_id).join(","),
        date: this.monthVal,
      };
      getDayConsume(params).then((res) => {
        this.dataList = res.data.data.filter((x) =>
          Object.assign(x,{
            balance: x.balance / 100,
            other: x.other / 100,
            subsidy: x.subsidy / 100,
            total: x.total / 100,
          })
        );
        this.getMyChart();
      });
    },
    // 渲染图表
    getMyChart() {
      let chartDom = document.getElementById("myChart");
      let myChart = this.$echarts.init(chartDom);
      this.mychartResize = myChart;
      let option;
      option = {
        title: {
          text: "金额：元",
          textStyle: {
            color: "#fff",
            fontSize: 20,
          },
          padding: [5, 0, 0, 80],
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
        },
        color: ["#44E2F0", "#81DB80", "#7E46F8", "#FFAE29"],
        legend: {
          textStyle: {
            color: "#fff",
            fontSize: 16,
            padding: [0, 5],
          },
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: this.dataList.map((x) => x.date),
            axisLabel: {
              color: "#fff",
              fontSize: 12,
              padding: [15, 0, 0, 0],
            },
          },
        ],
        animation: true,
        yAxis: [
          {
            type: "value",
            axisLabel: {
              color: "#fff",
              fontSize: 16,
            },
            splitLine: {
              //网格线
              lineStyle: {
                type: "dashed", //设置网格线类型 dotted：虚线   solid:实线
                width: 0.3,
              },
              show: true, //隐藏或显示
            },
          },
        ],
        series: [
          {
            name: "累计消费",
            type: "line",
            stack: "Total",
            //   smooth: true,
            showSymbol: false,
            lineStyle: {
              width: 2,
              color: "#44E2F0",
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 2,
                colorStops: [
                  {
                    offset: 0,
                    color: "#44E2F0", // 0% 处的颜色
                  },
                  {
                    offset: 0.6,
                    color: "rgba(1, 255, 255,0)", // 100% 处的颜色
                  },
                ],
              },
            },
            data: this.dataList.map((x) => x.total),
          },
          {
            name: "现金消费",
            type: "line",
            stack: "Total",
            //   smooth: true, //设置折线图平滑
            lineStyle: {
              width: 2,
              color: "#81DB80",
            },
            //设置面积区域为渐变效果
            areaStyle: {
              color: {
                //线性渐变
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 2,
                colorStops: [
                  {
                    offset: 0,
                    color: "#81DB80", // 0% 处的颜色
                  },
                  {
                    offset: 0.6,
                    color: "rgba(1, 255, 255,0)", // 100% 处的颜色
                  },
                ],
              },
            },
            data: this.dataList.map((x) => x.balance),
          },
          {
            name: "补贴消费",
            type: "line",
            stack: "Total",
            //   smooth: true, //设置折线图平滑
            //设置面积区域为渐变效果
            lineStyle: {
              width: 2,
              color: "#7E46F8",
            },
            areaStyle: {
              color: {
                //线性渐变
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 2,
                colorStops: [
                  {
                    offset: 0,
                    color: "#7E46F8", // 0% 处的颜色
                  },
                  {
                    offset: 0.9,
                    color: "rgba(1, 255, 255,0)", // 100% 处的颜色
                  },
                ],
              },
            },
            data: this.dataList.map((x) => x.subsidy),
          },
          {
            name: "第三方消费",
            type: "line",
            stack: "Total",
            //   smooth: true, //设置折线图平滑
            lineStyle: {
              width: 2,
              color: "#FFAE29",
            },
            //设置面积区域为渐变效果
            areaStyle: {
              color: {
                //线性渐变
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 2,
                colorStops: [
                  {
                    offset: 0,
                    color: "#FFAE29", // 0% 处的颜色
                  },
                  {
                    offset: 0.6,
                    color: "rgba(1, 255, 255,0)", // 100% 处的颜色
                  },
                ],
              },
            },
            data: this.dataList.map((x) => x.other),
          },
        ],
      };
      option && myChart.setOption(option);
    },
  },
  mounted() {
    this.monthVal =
      getNowFormatDate().split("-")[0] + "-" + getNowFormatDate().split("-")[1];
    this.getDataList();

    window.addEventListener("resize", () => {
      this.mychartResize.resize(); //当浏览器窗口大小发生变化时，图表可以进行自适应
    });
  },
};
</script>
<style lang="scss" scoped>
.container {
  padding: 20px;
  width: 100%;
  height: 100%;
  .main {
    width: 100%;
    height: 100%;
    background: #100c2a;
    padding: 20px;
    .header {
      display: flex;
      align-items: center;
      /deep/.el-date-editor {
        width: 160px;
      }
    }
  }
}
</style>
