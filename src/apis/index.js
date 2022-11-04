import HTTP from '@/utils/request'

export const login = () => {
  return HTTP.get({
    url: '/login'
  })
}

export const refreshToken = () => {
  return HTTP.post({
    url: '/refresh'
  })
}

export const authGet = () => {
  return HTTP.get({
    url: '/auth/get'
  })
}

export const authPost = () => {
  return HTTP.post({
    url: '/auth/post'
  })
}

export const authPut = () => {
  return HTTP.put({
    url: '/auth/put'
  })
}

export const authDelete = () => {
  return HTTP.delete({
    url: '/auth/delete'
  })
}

export const authDownload = () => {
  return HTTP.download({
    url: '/auth/download'
  })
}
export const authUpload = () => {
  return HTTP.upload({
    url: '/auth/upload'
  })
}
