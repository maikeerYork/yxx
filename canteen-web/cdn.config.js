// 引入依赖文件
exports.packageDependencies = require('./package.json').dependencies

// CDN域名
exports.cdnBaseHttp = 'https://cdn.bootcss.com'

// 配置需要CDN的模块.
exports.externalConfig = [
  { name: 'vue', scope: 'Vue', js: 'vue.min.js' },
  { name: 'vue-router', scope: 'VueRouter', js: 'vue-router.min.js' },
  { name: 'axios', scope: 'axios', js: 'axios.min.js' },
  { name: 'element-ui', scope: 'ELEMENT', js: 'index.js', css: 'theme-chalk/index.css' },
  { name: 'echarts', scope: 'Echarts', js: 'echarts.min.js' },
  { name: 'vuex', scope: 'Vuex', js: 'vuex.min.js' }
]

// 获取版本模块版本号
exports.getModulesVersion = () => {
  const mvs = {}
  for (const key of Object.keys(this.packageDependencies)) {
    const value = this.packageDependencies[key]
    mvs[key] = value.replace(/(~|\^)/g, '')
  }
  return mvs
}

// 获取需要CDN的模块
exports.getExternalModules = config => {
  const externals = { 'css': [], 'js': [] } // cdn url 结果
  const dependenciesModules = this.getModulesVersion() // 获取全部的模块和版本号

  config = config || this.externalConfig // 默认使用该文件下的externalConfig

  config.forEach(item => { // 遍历配置
    if (Object.keys(this.packageDependencies).includes(item.name)) {
      const version = dependenciesModules[item.name]
      // 添加CSS CDN
      item.css && externals.css.push([this.cdnBaseHttp, item.name, version, item.css].join('/'))
      // 添加JS CDN
      item.js && externals.js.push([this.cdnBaseHttp, item.name, version, item.js].join('/'))
    }
  })
  return externals
}

