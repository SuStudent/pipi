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
    btnLoading: false
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

  }
})