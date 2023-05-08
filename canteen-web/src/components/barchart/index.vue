<template>

  <div v-if="needBarData != []" ref="barchart" style="width: 100%;height: 550px;" />

</template>

<script>
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
      let flag = ''
      this.needBarData.forEach(item=>{
        if(item.canteen_name){
          flag = true
        }else{
          flag = false
        }
      })
      let distinction1 = ''
      let distinction2 = ''
      let distinction3 = ''
      let distinction4 = ''
      if(flag){
        distinction1 = '{value}'
        distinction2 = ' {@[1]}'
        distinction3 = '销售量'
        distinction4 = ''
      }else{
        distinction1 = '{value}%'
        distinction2 = '{@[2]}元 {@[1]}%'
        distinction3 = '销售占比：'
        distinction4 = '%'
      }
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
            return '<div><p>'+distinction3 + params[0].value.money_pct + distinction4 + '</p></div>'
          }
        },
        grid: {
          left: '8%',
          top: '40',
          right: '8%',
          bottom: '40'
        },
        dataset: {
        // 这里指定了维度名的顺序，从而可以利用默认的维度到坐标轴的映射。
        // 如果不指定 dimensions，也可以通过指定 series.encode 完成映射，参见后文。
          dimensions: ['name', 'money_pct', 'money'],
          source: []
        },
        xAxis: {
          show: true,
          type: 'value',
          // // max: 100, // Y轴最大值 不写的话自动调节
          axisLabel: {
            formatter: distinction1

          },
          axisTick: {
            show: true,
            inside: true
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
                formatter: distinction2
              }
            }
          }
        }]
      }
      var obj = JSON.parse(JSON.stringify(this.needBarData))
      obj.forEach(element => {
        var price = (Number(element.money) / 100)
        element.money = price.toFixed(2)
      })
      this.$set(this.barData.dataset, 'source', obj.reverse())
      var barChart = this.$echarts.init(this.$refs.barchart)
      barChart.setOption(this.barData)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
