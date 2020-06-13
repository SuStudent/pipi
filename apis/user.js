import request from "../utils/request"

export function getUserInfo(){
  return request.get({
    url: '/auth/user/info'
  })
}