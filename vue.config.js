const proxy = require('./webpack/proxy')

module.exports = {
  transpileDependencies: ['uview-ui'],
  devServer: {
    proxy
  },
  chainWebpack: config => {
    return config
  }
}
