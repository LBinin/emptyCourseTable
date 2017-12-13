const loginUrl = "https://hexiaoling.cn/obk/dologin.php"
// const loginUrl = "https://api.sky31.com/lib-new/edu_student_info.php"

new Vue({
  el: '#login',
  data: {
    sidInput: '2015551403',
    passwdInput: 'lb905049701',
    loading: false
  },
  methods: {
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
            // role: 'test',
            // hash: 'test',
            sid: sid,
            password: passwd
          }
        })
          .then(function (response) {
            const data = response.data
            _this.loading = false
            console.log(data)
            if (data.code == 0) {
              _this.alarm('登录成功，' + data.data.persondata.name + '你好', 'success')
              sessionStorage.setItem('sid', _this.sidInput)
              sessionStorage.setItem('passwd', _this.passwdInput)
              sessionStorage.setItem('userInfo', JSON.stringify(data))
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
    alarm: function (msg, type) {
      this.$message({
        message: msg,
        type: type
      })
    }
  }
})