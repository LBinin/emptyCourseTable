const createUrl = "https://hexiaoling.cn/obk/creategroup.php" // 创建组织api

new Vue({
  el: '#create',
  data: {
    nameInput: '',            // 组织名称
    groupInfoVisible: false,  // 组织信息弹窗显示
    loading: false,           // 加载中
    loaded: false,            // 加载完毕
  },
  mounted: function () {
    this.loaded = true
  },
  methods: {
    /**
     * 创建组织，弹出确认对话框
     */
    createGroup: function () {
      if (this.nameInput == "") {
        this.alarm("请输入组织名称", 'warning')
      } else {
        this.groupInfoVisible = true
      }
    },
    /**
     * 消息提示
     * @param {String} msg 提示消息
     * @param {String} type 提示类型
     */
    alarm: function (msg, type) {
      this.$message({
        message: msg,
        type: type
      })
    },
     /**
     * 确认创建组织
     * @param {String} name 组织名称
     */
    ensureCreate: function (name) {
      // 确认创建
      const _this = this
      _this.loading = true
      axios.get(createUrl, {
        params: {
          sid: sessionStorage.getItem('sid'),
          password: sessionStorage.getItem('passwd'),
          groupname: name,
          role: 1,
          hash: 1
        }
      })
        .then(function (response) {
          const data = response.data
          _this.loading = false
          if (data.code == 0) {
            _this.alarm('创建成功', 'success')
            _this.groupInfoVisible = false
            setTimeout(function () {
              location.href = './info.html'
            }, 1000)
          } else {
            _this.alarm('加入组织失败，错误码: ' + data.code + '，失败原因: ' + data.msg, 'error')
          }
        })
        .catch(function (error) {
          _this.loading = false
          _this.alarm('加入组织失败，请稍后再试', 'error')
        })
    }
  }
})