// 需要与根目录下的/webpack/proxy中的services配置保持一致
export const serverTypeEnums = {
  source1: 'source1',
  source2: 'source2'
}

export const serverTypeValues = Object.keys(serverTypeEnums)

export const isBuild = process.env.NODE_ENV === 'production'
