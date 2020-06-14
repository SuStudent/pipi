import {
  getRoomPage
} from "../../apis/room"

//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    keywords: "",
    latitude: "",
    longitude: "",
    pageNo: 1,
    rooms: [],
    allLoad: false
  },
  onReachBottom: function() {
    if(!this.data.allLoad) {
      this.setData({
        pageNo: this.data.pageNo + 1
      })
      this.getData()
    }
  },
  onShow: function() {
    let that = this
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        var latitude = res.latitude
        var longitude = res.longitude
        that.setData({
          latitude: latitude,
          longitude: longitude,
        })
      },
      complete: function() {
        that.setData({
          keywords: "",
          pageNo: 1,
          rooms: [],
          allLoad: false
        })
        that.getData()
      }
    })
  },
  getData() {
    wx.showLoading({
      title: '加载中',
    })
    getRoomPage({
      pageNo: this.data.pageNo,
      pageSize: 15,
      keywords: this.data.keywords,
      latitude: this.data.latitude,
      longitude: this.data.longitude
    }).then(res => {
      const {data} = res
      const newData = this.data.rooms.concat(data.entities)
      this.setData({
        rooms: newData,
        allLoad: data.pageNo == data.pageCount
      })
      wx.hideLoading()
    }).catch(res => {
      wx.hideLoading()
    })
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
  test() {
    app.globalData.vant.toast.loading({
      mask: true,
      message: '加载中...',
    });
  }
})
