//app.js
App({
  // 全局数据
  tasks: {},
  // 选择的日期
  date: "",
  // 使用服务器数据初始化
  initTasks: function (data) {
    if (data) {
      this.tasks = data
    }
  },
  // 更新日期
  setDate: function (date) {
    this.date = date
  },
  // 添加新任务(客服端维护修改)
  addTask: function (task) {
    if (!this.tasks[this.date]) {
      this.tasks[this.date] = []
    }
    this.tasks[this.date].push (task)
  },
  // 获取当日的任务列表
  getCurDateTaskList: function () {
    return this.tasks[this.date] ? this.tasks[this.date] : []
  },
  // 根据任务ID获取任务数据
  getTaskByID: function (id) {
    var list = this.tasks[this.date]
    for (var i=0; i<list.length; i++) {
      if (list[i].id == id) {
        return list[i];
      }
    }
    return {}
  },
  // 更新任务
  updateTask: function (task) {
    for (var i=0; i<this.tasks[this.date].length; i++) {
      if (this.tasks[this.date][i].id == task.id) {
        this.tasks[this.date][i] = task
        break;
      }
    }
  },
  onLaunch: function () {
    // do nothing
  },
})