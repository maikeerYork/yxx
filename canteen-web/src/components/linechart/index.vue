<template>
  <div style="width: 100%;height: 400px;">
    <div ref="lineChart" style="width: 100%;height: 400px;" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  components: {

  },
  props: {
    needData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      lineData: {
        color: ['#3398DB'],
        tooltip: {
          backgroundColor: '#fff',
          trigger: 'axis',
          extraCssText: 'box-shadow: 0 0 3px 2px rgba(0, 0, 0, 0.3);',
          formatter: '{b}<br />{a}：{c}元',
          textStyle: {
            color: '#000',
            fontWeight: 'lighter'
          }
        },
        grid: {
          left: '4%',
          top: '20',
          right: '4%',
          bottom: '30'
        },
        xAxis: {
          show: true,
          type: 'category',
          boundaryGap: false,
          axisLine: {
            show: true

          },
          axisTick: {
            show: true,
            inside: true
          },
          data: []

        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}'
          },
          axisTick: {
            show: true,
            inside: true
          },
          splitLine: { lineStyle: { type: 'dashed' }}
        },
        series: [{
          type: 'line',
          name: '销售额',
          data: [],
          smooth: true
        }]
      },
      date: '',
      money: ''
    }
  },
  computed: {
    ...mapGetters([
      'allCanteenInfo'
    ])
  },
  watch: {
    'needData': {
      handler: function(newValue, oldValue) {
        this.date = this.needData.map(function(item) {
          return item['date']
        })
        this.money = this.needData.map(function(item) {
          return Number(item['money'])
        })
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
      this.date = this.needData.map(function(params) {
        return params['date']
      })
      this.money = this.needData.map(function(params) {
        return (Number(params['money']) / 100).toFixed(2)
      })
      this.$set(this.lineData.xAxis, 'data', this.date)
      this.$set(this.lineData.series[0], 'data', this.money)
      var linechart = this.$echarts.init(this.$refs.lineChart)
      linechart.setOption(this.lineData)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
