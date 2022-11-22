const proxy = require('./webpack/proxy')
const path = require('path')
const AutoCleanPlugin = require('./webpack/auto-clean')

function resolve(url) {
  return path.resolve(__dirname, url)
}

module.exports = {
  transpileDependencies: ['uview-ui'],
  devServer: {
    proxy
  },
  chainWebpack: config => {
    config.resolve.alias.set('@', resolve('./src'))

    if (process.env.VUE_APP_PLATFORM === 'mp-weixin') {
      config.module
        .rule('vue')
        .use('vue-loader')
        .end()
        .use('customImageLoader')
        .loader(resolve('./webpack/custom-image-loader.js'))
        .end()

      config.plugin('autoCleanPlugin').use(AutoCleanPlugin)
    }

    return config
  }
}
