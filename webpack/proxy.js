const customProxy = {}

const urls = {
  devURL: {
    source1: 'http://127.0.0.1:7001',
    source2: 'http://dev.source2.com'
  },
  testURL: {
    source1: 'http://test.source1.com',
    source2: 'http://test.source2.com'
  },
  prodURL: {
    source1: 'http://prod.source1.com',
    source2: 'http://prod.source2.com'
  }
}

// 环境
const envs = ['dev', 'test', 'prod']
// 分布式部署服务路径
const services = ['source1', 'source2']

// 构建基础项目代理
function generateProxy() {
  return envs.reduce((envAcc, env) => {
    return services.reduce((serviceAcc, service) => {
      const basePath = `/${env}/${service}`
      const rewriteKey = `^${basePath}`
      serviceAcc[basePath] = {
        target: urls[`${env}URL`][service],
        pathRewrite: {
          [rewriteKey]: ''
        }
      }
      return serviceAcc
    }, envAcc)
  }, {})
}

module.exports = {
  ...customProxy,
  ...generateProxy()
}
