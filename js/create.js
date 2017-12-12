const createUrl = "http://hexiaoling.cn/obk/creategroup.php"

new Vue({
  el: '#create',
  data: {
    nameInput: '',
    groupInfoVisible: false,
    loading: false,
    loaded: false,
  },
  mounted: function () {
    this.loaded = true
  },
  methods: {
    createGroup: function () {
      const groupName = this.nameInput
      if (groupName == "") {
        this.alarm("请输入组织名称", 'warning')
      } else {
        console.log('111')
        this.groupInfoVisible = true
      }
    },
    alarm: function (msg, type) {
      this.$message({
        message: msg,
        type: type
      })
    },
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
            // var userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
            // userInfo.data.groupdata = data.data.groupinfo
            // sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
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
          console.dir(data)
        })
    }
  }
})