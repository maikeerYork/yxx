//获取当前日期并格式化
export function  getNowFormatDate() {
  let date = new Date()
  let seperator1 = "-"
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate
  }
  let currentdate = year + seperator1 + month + seperator1 + strDate
  return currentdate
}


//date转时间字符串  2021-01-01
export function  formatDate(date) {
  let seperator1 = "-"
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate
  }
  let currentdate = year + seperator1 + month + seperator1 + strDate
  return currentdate
}


// 本周
export function getCurrentWeek() {
  //获取当前时间
  const currentDate = new Date()
  //返回date是一周中的某一天
  const week = currentDate.getDay()
  //一天的毫秒数
  const millisecond = 1000 * 60 * 60 * 24
  //减去的天数
  const minusDay = week != 0 ? week - 1 : 6
  //本周 周一
  const monday = new Date(currentDate.getTime() - minusDay * millisecond)
  //本周 周日
  // const sunday = new Date(monday.getTime() + 6 * millisecond)
  let weekArr = [monday]
  for (let i = 1; i<= 6; i++) {
    weekArr.push(new Date(monday.getTime() + i * millisecond))
  }
  return weekArr
  // return [monday, sunday]
}

//上一周
export  function getPrevWeek() {
  const Time = new Date()
  let weekNum = Time.getDay()
  weekNum = weekNum == 0 ? 7 : weekNum
  let lastDate = new Date(Time.getTime() - weekNum * 24 * 60 * 60 * 1000)
  // let fitstDate = new Date(Time.getTime() - (weekNum + 6) * 24 * 60 * 60 * 1000)
  let weekArr = []
  for (let i = 6; i>= 1; i--) {
    weekArr.push( new Date(Time.getTime() - (weekNum + i) * 24 * 60 * 60 * 1000))
  }
  weekArr.push(lastDate)
  return   weekArr
}



//下一周
export  function getNextWeek() {
  const Time = new Date()
  let weekNum = Time.getDay()
  weekNum = weekNum == 0 ? 7 : weekNum
  // let fitstDate = new Date(
  //   Time.getTime() + (7 - weekNum + 1) * 24 * 60 * 60 * 1000
  // )
  // let lastDate = new Date(
  //   Time.getTime() + (7 - weekNum + 7) * 24 * 60 * 60 * 1000
  // )
  let weekArr = []
  for (let i = 1; i<= 7; i++) {
    weekArr.push(
      new Date(
      Time.getTime() + (7 - weekNum + i) * 24 * 60 * 60 * 1000
      )
    )
  }
  return weekArr
}


export function getLastDay(year, month) {
  let new_year = year //!取当前的年份
  let new_month = month++ //l取下一个月的第一天，方便计算（最后一天不固定)if(month>12){
  new_month -=12; //!月份减
  new_year++; ///年份增
  let new_date = new Date(new_year,new_month,1);
 // !取当年当月中的第一天
  return (new Date(new_date.getTime()- 1000 * 60 * 60 * 24)).getDate()  //获取当月最后一天日期
}

