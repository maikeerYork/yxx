<template>
  <div ref="drinkcodeBarchart" style="width: 100%;height: 400px;" />
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  components: {

  },
  props: {
    needdrinkcodeBarchart: {
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
    'needdrinkcodeBarchart': {
      handler: function(newValue, oldValue) {
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
          formatter: function(params) {
            return '<div><p>销售占比：' + params[0].value.money_pct + '%' + '</p></div>'
          }
        },
        dataset: {
        // 这里指定了维度名的顺序，从而可以利用默认的维度到坐标轴的映射。
        // 如果不指定 dimensions，也可以通过指定 series.encode 完成映射，参见后文。
          dimensions: ['name', 'money_pct', 'money', 'count_pct', 'count'],
          source: []
        },
        grid: {
          left: '4%',
          top: '40',
          right: '6%',
          bottom: '40'
        },
        xAxis: {
          type: 'value',
          axisTick: {
            show: true,
            inside: true
          },
          // // max: 100, // Y轴最大值 不写的话自动调节
          axisLabel: {
            show: true,
            formatter: '{value}%'
          },
          splitLine: { lineStyle: { type: 'dashed' }}
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
            x: 'money_pct',
            y: 'name',
            tooltip: ['money_pct']
          },
          name: '销售占比',
          barWidth: '35',
          itemStyle: {
            normal: {
              label: {
                show: 'true',
                position: 'right',
                formatter: '{@[2]}元 {@[1]}%'
              }
            }
          }
        }]
      }
      var obj = JSON.parse(JSON.stringify(this.needdrinkcodeBarchart))
      obj.forEach(element => {
        var price = (Number(element.money) / 100)
        element.money = price.toFixed(2)
      })
      this.$set(this.barData.dataset, 'source', obj.reverse())
      var drinkcodeBarchart = this.$echarts.init(this.$refs.drinkcodeBarchart)
      drinkcodeBarchart.setOption(this.barData)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
