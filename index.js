// 需要与根目录下的/webpack/proxy中的envs配置保持一致
const envEnums = {
  dev: 'dev',
  test: 'test',
  prod: 'prod'
}

const env = envEnums.dev

module.exports = {
  env,
  envEnums
}
