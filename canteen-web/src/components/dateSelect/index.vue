<template>
  <div class="daytime">
    <el-button-group class="btn-group">
      <el-button v-for="(item,index) in dateStyle" :key="index" type="default" :class="{'currentSelete': item.id === dayKey}" @click="day(item,index)">{{ item.name }}</el-button>
      <el-date-picker
        v-model="daytime_start_end"
        :class="{'borderSelete': dayKey === 99}"
        type="daterange"
        :clearable="false"
        :unlink-panels="true"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="yyyy年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
        @change="changeday"
      />
    </el-button-group>
  </div>
</template>

<script>
export default {
  filters: {
  },
  components: {

  },
  props: {

  },
  data() {
    return {
      daytime_start_end: [],
      date_start: '',
      date_end: '',
      currentDate: '',
      dateStyle: [
        {
          id: 0,
          name: '今天'
        },
        {
          id: 1,
          name: '明天'
        },
        {
          id: 7,
          name: '近七天'
        },
        {
          id: 15,
          name: '近15天'
        },
        {
          id: 30,
          name: '近30天'
        }
      ],
      dayKey: 0
    }
  },
  computed: {

  },
  watch: {

  },
  created() {
    var todaytime = this.getcurrentData()
    this.date_end = todaytime
    this.daytime_start_end = [this.date_end, this.date_end]
  },
  mounted() {

  },
  methods: {
    // 当前标准时间转换 和 毫秒数时间转换 （注：只能转换成 年 月 日 ）
    getcurrentData(value) {
      var date
      if (value) {
        date = new Date(value)
      } else {
        date = new Date()
      }
      var currentDate = date.toISOString().slice(0, 10)
      return currentDate
    },
    // 天数减法
    getsubtractionDate(currentTiem, number) {
      var Ndate = new Date(currentTiem)
      Ndate = Ndate.setDate(Ndate.getDate() - number)
      Ndate = this.getcurrentData(Ndate)
      return Ndate
    },
    // 天数加法
    getsubtractionDate_add(currentTiem, number) {
      var Ndate = new Date(currentTiem)
      Ndate = Ndate.setDate(Ndate.getDate() + number)
      Ndate = this.getcurrentData(Ndate)
      return Ndate
    },
    // 比较两个日期相差的天数
    getDifferenceDay(value) {
      var startTime = new Date(value[0])
      var endTime = new Date(value[1])
      var DifferenceDay = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60 * 24)
      return DifferenceDay
    },

    // 选择天数
    day(key) {
      this.dayKey = key.id
      switch (key.id) {
        case 0:
          this.sendData(key, 0)
          break
        case 1:
          this.sendData(key, 0)
          break
        case 7:
          this.sendData(key, 1)
          break
        case 15:
          this.sendData(key, 1)
          break
        case 30:
          this.sendData(key, 1)
          break
      }
    },

    // 发送数据给父组件
    sendData(key, type) {
      if (key.id === 0) {
        this.date_end = this.getcurrentData()
        this.daytime_start_end = [this.date_end, this.date_end]
      } else {
        switch (key.id) {
          case 1:
            this.date_start = this.getsubtractionDate_add(this.date_end, key.id)
            this.daytime_start_end = [this.date_start, this.date_start]
            break
          default:
            this.date_start = this.getsubtractionDate(this.date_end, key.id)
            this.daytime_start_end = [this.date_start, this.date_end]
            break
        }
      }
      var obj = {}
      obj.type = type
      obj.daytime_start_end = this.daytime_start_end
      this.$emit('sendDaytime', obj)
      this.$emit('sendDaytimedish', obj)
      this.$emit('sendDayDrink', obj)
    },

    // 日期选择
    changeday(value) {
      this.dayKey = 99
      var chaday = this.getDifferenceDay(value)
      var type
      if (chaday <= 1) {
        type = 0
      } else if (chaday > 1 && chaday <= 30) {
        type = 1
      } else if (chaday > 30 && chaday <= 122) {
        type = 2
      } else if (chaday > 122 && chaday <= 730) {
        type = 3
      } else {
        type = 4
      }
      var obj = {}
      obj.type = type
      obj.daytime_start_end = value
      this.$emit('sendDaytime', obj)
      this.$emit('sendDaytimedish', obj)
      this.$emit('sendDayDrink', obj)
    }
  }
}
</script>

<style lang="scss" scoped>
.daytime {
  .btn-group {
    width: 100%;
  }
  .currentSelete{
    background-color: #ecf5ff;
    color: #409eff;
  }
  .borderSelete{
    border: 1px solid #409eff;
  }
}
</style>
