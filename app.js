//app.js
import Toast from '@vant/weapp/toast/toast';
import {
  getUserInfo
} from 'apis/user.js';

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 获取登录信息，未登录会自动登录
    getUserInfo().then(({data}) => {
      this.globalData.userInfo = {
        id: data.id,
        username: data.username,
        realName: data.realName,
        photo: data.photo
      }
      if (this.userInfoReadyCallback) {
        this.userInfoReadyCallback(this.globalData.userInfo)
      }
    })




    wx.connectSocket({
      url: 'ws://192.168.2.197:8001/api/pipi/gameSocket/asdddd/1',//'ws://127.0.0.1:8005/gameSocket/asdddd/1',
      header: {
        "Authorization": wx.getStorageSync("wx_token_key")
      }
    })
    wx.onSocketOpen((result) => {
      wx.sendSocketMessage({
        data: JSON.stringify({
          "type": 'test',
          "username": '123',
          "sex": "asdfgh",
          "sendDate": Date.now()
        }),
      })
    })


    
  },
  globalData: {
    vant: {
      toast: Toast
    },
    userInfo: null
  }
})
