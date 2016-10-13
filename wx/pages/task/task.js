// task.js
// 界面逻辑
Page({
  data: {
      task: {},
      isShowModal: false,
      modalContent: "",
      isShowLoading: false,
      isShowToast: false
  },
  onLoad: function (options) {
      this.setData ({task: getApp().getTaskByID (options.id)})
  },
  onShow: function () {
      this.syncTaskData ()
  },
  // 更新task数据
  syncTaskData: function () {
      if (this.data.task) {
        this.setData ({task: getApp().getTaskByID (this.data.task.id)})
      }
  },
  editTask: function (e) {
    wx.navigateTo({
      url: "../note/note?type=edit&id=" + this.data.task.id
    })
  },
  finishTask: function (e) {
      if (!this.data.task) {
          console.log ("empty task?")
          return
      }
      this.data.task.isDone = true
      wx.request({
          url: 'https://localhost/wx/task.php?type=update',
          data: {
              date: getApp().date,
              task: this.data.task
          },
          method: "POST",
          header: { 'Content-Type': 'application/json' },
          success: this.onServerResponse,
      })
  },
  onServerResponse: function( res ) {
      if( res.data.error ) {
          this.setData( {
              isShowLoading: false,
              isShowModal: true,
              modalContent: res.data.error
          })
          return
      }
      this.setData( {
          isShowLoading: false,
          isShowToast: true
      })
      getApp().updateTask( res.data.data )
      setTimeout( this.toastFinish, 500 )
  },
  // 提示弹窗
  onModalConfirm: function( e ) {
      this.setData ({isShowModal: false})
  },
  // toast结束时调用的函数
  toastFinish: function() {
      this.setData( { isShowToast: false })
      wx.navigateBack()
  }
})