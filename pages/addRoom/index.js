import {
  saveRoom
} from "../../apis/room"
// pages/addRoom/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    password: '',
    description: '',
    latitude: '',
    longitude: '',
    nameError: false,
    descriptionError: false,
    btnLoading: false,
    RoomNo: ''
  },
  onValueChange: function (e) {
    if (e.currentTarget.dataset.prop == 'name') {
      let flag = true
      if (e.detail) {
        flag = false
      }
      this.setData({
        nameError: flag
      })
    }
    if (e.currentTarget.dataset.prop == 'description') {
      let flag = true
      if (e.detail) {
        flag = false
      }
      this.setData({
        descriptionError: flag
      })
    }
    this.setData({
      [e.currentTarget.dataset.prop]: e.detail
    })
  },
  save: function () {
    if (!this.data.name) {
      this.setData({
        nameError: true
      })
      return
    }
    if (!this.data.description) {
      this.setData({
        descriptionError: true
      })
      return
    }
    this.setData({
      btnLoading: true
    })
    saveRoom({
      name: this.data.name,
      password: this.data.password,
      description: this.data.description,
      latitude: this.data.latitude,
      longitude: this.data.longitude
    }).then(res => {
      this.setData({
        btnLoading: false
      })
      wx.showToast({
        title: '保存成功',
        icon: 'none',
        duration: 1000,
        success: function() {
          wx.navigateBack({
            delta: 1
          })
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    if(options.RoomNo){
        _this.setData({
            RoomNo : options.RoomNo
        })
    }

    if(_this.data.RoomNo == ''){
        _this.data.RoomNo = Math.floor(Math.random()*10000);
    }

    wx.connectSocket({
        url: "ws://127.0.0.1:8500/gameSocket/" + _this.data.RoomNo
    })

    if (app.globalData.userInfo) {
        this.setData({
            userInfo: app.globalData.userInfo,
            hasUserInfo: true
        })
    } else if (this.data.canIUse){
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        app.userInfoReadyCallback = res => {
            this.setData({
                userInfo: res.userInfo,
                hasUserInfo: true
            })
        }
    } else {
        // 在没有 open-type=getUserInfo 版本的兼容处理
        wx.getUserInfo({
            success: res => {
                app.globalData.userInfo = res.userInfo
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        var latitude = res.latitude
        var longitude = res.longitude
        this.setData({
          latitude: latitude,
          longitude: longitude
        })
      }
    })
    this.setData({
      btnLoading: false
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getUserInfo: function(e) {
      console.log(e)
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
          userInfo: e.detail.userInfo,
          hasUserInfo: true
      })
  }
})