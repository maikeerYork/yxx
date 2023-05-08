const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const webpack = require('webpack')
const cdnConfig = require('./cdn.config')
const externalConfig = JSON.parse(JSON.stringify(cdnConfig.externalConfig))  // 读取配置
const cdn_list = cdnConfig.getExternalModules(externalConfig)

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath: './',
  outputDir: "dist",
  assetsDir: './static',
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
    config.optimization.splitChunks({
      chunks: 'all'
    })

  },
})
