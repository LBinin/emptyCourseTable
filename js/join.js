const searchUrl = "https://hexiaoling.cn/obk/groupinfo.php"     // 查询组织信息api
const joinGroupUrl = "https://hexiaoling.cn/obk/joingroup.php"  // 加入组织信息api

// 检测登录
if (sessionStorage.getItem('userInfo') == null) {
  location.href = './index.html'
}

new Vue({
  el: '#join',
  data: {
    idInput: '',              // 组织id
    groupInfoVisible: false,  // 组织信息弹框可见
    loading: false,           // 加载中
    loaded: false,            // 加载完毕
    groupInfo: {}             // 组织信息
  },
  mounted: function () {
    this.loaded = true
    // 获取query
    const request = getQuest()
    // 如果有id参数则开始搜索
    if (typeof (request['id']) != 'undefined') {
      const _this = this
      setTimeout(function () {
        _this.idInput = request['id']
        _this.searchGroup()
      }, 300)
    }
  },
  methods: {
    /**
     * 查询组织
     */
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
     * 加入组织
     * @param {String} id 组织id
     * @param {String} name 组织名称
     */
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
/**
 * 获取参数
 * @return {String[]} request url解析后的的query数组
 */
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