<template>
  <div id="box">
    <div class="box">
      <div class="header mb-20">
        <el-radio-group v-model="radio1" size="small" @input="changRadio">
          <el-radio-button label="人数分析"></el-radio-button>
          <el-radio-button label="金额分析"></el-radio-button>
        </el-radio-group>
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
        <el-button type="primary" size="small" @click="search">统计</el-button>
      </div>
      <div id="main"></div>
    </div>
  </div>
</template>

<script>
import { getNowFormatDate } from "@/utils/dateFunction";
import { getStrip } from "@/api/userAnalyse";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      monthVal: "",
      radio1: "人数分析",
      myChart: "myChart" + Date.now() + Math.random(),
    };
  },
  computed: {
        ...mapGetters(['canteen_id'])
  },
  async mounted() {
    this.monthVal = getNowFormatDate().split("-")[0] + "-" + getNowFormatDate().split("-")[1];
    this.geteacher(1)
  },
  methods:{
    async geteacher(index){
        console.log(this.monthVal.split('-'),'this.monthVal');
        
        // this.getMonthDay(this.monthVal.split('-')[0],this.monthVal.split('-')[1])
        // console.log(,'[[');

        let res = await getStrip({
            canteen_id:this.canteen_id,
            date_start: this.monthVal +'-01',
            date_end: this.monthVal +'-' +this.getMonthDay(this.monthVal.split('-')[0],this.monthVal.split('-')[1])
        })
        let _data = res.data.data
        var app = {};
        var option;
        const posList = [
        "left",
        "right",
        "top",
        "bottom",
        "inside",
        "insideTop",
        "insideLeft",
        "insideRight",
        "insideBottom",
        "insideTopLeft",
        "insideTopRight",
        "insideBottomLeft",
        "insideBottomRight",
        ];
        app.configParameters = {
        rotate: {
            min: -90,
            max: 90,
        },
        align: {
            options: {
            left: "left",
            center: "center",
            right: "right",
            },
        },
        verticalAlign: {
            options: {
            top: "top",
            middle: "middle",
            bottom: "bottom",
            },
        },
        position: {
            options: posList.reduce(function (map, pos) {
            map[pos] = pos;
            return map;
            }, {}),
        },
        distance: {
            min: 0,
            max: 100,
        },
        };
        app.config = {
        rotate: 360,
        align: "left",
        verticalAlign: "middle",
        position: "right",
        distance: 15,
        onChange: function () {
            const labelOption = {
                rotate: app.config.rotate,
                align: app.config.align,
                verticalAlign: app.config.verticalAlign,
                position: app.config.position,
                distance: app.config.distance,
            };
            myChart.setOption({
            series: [
                {
                label: labelOption,
                },
                {
                label: labelOption,
                },
                {
                label: labelOption,
                },
                {
                label: labelOption,
                },
            ],
            });
        },
        };
        const labelOption = {
            show: true,
            position: app.config.position,
            distance: app.config.distance,
            align: app.config.align,
            verticalAlign: app.config.verticalAlign,
            rotate: app.config.rotate,
            formatter: "{c}",
            fontSize: 16,
            color:'#fff',
            // padding:[0,0,0,20],
            rich: {
                name: {},
            },
        };
        option = {
            tooltip: {
                trigger: "axis",
                axisPointer: {
                type: "shadow",
                },
            },
            // legend: {
            //     data: ["Forest", "Steppe", "Desert", "Wetland"],
            // },
            toolbox: {
                show: false,
                orient: "vertical",
                left: "right",
                top: "center",
                feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ["line", "bar", "stack"] },
                restore: { show: true },
                saveAsImage: { show: true },
                },
            },
            xAxis: [
                {
                type: "value",
                axisTick: { show: false },
                axisLabel: {
                       show: true,
                       color: '#ffffff',
                       fontSize: 16
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
            series: [],
        };
        if(index == 1){
            option.series = [
                {
                // name: "Forest",
                type: "bar",
                barGap: 0,
                label: labelOption,
                emphasis: {
                    focus: "series",
                },
                data: [_data.user_register_count, _data.card_register_count, _data.recharge_count,_data.card_logout_count],
                itemStyle: { // 柱状图的背景色
                    normal: {
                    // 每个柱子的颜色即为colorList数组里的每一项,如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                    color: function (params) {
                        var index = params.dataIndex
                        // var colorList = [
                        // // 渐变颜色的色值和透明度
                        // // 透明度从0
                        // ['rgba(15,235,255,0.3)', 'rgba(15,235,255,0.3)', 'rgba(15,235,255,0.3)', 'rgba(15,235,255,0.3)', 'rgba(15,235,255,0.3)', 'rgba(15,235,255,0.3)', 'rgba(15,235,255,0.3)', 'rgba(13,94,208,0.3)', 'rgba(255,155,15,0)', 'rgba(253,103,96,0.3)'], // 到透明度1 ,如果需要不同的颜色直接修改不同颜色即可
                        // ['rgba(15,235,255,0.6)', 'rgba(15,235,255,0.6)', 'rgba(15,235,255,0.6)', 'rgba(15,235,255,0.6)', 'rgba(15,235,255,0.6)', 'rgba(15,235,255,0.6)', 'rgba(15,235,255,0.6)', 'rgba(13,94,208,0.6)', 'rgba(255,155,15,0.6)', 'rgba(253,103,96,0.6)']
                        // ]
                        return {
                        colorStops: [{
                            offset: 0.3, // 颜色的开始位置
                            color: '#0B80FD' // 0% 处的颜色
                        },
                        {
                            offset: 0.6, // 颜色的结束位置
                            color: "#05EAFC" // 100% 处的颜色
                        }]
                        }
                    }
                    }
                }
                },
            ]
            option.yAxis =  [
                {
                type: "category",
                axisTick: { show: false },
                data: ["注册人数", "开卡人数","充值人数","退卡人数"  ],
                axisLabel: {
                       show: true,
                       color: '#ffffff',
                       fontSize: 16
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
            ]
        }else{
            option.series = [
                {
                    name: "累计实收",
                    type: "bar",
                    // barGap: 0,
                    label: labelOption,
                    data: [ _data.cumulative_refund / 100, ,_data.cumulative_real / 100,],
                    itemStyle: {//自定义颜色
                        normal: { color: "#00beff" },
                    },
                },
                {
                    name: "现金实收",
                    type: "bar",
                    label: labelOption,
                    data: [ _data.balance_refund / 100, _data.recharge_balance / 100,_data.balance_real / 100],
                    itemStyle: {//自定义颜色
                        normal: { color: "#69ffce" },
                    },
                },
                {
                    name: "补贴实收",
                    type: "bar",
                    label: labelOption,
                    data: [ _data.subsidy_refund / 100, _data.recharge_subsidy / 100, _data.subsidy_real / 100,],
                    itemStyle: {//自定义颜色
                        normal: { color: "#fffeb2" },
                    },
                },
                {
                    name: "第三方实收",
                    type: "bar",
                    label: labelOption,
                    data: [ _data.third_refund / 100, ,_data.third_real / 100],
                    itemStyle: {//自定义颜色
                        normal: { color: "#ffd1a2" },
                    },
                },
            ]
            option.formatter= function (params) {
                var tar0 = params[0];
                var tar1 = params[1];
                var tar2 = params[2];
                var tar3 = params[3];
                var myName ='';
                if(tar0.dataIndex == 0){
                    return tar0.name + ':'  +  myName + '<br/>'
                 + '累计退款' + ':' + tar0.data+ '<br/>' + 
                 '现金退款'+ ':' + tar1.data + '<br/>' + '补贴退款'+ ':' + tar2.data +
                  '<br/>' + '第三方退款'+ ':' + tar3.data;
                }else if(tar0.dataIndex == 1){
                    return tar0.name + ':'  +  myName + '<br/>' + 
                    '现金充值'+ ':' + tar1.data + '<br/>' + '补贴充值'+ ':' + tar2.data;
                }else if(tar0.dataIndex == 2){
                    return tar0.name + ':'  +  myName + '<br/>'
                 + tar0.seriesName + ':' + tar0.data+ '<br/>' + 
                 tar1.seriesName+ ':' + tar1.data + '<br/>' + tar2.seriesName+ ':' + tar2.data +
                  '<br/>' + tar3.seriesName+ ':' + tar3.data;
                }
            }
            option.yAxis =  [
                {
                type: "category",
                axisTick: { show: false },
                data: ["退款金额", "充值金额","实收金额"  ],
                axisLabel: {
                       show: true,
                       color: '#ffffff',
                       fontSize: 16
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
            ]
        }
        var chartDom = document.getElementById("main");
        chartDom.removeAttribute('_echarts_instance_')
        var myChart = this.$echarts.init(chartDom);
        myChart.setOption(option);
    },
    changRadio(){
        console.log(this.radio1);
       if(this.radio1 == '人数分析'){
        console.log(1);
        this.geteacher(1)
       }else{
        this.geteacher(2)   
       } 
    },
    search(){
        if(this.radio1 == '人数分析'){
        console.log(1);
        this.geteacher(1)
       }else{
        this.geteacher(2)   
       }
    },
    getMonthDay(year, month) {
        let days = new Date(year, month , 0).getDate()
        console.log(days,'days');
        return days
    }
  }
};
</script>

<style lang="scss" scoped>
#box {
  padding: 20px 0 0 20px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
}
.box {
  width: 100%;
  height: 100%;
  background-color: #030303;
  overflow: hidden;
  box-sizing: border-box;
}
#main {
  width: 100%;
  height: 90%;
}
.header {
  margin-top: 10px;
  display: flex;
  align-items: center;
  /deep/.el-date-editor {
    width: 160px;
    height: 10%;
  }
}
/deep/.el-radio-group {
  margin: 0 20px 0 20px;
}
</style>