<template>
  <div style="width: 100%;height: 300px;">
    <div ref="lineChart" style="width: 100%;height: 300px;" />
  </div>
</template>

<script>
import echarts from '@/utils/echarts.js'
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
        this.date = newValue
        this.echartInit()
      },
      deep: true,
      //immediate:true
    }
  },
  created() {
  },
  mounted() {
    this.echartInit()
  },
  methods: {
    echartInit() {
      let linechart = this.$echarts.init(this.$refs.lineChart)
      let option = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        series: [
          {
            type: 'tree',
            data: this.date,
            top: '1%',
            left: '7%',
            bottom: '1%',
            right: '20%',
            symbolSize: 7,
            label: {
              position: 'left',
              verticalAlign: 'middle',
              align: 'right',
              fontSize: 9
            },
            leaves: {
              label: {
                position: 'right',
                verticalAlign: 'middle',
                align: 'left'
              }
            },
            emphasis: {
              focus: 'descendant'
            },
            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750
          }
        ]
      };
      linechart.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
