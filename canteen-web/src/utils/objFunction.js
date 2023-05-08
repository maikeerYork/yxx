function filter(str) { // 特殊字符转义
  str += ''; // 隐式转换
  str = str.replace(/%/g, '%25')
  str = str.replace(/\+/g, '%2B')
  str = str.replace(/ /g, '%20')
  str = str.replace(/\//g, '%2F')
  str = str.replace(/\?/g, '%3F')
  str = str.replace(/&/g, '%26')
  str = str.replace(/\=/g, '%3D')
  str = str.replace(/#/g, '%23')
  return str;
}

// 对象 转成url参数
//得到这样子的数据 id=3&name=chenjianbin&ojb=3232
export function formateObjToParamStr(paramObj) {
  const sdata = []
  for (let attr in paramObj) {
    sdata.push(`${attr}=${filter(paramObj[attr])}`)
  }
  return sdata.join('&')
}

//深拷贝 递归实现
export function deepCopy(obj) {
  let objClone = Array.isArray(obj) ? [] : {}
  if (obj && typeof obj === "object") {
    for (let key in obj) {
      if (obj[key] && typeof obj[key] === "object") {
        objClone[key] = deepCopy(obj[key])
      } else {
        objClone[key] = obj[key]
      }
    }
  }
  return objClone
}
