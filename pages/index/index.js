//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    value: "",
    active: 0,
    list: [{
      "text": "对话",
      "iconPath": "../../images/tabbar_icon_chat_default.png",
    "selectedIconPath": "../../images/tabbar_icon_chat_active.png",
      dot: true
  },
  {
      "text": "设置",
    "iconPath": "../../images/tabbar_icon_setting_default.png",
    "selectedIconPath": "../../images/tabbar_icon_setting_active.png",
      badge: 'New'
  }]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }
  },
  onChange: function(event) {
    wx.switchTab({
      url: '../mine/mine'
    })
    this.setData({ active: event.detail });
  },
  test() {
    app.globalData.vant.toast.loading({
      mask: true,
      message: '加载中...',
    });
  }
})
