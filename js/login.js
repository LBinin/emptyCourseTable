const loginUrl = "https://hexiaoling.cn/obk/dologin.php" // 登录Api

new Vue({
  el: '#login',
  data: {
    sidInput: '',     // 学号
    passwdInput: '',  // 教务密码
    loading: false    // 加载中
  },
  methods: {
    /**
     * 登录
     */
    login: function () {
      const sid = this.sidInput
      const passwd = this.passwdInput
      if (sid == "") {
        this.alarm("请输入您的学号", 'warning')
      } else if (passwd == "") {
        this.alarm("请输入您的教务密码", 'warning')
      } else {
        this.loading = true
        const _this = this
        axios.get(loginUrl, {
          params: {
            sid: sid,
            password: passwd
          }
        })
          .then(function (response) {
            const data = response.data
            _this.loading = false
            if (data.code == 0) {
              _this.alarm('登录成功，' + data.data.persondata.name + '你好', 'success')
              // 设置session
              sessionStorage.setItem('sid', _this.sidInput)
              sessionStorage.setItem('passwd', _this.passwdInput)
              sessionStorage.setItem('userInfo', JSON.stringify(data))
              // 跳转info
              setTimeout(function () {
                window.location.href = "./info.html"
              }, 1000)
            } else {
              _this.alarm(data.msg, 'error')
            }
          })
          .catch(function (error) {
            console.log(error);
          })
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
    }
  }
})