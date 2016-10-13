// note.js
// 添加新任务界面
Page({
    data: {
        isAdd: true,
        task: {},
        isShowModal: false,
        modalContent: "",
        isShowLoading: false,
        isShowToast: false
    },
    onLoad: function (options) {
        if (options.type == "edit") {
            this.setData ({
                isAdd: false,
                task: getApp().getTaskByID (options.id)
            })
        }
    },
    onModalConfirm: function (e) {
        this.setData ({isShowModal: false})
    },
    onSubmit: function (e) {
        var data = e.detail.value
        if (!data.title || !data.content) {
            this.setData ({
                isShowModal: true,
                modalContent: "标题和内容不能为空"
            })
            return
        }
        this.setData ({isShowLoading: true})
        // 将数据发送到后台
        if (this.data.isAdd) {
            wx.request({
                url: 'https://localhost/wx/task.php?type=add',
                data: {
                    date: getApp().date,
                    title: data.title,
                    content: data.content
                },
                method: "POST",
                header: {'Content-Type': 'application/json'},
                success: this.onServerResponse,
            })
        }
        else {
            this.data.task.title = data.title
            this.data.task.content = data.content
            wx.request({
                url: 'https://localhost/wx/task.php?type=update',
                data: {
                    date: getApp().date,
                    task: this.data.task
                },
                method: "POST",
                header: {'Content-Type': 'application/json'},
                success: this.onServerResponse,
            })
        }
    },
    onServerResponse: function (res) {
        console.log (res.data)
        if (res.data.error) {
            this.setData ({
                isShowLoading: false,
                isShowModal: true,
                modalContent: res.data.error
            })
            return
        }
        this.setData ({
            isShowLoading: false,
            isShowToast: true
        })
        if (this.data.isAdd) {
            getApp().addTask (res.data.data)
        }
        else {
            getApp().updateTask (res.data.data)
        }
        setTimeout (this.toastFinish, 500)
    },
    // toast结束时调用的函数
    toastFinish: function () {
        this.setData ({isShowToast: false})
        wx.navigateBack ()
    }
})