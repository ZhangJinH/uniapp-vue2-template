const { env } = require('../index')

const imageSources = {
  dev: 'https://dev.source.com/aaa/',
  test: 'https://test.source.com/aaa/',
  prod: 'https://prod.source.com/aaa/'
}

module.exports = function (source) {
  let imageSource = imageSources[env]
  return source.replace(/@\/static\/oss\/images\//g, imageSource)
}
