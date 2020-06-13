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
    getUserInfo().then(({data}) => {
      this.globalData.userInfo = {
        id: data.id,
        username: data.username,
        realName: data.realName,
        photo: data.photo
      }
    })
  },
  globalData: {
    vant: {
      toast: Toast
    },
    userInfo: null
  }
})