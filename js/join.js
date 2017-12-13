// const loginUrl = "https://api.sky31.com/GongGong/login.php"
const searchUrl = "https://hexiaoling.cn/obk/groupinfo.php"
const joinGroupUrl = "https://hexiaoling.cn/obk/joingroup.php"

if (sessionStorage.getItem('userInfo') == null) {
  location.href = './index.html'
}

new Vue({
  el: '#join',
  data: {
    idInput: '',
    groupInfoVisible: false,
    loading: false,
    loaded: false,
    groupInfo: {}
  },
  mounted: function () {
    this.loaded = true

    const request = getQuest()
    const _this = this
    setTimeout(function() {
      _this.idInput = request['id']
      _this.searchGroup()
    },300)
  },
  methods: {
    searchGroup: function () {
      const groupID = this.idInput
      if (groupID == "") {
        this.alarm("请输入组织ID", 'warning')
      } else {
        this.loading = true
        const _this = this
        axios.get(searchUrl, {
          params: {
            groupno: _this.idInput,
            hash: 1,
            role: 1,
          }
        })
          .then(function (response) {
            const data = response.data
            _this.loading = false
            if (data.code == 0) {
              _this.groupInfoVisible = true
              _this.groupInfo = {
                gname: data.data.gname,
                founder: data.data.founder,
                peoplenum: data.data.peoplenum,
                groupno: data.data.groupno
              }
            } else {
              _this.alarm('获取组织信息失败，错误码: ' + data.code + '，失败原因: ' + data.msg, 'error')
            }
          })
          .catch(function (error) {
            _this.loading = false
            _this.alarm('获取组织信息出错，请稍后再试', 'error')
            console.dir(data)
          })
      }
    },
    alarm: function (msg, type) {
      this.$message({
        message: msg,
        type: type
      })
    },
    joinGroup: function (id, name) {
      const _this = this
      this.$confirm('确认加入 ' + name + ' ?')
        .then(function () {
          // 加入组织
          _this.loading = true

          axios.get(joinGroupUrl, {
            params: {
              sid: sessionStorage.getItem('sid'),
              group_id: id,
              password: sessionStorage.getItem('passwd')
            }
          })
            .then(function (response) {
              const data = response.data
              _this.loading = false
              if (data.code == 0) {
                _this.alarm('加入成功', 'success')
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
        })
        .catch(function () {
          // 取消加入
        })
    }
  }
})

function getQuest() {
  var search = window.location.search
  search = search.substr(1)
  search = search.split('&')
  var request = []
  for (item in search) {
    const temp = search[item].split('=')
    request[temp[0]] = temp[1]
  }
  return request
}