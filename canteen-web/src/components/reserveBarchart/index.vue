<template>

  <div style="width: 100%;height: 400px;">
    <div id="myChart" ref="barRevchart" style="width: 100%;height: 400px;" />
  </div>

</template>

<script>
// import echarts from '@/utils/echarts.js'
import { mapGetters } from 'vuex'
export default {
  components: {

  },
  props: {
    needBarData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      barData: null,
      name: [],
      money_pct: [],
      money: []
    }
  },
  computed: {
    ...mapGetters([
      'allCanteenInfo'
    ])
  },
  watch: {
    'needBarData': {
      handler: function (newValue, oldValue) {
        this.echartInit()
      },
      deep: true
    }
  },
  created() {

  },
  mounted() {
    this.echartInit()
  },
  methods: {
    echartInit() {
      this.barData = {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'none' // 默认为直线，可选为：'line' | 'shadow' | 'none' | 'cross'
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            minInterval: 1,//不允许出现小数位
          }
        ],
        dataset: {
          // 这里指定了维度名的顺序，从而可以利用默认的维度到坐标轴的映射。
          // 如果不指定 dimensions，也可以通过指定 series.encode 完成映射，参见后文。
          dimensions: ['foods_name', 'foods_count'],
          source: []
        },
        series: [
          {
            name: '总数量',
            type: 'bar',
            barWidth: '35',
            itemStyle: {
              normal: {
                label: {
                  show: 'true',
                  position: 'top',
                  formatter: '{@[1]}'
                }
              }
            }
          }
        ]
      }
      var obj = JSON.parse(JSON.stringify(this.needBarData))
      this.barData.xAxis[0].data = []
      obj.forEach(element => {
        this.barData.xAxis[0].data.push(element.foods_name)
      })

      this.$set(this.barData.dataset, 'source', obj.reverse())
      let myChart = document.getElementById("myChart");
      myChart.style.width = window.innerWidth - 290 + "px";  //初始化echarts图表宽度
      this.myChart = this.$echarts.init(myChart);
      this.myChart.setOption(this.barData);
      let self = this;
      window.addEventListener("resize", () => {  // 通过resize方法来重设图表宽度
        let myChart = document.getElementById("myChart");
        myChart.style.width = window.innerWidth - 290 + "px";
        self.myChart.resize();
      });
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
