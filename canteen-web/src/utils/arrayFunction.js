//这里存放数组的操作方法

//扁平化  通过reduce来实习
export function reduceFlatten(arr) {
  return arr.reduce((result, item)=> {
    return result.concat(Array.isArray(item) ? reduceFlatten(item) : item);
  }, []);
}

//对象数组 根据某一个属性 升序排序
 export  function objArrayAsc (prop) {
  return (obj1, obj2)=> {
    let val1 = obj1[prop]
    let val2 = obj2[prop]
    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
      val1 = Number(val1)
      val2 = Number(val2)
    }
    if (val1 < val2) {
      return -1
    } else if (val1 > val2) {
      return 1
    } else {
      return 0
    }
  }
}

//对象数组 根据某一个属性 降序排序
export  function objArrayDesc (prop) {
  return  (obj1, obj2)=> {
    let val1 = obj1[prop]
    let val2 = obj2[prop]
    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
      val1 = Number(val1)
      val2 = Number(val2)
    }
    if (val1 > val2) {
      return -1
    } else if (val1 < val2) {
      return 1
    } else {
      return 0
    }
  }
}
