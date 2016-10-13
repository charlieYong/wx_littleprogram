//index.js
// 界面逻辑
Page({
  data: {
    dayDiff: 0,
    date: "",
    isDataOk: false,
    tasks: []
  },
  onLoad: function (options) {
    this.updateCurDate ()
    // 从服务器获取数据
    this.getTasksFromServer ()
  },
  onShow: function () {
    // 展示页面时，更新数据（如从其他界面返回时）
    this.syncTasksData ()
  },
  updateCurDate: function () {
    var d = new Date ()
    if (this.data.dayDiff != 0) {
      d.setDate (d.getDate () + this.data.dayDiff)
    }
    var year = d.getFullYear()
    var month = d.getMonth() + 1
    var day = d.getDate()
    var date = year.toString() + month.toString() + day.toString()
    this.setData ({date: date})
    getApp().setDate (date)
  }, 
  // 同步tasks数据
  syncTasksData: function () {
    this.setData ({
        tasks: getApp ().getCurDateTaskList ()
    })
  },
  // 事项被点击
  itemOnClick: function(e) {
    wx.navigateTo ({
      url: "../task/task?id=" + e.target.id
    })
  },
  getTasksFromServer: function () {
      wx.request({
      url: 'https://localhost/wx/task.php?type=get',
      header: {'Content-Type': 'application/json'},
      success: this.onServerResponse,
    })
  },
  onServerResponse: function (ret) {
    if (ret.data.data) {
      getApp().initTasks (ret.data.data)
      this.syncTasksData ()
    }
    this.setData ({isDataOk: true})
  },
  addNewTask: function(e) {
    wx.navigateTo({
      url: "../note/note?type=add"
    })
  }
})
