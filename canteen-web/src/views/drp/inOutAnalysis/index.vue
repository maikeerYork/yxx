<template>
  <div id="box">
    <div class="box">
        <div class="header mb-20">
            <el-radio-group v-model="radio1" size="small" @input="changRadio">
                <el-radio-button label="采购金额分析"></el-radio-button>
                <el-radio-button label="出库金额分析"></el-radio-button>
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
import { getMoney} from "@/api/inOutAnalysis";
import { mapGetters } from "vuex";
import { getNowFormatDate } from "@/utils/dateFunction";
export default {
    data() {
        return {
            option : {
                title: {
                    text: "金额：元",
                    textStyle: {
                    color: "#fff",
                    fontSize: 20,
                    },
                    padding: [5,0,0,80]
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: [],
                    axisLabel: {
                　　　　show: true,
                　　　　color: '#ffffff',
                　　　　fontSize: 12
                　　 },
                },
                yAxis: {
                    type: 'value',
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
                series: [
                    {
                        data: [],
                        type: 'line',
                        label: {
                            show: true,
                            position: "top",
                            color: "#fff",
                        },
                        areaStyle: {
                            normal: {// 渐变填充色（线条下半部分）
                                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: "#0f4478" },
                                    { offset: 1, color: "#0e244e" }
                                ])
                            }
                        },
                        lineStyle: { // 设置线条的style等
                            normal: {
                            color: '#42c9d5', // 折线线条颜色:红色
                            },
                        },
                        itemStyle: {
                            // 设置线条上点的颜色（和图例的颜色）
                            normal: {
                            color: '#ffffff',
                            },
                        },
                    },
                ],
            },
            monthVal:'',
            radio1:'采购金额分析',
            dataList:[]  
        }
    },
    computed: {
        ...mapGetters(['canteen_id'])
    },
    async mounted() {
        this.monthVal = getNowFormatDate().split("-")[0] + "-" + getNowFormatDate().split("-")[1];
        this.getech()
    },
    methods:{
        changRadio(){
            console.log(this.radio1);
            this.getech()
        },
        async getech(){
            let res = await getMoney({
                canteen_id:this.canteen_id,
                type:this.radio1 == '采购金额分析' ? 1 : 2,
                date:this.monthVal,
            })
            console.log(res);
            this.dataList = res.data.data.filter((x) =>
            Object.assign(x,{
                total: x.total / 100,
            })
            )
            this.option.xAxis.data = this.dataList.map((x) => x.date)
            this.option.series[0].data = this.dataList.map((x) => x.total)
            var chartDom = document.getElementById('main');
            chartDom.removeAttribute('_echarts_instance_')
            var myChart = this.$echarts.init(chartDom);
            myChart.setOption(this.option)
        },
        search(){
            this.getech()
        }
    }
}
</script>

<style lang="scss" scoped>
#box{
    padding: 20px 0 0 20px;
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
}
.box{
    width: 100%;
    height: 100%;
    background-color: #030303;
    overflow: hidden;
    box-sizing: border-box;
}
#main{
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
/deep/.el-radio-group{
    margin:0 20px 0 20px   ;
}
</style>