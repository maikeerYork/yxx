<template>
  <div ref="pieChart" style="width: 100%;height: 400px;" />
</template>

<script>
// import echarts from '@/utils/echarts.js'
import { mapGetters } from 'vuex'

export default {
  components: {

  },
  props: {
    needPieData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      pieData: {
        color: ['#2684ff', '#53a8ff', '#66b1ff', '#79bbff', '#8cc5ff', '#a0cfff', '#b3d8ff', '#c6e2ff', '#d9ecff', '#ecf5ff', '#c4ccd3'],
        title: {
          text: '支付方式',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          backgroundColor: '#fff',
          extraCssText: 'box-shadow: 0 0 3px 2px rgba(0, 0, 0, 0.3);',
          formatter: '{a} <br/>{b} :{c}元 ({d}%)',
          textStyle: {
            color: '#000',
            fontWeight: 'lighter'
          }
        },
        legend: {
          orient: 'vertical',
          left: 'right'
          // data: ['一卡通', '人脸支付']
        },
        series: [
          {
            name: '支付方式',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              formatter: '{b} : {d}% '
            }
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'allCanteenInfo'
    ])
  },
  watch: {
    'needPieData': {
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
      var arry = []
      this.needPieData.forEach(item => {
        var obj = {}
        obj.value = (Number(item.pay_rate) / 100).toFixed(2)
        obj.name = item.pay_name
        arry.push(obj)
      })
      this.name = this.needPieData.map(function (params) {
        return params['pay_name']
      })
      this.$set(this.pieData.legend, 'data', name)
      this.$set(this.pieData.series[0], 'data', arry)
      var piechart = this.$echarts.init(this.$refs.pieChart)
      piechart.setOption(this.pieData)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
