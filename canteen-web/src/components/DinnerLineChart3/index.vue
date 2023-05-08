<template>
  <div style="">
    <div ref="lineChart" style="width: 100%;height: 300px;" />
  </div>
</template>

<script>
// import echarts from '@/utils/echarts.js'
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
        //color: ['#3398DB'],
        tooltip: {
          //backgroundColor: '#fff',
          trigger: 'axis',
          extraCssText: 'box-shadow: 0 0 3px 2px rgba(0, 0, 0, 0.3);',
        },
        legend: {
          data: ['消费金额', '实际消费金额', '退款金额']
        },
        grid: {
          left: '7%',
          top: '42',
          right: '7%',
          bottom: '40'
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
          splitLine: { lineStyle: { type: 'dashed' } }
        },
        series: [{
          type: 'line',
          name: '消费金额',
          stack: 'Total',
          data: []/*,
          smooth: true*/
        },
          {
            name: '实际消费金额',
            type: 'line',
            stack: 'Total',
            data: []
          },
          {
            name: '退款金额',
            type: 'line',
            stack: 'Total',
            data: []
          }]
      },
      date: '',
      money: '',
      total_price:'', // 总金额
      real_price:'', // 实际消费金额
      refund_price: '' // 退款金额
    }
  },
  computed: {
    ...mapGetters([
      'allCanteenInfo'
    ])
  },
  watch: {
    'needData': {
      handler: function (newValue, oldValue) {
        this.date = this.needData.map(function (item) {
          return item['date']
        })
        this.total_price = this.needData.map(function (item) {
          return Number(item['total_price'])
        })
        this.real_price = this.needData.map(function (item) {
          return Number(item['real_price'])
        })
        this.refund_price = this.needData.map(function (item) {
          return Number(item['refund_price'])
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
      this.date = this.needData.map(function (params) {
        return params['date']
      })
      this.total_price = this.needData.map(function (params) {
        return (Number(params['total_price']) / 100).toFixed(2)
      })
      this.real_price = this.needData.map(function (params) {
        return (Number(params['real_price']) / 100).toFixed(2)
      })
      this.refund_price = this.needData.map(function (params) {
        return (Number(params['refund_price']) / 100).toFixed(2)
      })
      this.$set(this.lineData.xAxis, 'data', this.date)
      this.$set(this.lineData.series[0], 'data', this.total_price)
      this.$set(this.lineData.series[1], 'data', this.real_price)
      this.$set(this.lineData.series[2], 'data', this.refund_price)
      var linechart = this.$echarts.init(this.$refs.lineChart)
      linechart.setOption(this.lineData)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
