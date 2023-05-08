<template>
  <div style="width: 100%;height: 400px;">
    <div ref="dishlinechart" style="width: 100%;height: 400px;" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  components: {

  },
  props: {
    dishlinedata: {
      type: Array,
      required: true
    },
    saleradio1: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      dishlinechart: {
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
          top: '40',
          right: '4%',
          bottom: '40'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisTick: {
            show: true,
            inside: true
          },
          data: [],
          smooth: true

        },
        yAxis: {
          type: 'value',
          axisTick: {
            show: true,
            inside: true
          },
          axisLabel: {
            formatter: '{value}'
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
    'dishlinedata': {
      handler: function(newValue, oldValue) {
        this.date = this.dishlinedata.map(function(item) {
          return item['date']
        })
        this.money = this.dishlinedata.map(function(item) {
          return Number(item['money'])
        })
        this.echartInit()
      },
      deep: true
    },
    saleradio1(newV, oldV) {
      this.echartInit()
    }
  },
  created() {
  },
  mounted() {
    this.echartInit()
  },
  methods: {
    echartInit() {
      this.date = this.dishlinedata.map(function(params) {
        return params['date']
      })
      this.money = this.dishlinedata.map(function(params) {
        return (Number(params['money']) / 100).toFixed(2)
      })

      this.count = this.dishlinedata.map(function(params) {
        return Number(params['count'])
      })
      this.$set(this.dishlinechart.xAxis, 'data', this.date)
      if (this.saleradio1 == '销售额') {
        this.$set(this.dishlinechart.series[0], 'data', this.money)
        this.$set(this.dishlinechart.series[0], 'name', '销售额')
        this.$set(this.dishlinechart.tooltip, 'formatter', '{b}<br />{a}：{c}元')
      } else {
        this.$set(this.dishlinechart.series[0], 'data', this.count)
        this.$set(this.dishlinechart.series[0], 'name', '销售量')
        this.$set(this.dishlinechart.tooltip, 'formatter', '{b}<br />{a}：{c}份')
      }
      var dishlinechart = this.$echarts.init(this.$refs.dishlinechart)
      dishlinechart.setOption(this.dishlinechart)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
