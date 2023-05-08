
if (process.env.NODE_ENV === 'development') {
  // 测试线的基础地址
  const tft_url = process.env.VUE_APP_BASE_API
  const kang_url = process.env.VUE_APP_BASE_API

  module.exports = {
    tft_url,
    kang_url
  }
} else if (process.env.NODE_ENV === 'test') {
  // 测试线的基础地址
  const tft_url = process.env.VUE_APP_BASE_API
  const kang_url = process.env.VUE_APP_BASE_API

  module.exports = {
    tft_url,
    kang_url
  }
} else {
  // 正式线的基础地址
  const tft_url = process.env.VUE_APP_BASE_API
  const kang_url = process.env.VUE_APP_BASE_API

  module.exports = {
    tft_url,
    kang_url
  }
}

