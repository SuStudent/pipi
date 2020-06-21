//index.js
//获取应用实例
import {generateUniqueStr} from "../../utils/util";
import {login} from "../../utils/request";

const app = getApp()
Page({
  data: {
    userInfo: null
  },
  onLoad(query) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    } else{
      app.userInfoReadyCallback = userInfo => {
        this.setData({
          userInfo: userInfo
        })
      }
    }
  },
  onShareAppMessage: function (res) {
    let roomNo = generateUniqueStr()
    setTimeout(() => {
      wx.navigateTo({
        url: `/pages/room/room?roomNo=${roomNo}`
      })
    }, 1000);
    return {
      path: `/pages/room/room?roomNo=${roomNo}`,
      title: 'I Love You',
      imageUrl: '/icons/guo.jpg'
    }
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  addRoom: function() {
    wx.navigateTo({
      url: '../addRoom/index'
    })
  },
  bindGetUserInfo: function(res) {
    login()
  },
  test() {
    app.globalData.vant.toast.loading({
      mask: true,
      message: '加载中...',
    });
  }
})
