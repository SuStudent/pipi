import {
  userInfoFormat
} from 'util.js';
const apiHttp = "http://192.168.2.197:8001/api";
const socketHttp = "wss://*****.com/wss";
const tokenKey = "wx_token_key"

/**
 * 添加自定义登录态header
 * @param {*} header 
 */
function addAuthorization(header) {
  header = header || {};
  let token = wx.getStorageSync(tokenKey);
  if (token) {
    if (!header || !header["Authorization"]) {
      header["Authorization"] = token;
    }
  }
  return header
}

/**
 * 请求拦截器
 * @param {*} url 
 * @param {*} method 
 * @param {*} data 
 * @param {*} header 
 */
function request(url, method, data, header) {
  data = data || {};
  header = addAuthorization(header)
  wx.showNavigationBarLoading();
  let promise = new Promise(function (resolve, reject) {
    wx.request({
      url: apiHttp + url,
      header: header,
      data: data,
      method: method,
      success: function (res) {
        if (res.data.success === false) {
          // 未登录
          if (res.data.status === 401) {
            if (isRefreshing) {
              login()
            }
            // 一个请求去登录即可，其他请求放在阻塞队列中，等待登录态
            isRefreshing = false
            const retryOriginalRequest = new Promise(() => {
              // 放入队列中
              addSubscriber(async () => {
                header["Authorization"] = ''
                let resData = await originalRequest(url, header, data, method)
                resolve(resData)
              })
            })
            return retryOriginalRequest
          }
          // 其他错误
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
          reject(res)
        }
        if(res.statusCode !== 200) {
          wx.showToast({
            title: '服务器异常: ' + res.errMsg,
            icon: 'none',
            duration: 1000
          })
          reject(res)
        }
        resolve(res.data)
      },
      fail: function (res) {
        wx.showToast({
          title: '服务器异常' + res.errMsg,
          icon: 'none',
          duration: 1000
        })
        reject(res)
      },
      complete: function () {
        wx.hideNavigationBarLoading();
      }
    });
  });
  return promise;
}

// 阻塞的请求集合
let subscribers = []

// 刷新token标志
let isRefreshing = true

/**
 * token 成功获取后操作
 */
function onAccessTokenFetched() {
  subscribers.forEach((callback) => {
    callback()
  })
  subscribers = []
  isRefreshing = true
}

// 添加阻塞请求
function addSubscriber(callback) {
  subscribers.push(callback)
}

/**
 * 构建原生请求
 * @param {*} url 
 * @param {*} header 
 * @param {*} data 
 * @param {*} method 
 */
function originalRequest(url, header, data, method) {
  return request(url, method, data, header)
}

/**
 * 登录
 */
function login() {
  wx.getSetting({
    success: settingRes => {
      if (!settingRes.authSetting['scope.userInfo']) {
        console.log("第一次登录，未点击授权")
        return;
      }
      wx.login({
        success: res => {
          // 登录要在 getUserInfo之前。login 可能会刷新登录态，导致sessionKey 并不是用来解密的sessionKey （概率性出现）
          wx.getUserInfo({
            withCredentials: true,
            success: userRes => {
              let userInfo = userRes
              userInfo = userInfoFormat(userInfo)
              // basic d2ViX2FwcDpjaGVycnk=   为Oauth2 客户端的 base64(client_id:client_secret)，密码模式登录
              post({
                url: "/auth/oauth/token?grant_type=wx_miniapp&scope=read&code=" + res.code,
                data: userInfo,
                header: {
                  'Authorization': 'basic d2ViX2FwcDpjaGVycnk='
                }
              }).then(res => {
                if (!res.token_type) {
                  wx.showToast({
                    title: '服务器异常，请重新登录',
                    icon: 'none',
                    duration: 1000
                  })
                }
                // 保存token
                wx.setStorageSync(tokenKey, `${res.token_type} ${res.access_token}`)
                onAccessTokenFetched()
              }).catch(res => {
                subscribers = []
                wx.showToast({
                  title: '服务器异常，登录失败',
                  icon: 'none',
                  duration: 1000
                })
              })
            }
          })
        }
      })
    }
  })
}

function convertUrl(url) {
  return url.startsWith("/") ? url : `/${url}`
}

/**
 * get 请求
 * @param {*} param0 
 */
function get({
  url,
  data,
  header
}) {
  url = convertUrl(url)
  if (data && data != {}) {
    url = url.indexOf('?') != -1 ? url : url + '?'
    for (let k in data) {
      url += `&${k}=${data[k]}`
    }
  }
  return request(url, "GET", {}, header);
}

/**
 * post 请求
 * @param {*} param0 
 */
function post({
  url,
  data,
  header
}) {
  header = header || {}; 
  if (!header['content-type']) {
    header['content-type'] = 'application/json'
  }
  return request(convertUrl(url), "POST", data, header);
}

module.exports = {
  apiHttp: apiHttp,
  socketHttp: socketHttp,
  get: get,
  post: post,
  login: login
};