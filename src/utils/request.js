import { refreshToken } from '@/apis'
import { isBuild, serverTypeEnums, serverTypeValues } from '@/constant'
import ErrorCode from '@/constant/error-code'
import { env } from '../../index'
import proxy from '../../webpack/proxy'

const defaultRequestService = serverTypeValues[0]

// 当前正在请求的接口队列
const HttpQueue = []
// 存储每个请求id,会被放在http queue中
let id = 0

// http: 请求使用uview-ui自带的luch-request请求，功能比uni.request完善
const http = uni.$u.http

// 请求默认10s后abort
const requestTimeoutTime = 10000

// 获取消息提示信息
function getMessage(result) {
  if (!result) return '系统异常'
  const code = result.code
  return ErrorCode[code] || result.message
}

// 全局配置
http.setConfig(config => {
  return config
})

// 请求拦截
http.interceptors.request.use(
  config => {
    // 鉴权处理
    const token = uni.getStorageSync('token')
    if (token) {
      config.header['token'] = token
    }
    return config
  },
  config => {
    return Promise.reject(config)
  }
)

// 刷新token相关变量
let isRefreshing = false
let cacheQueue = []

// 响应拦截
http.interceptors.response.use(
  response => {
    return response
  },
  async response => {
    const token = uni.getStorageSync('token')
    if (response.statusCode === 401 && token) {
      const config = response.config
      if (!isRefreshing) {
        isRefreshing = true
        return refreshToken().then(res => {
          const { token } = res.data
          uni.setStorageSync('token', token)
          cacheQueue.map(cb => cb(token))
          cacheQueue = []
          return service({
            ...config,
            url: config.custom.url
          })
            .catch(e => {
              console.error('refreshToken Error: ==>', e)
            })
            .finally(() => {
              isRefreshing = false
            })
        })
      } else {
        return new Promise(resolve => {
          cacheQueue.push(token => {
            resolve(
              service({
                ...config,
                url: config.custom.url
              })
            )
          })
        })
      }
    }
    return Promise.reject(response)
  }
)

// 缓存每一个任务
function getTaskOptions(task, options, params, currentId) {
  const { url, mask } = params
  if (mask) {
    HttpQueue.push({
      id: currentId,
      ajaxURL: url,
      task: task
    })
  }
}
function service(params) {
  let {
    // 预定义参数
    url = '',
    method = 'GET',
    data = {},
    headers = {},
    dataType = 'json',
    responseType = 'text',
    withCredentials = false,
    // 是否在报错时不提示
    silentOnError = false,
    // 是否需要显示loading
    mask = true,
    // 服务类型
    serverType = serverTypeEnums[defaultRequestService],
    // 超时时间
    timeout = requestTimeoutTime,
    ...extra
  } = params

  if (!serverTypeValues.includes(serverType)) {
    console.error(`服务类型错误，serverType当前仅支持${serverTypeValues.join('/')}`)
    return
  }

  // 如果接口前缀不包含/自动填充一个
  if (!url.startsWith('/')) {
    url = '/' + url
  }

  if (mask) {
    uni.showLoading({
      title: '加载中'
    })
  }

  // 请求自增
  id++

  return new Promise((resolve, reject) => {
    // 用于判断当前队列中有多少相同url请求的接口
    const apiInQueue = HttpQueue.filter(i => i.ajaxURL === url)
    if (apiInQueue.length > 1) {
      console.info('当前可能存在重复请求，请确认是否需要')
    }
    // 缓存当前请求的id
    const currentId = id

    const envPath = isBuild ? '' : `/${env}/${serverTypeEnums[serverType]}`
    let origin = isBuild ? '' : ''

    let requestURL = origin + envPath + url

    // 小程序、app需要带源地址
    // #ifdef MP-WEIXIN || APP-PLUS
    requestURL = getTargetFromProxy(envPath + url)
    // #endif

    // http.request存在this指向问题，通过bind将this重新指向到http
    let requestMethod = http.request.bind(http)
    let requestParams = {
      url: requestURL,
      method,
      data,
      header: headers,
      timeout,
      dataType,
      responseType,
      withCredentials,
      // 将params传给custom 方便拦截器获取
      custom: {
        ...params,
        currentId
      },
      getTask: (task, options) => getTaskOptions(task, options, params, currentId),
      ...extra
    }
    let args = [requestParams]
    if (method === 'DOWNLOAD') {
      requestMethod = http.download.bind(http)
      const { url, ...others } = requestParams
      args = [url, others]
    } else if (method === 'UPLOAD') {
      const { url, ...others } = requestParams
      requestMethod = http.upload.bind(http)
      args = [url, others]
    }
    requestMethod(...args)
      .then(res => {
        // 先执行hideLoading 避免请求报错toast直接hideLoading消失
        handlePromiseFinally(currentId)
        handlePromiseThen(resolve, reject, res, params)
      })
      .catch(e => {
        handlePromiseFinally(currentId)
        handlePromiseReject(resolve, reject, e, params)
      })
  })
}

function handlePromiseThen(resolve, reject, res, params) {
  const { silentOnError } = params
  if (res.statusCode === 200) {
    const result = res.data

    // 将后端的范围值中的code转换为Number
    if (result.code) {
      result.code = +result.code
    }
    // 接口失败
    if (result.code !== 200) {
      if (silentOnError) {
        resolve(res.data)
        return
      }
      uni.showToast({
        title: getMessage(result),
        icon: 'none',
        // 对于app 错误信息在底部弹出
        position: 'bottom'
      })
      reject(res)
    }
    resolve(res.data)
  }
  reject(res)
}

function handlePromiseReject(resolve, reject, e, params) {
  const data = e.data
  const { silentOnError } = params
  if (silentOnError) {
    resolve(e.data)
    return
  }
  uni.showToast({
    title: getMessage(data),
    icon: 'none',
    // 对于app 错误信息在底部弹出
    position: 'bottom'
  })
  reject(e)
}

function handlePromiseFinally(currentId) {
  // 无论成功还是失败，从正在请求的队列中，移除当前请求
  const index = HttpQueue.findIndex(htp => htp.id === currentId)
  if (index > -1) {
    HttpQueue.splice(index, 1)
  }
  if (HttpQueue.length === 0) {
    uni.hideLoading()
  }
}

function getTargetFromProxy(path = '') {
  let result
  for (const [key, value] of Object.entries(proxy)) {
    if (path.indexOf(key) > -1) {
      result = value
      break
    }
  }
  const origin = result.target
  let realPath = path
  if (result.pathRewrite) {
    for (const [key, value] of Object.entries(result.pathRewrite)) {
      const reg = new RegExp(key)
      if (reg.test(path)) {
        realPath = realPath.replace(reg, value)
        break
      }
    }
  }
  return origin + realPath
}

export default {
  get(params) {
    return service({
      ...params,
      method: 'GET'
    })
  },
  post(params) {
    return service({
      ...params,
      method: 'POST'
    })
  },
  delete(params) {
    return service({
      ...params,
      method: 'DELETE'
    })
  },
  put(params) {
    return service({
      ...params,
      method: 'PUT'
    })
  },
  upload(params) {
    return service({
      ...params,
      method: 'UPLOAD'
    })
  },
  download(params) {
    return service({
      ...params,
      method: 'DOWNLOAD'
    })
  }
}
