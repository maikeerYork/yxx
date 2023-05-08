<template>
  <div style="width: 100%;height: 400px;">
    <div ref="dishbarchart" style="width: 100%;height: 400px;" />
  </div>
</template>

<script>
// import echarts from '@/utils/echarts.js'
import { mapGetters } from 'vuex'
export default {
  components: {

  },
  props: {
    needdishBarData: {
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
    'needdishBarData': {
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
          show: true,
          backgroundColor: '#fff',
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'none' // 默认为直线，可选为：'line' | 'shadow' | 'none' | 'cross'
          },
          textStyle: {
            color: '#000',
            fontWeight: 'lighter'
          },
          extraCssText: 'box-shadow: 1px 1px 3px 2px rgba(0, 0, 0, 0.3);',
          formatter: function (params) {
            return '<div><p>销售量：' + params[0].value.foods_count + '份' + '</p></div>'
          }
        },
        grid: {
          left: '8%',
          top: '40',
          right: '8%',
          bottom: '40',
          containLabel: true
        },
        dataset: {
          // 这里指定了维度名的顺序，从而可以利用默认的维度到坐标轴的映射。
          // 如果不指定 dimensions，也可以通过指定 series.encode 完成映射，参见后文。
          dimensions: ['foods_name', 'foods_count'],
          source: []
        },
        xAxis: {
          type: 'value',
          minInterval: 1, //不允许出现小数位
          axisTick: {
            show: true,
            inside: true
          },
          // // max: 100, // Y轴最大值 不写的话自动调节
          axisLabel: {
            formatter: '{value}'
          },
          splitLine: { lineStyle: { type: 'dashed' } }
        },
        yAxis: {
          type: 'category',
          axisTick: {
            show: true,
            alignWithLabel: true
          }
        },
        series: [{
          type: 'bar',
          encode: {
            x: 'foods_count',
            y: 'foods_name',
            tooltip: ['foods_count']
          },
          name: '销售量',
          barWidth: '35',
          itemStyle: {
            normal: {
              label: {
                show: 'true',
                position: 'right',
                formatter: '{@[1]}'
              }
            }
          }
        }]
      }
      var obj = JSON.parse(JSON.stringify(this.needdishBarData))
      this.$set(this.barData.dataset, 'source', obj.reverse())
      var dishbarchart = this.$echarts.init(this.$refs.dishbarchart)
      dishbarchart.setOption(this.barData)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
