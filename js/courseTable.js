const url = "https://www.hexiaoling.cn/obk/ecourse.php"

function getInfo(id, week) {
  axios.get(url, {
    params: {
      'group_id': id,
      'target_week': week,
      'hash': 'test',
      'role': 'test'
    }
  })
    .then(function (response) {
      const data = response.data

      if (data.code == 0) {
        courseTable.json = data
        courseTable.loading = false
        setTimeout(function () {
          courseTable.loaded = true
        }, 200)
      } else if (data.code == 1) {
        // 用户信息获取失败
        courseTable.alarm('用户信息获取失败，请刷新重试', 'warning')
      } else if (data.code == 2) {
        // 课表获取失败
        courseTable.alarm('课表获取失败，请刷新重试', 'warning')
      } else if (data.code == 4) {
        courseTable.alarm('没有找到该组织，请确认后重试', 'warning')
        courseTable.error = true
        courseTable.errorMsg = '出错啦，该组织被外星人带走了!'
      }
    })
    .catch(function (error) {
      courseTable.loading = false
      setTimeout(function () {
        courseTable.loaded = true
      }, 200)
      console.dir(data)
    })
}

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

var courseTable = new Vue({
  el: '#app',
  data: {
    groupID: 0,
    totalPerson: 0,
    members: [],
    courseInfo: [],
    tableType: "emptyTable",
    json: [],
    currWeek: 0,
    loading: false,
    loaded: false,
    request: [],
    error: false,
    joined: false,
    errorMsg: ''
  },
  created: function () {
    // 获取参数内容
    const request = getQuest()

    // 错误检测
    if (typeof (request['week']) == 'undefined') {
      request['week'] = 1 // 默认第一周
    }
    if (typeof (request['id']) == 'undefined' || parseInt(request['id']) < 0) {
      this.alarm('参数错误，请检查链接参数', 'error')
      this.error = true
      this.errorMsg = '出错啦，好像少了点什么...'
      return
    }

    // 初始化数据
    this.request = request
    this.groupID = parseInt(this.request['id'])
    this.currWeek = parseInt(this.request['week'])

    // 获取数据
    getInfo(this.request['id'], this.request['week'])
  },
  mounted: function () {
    // 监听事件
    const _this = this
    window.addEventListener('popstate', function (e) {
      const request = getQuest()

      // 错误检测
      if (typeof (request['week']) == 'undefined') {
        request['week'] = 1 // 默认第一周
      }
      if (typeof (request['id']) == 'undefined' || parseInt(request['id']) < 0) {
        _this.alarm('参数错误，请检查链接参数', 'error')
        _this.error = true
        return
      }

      // 初始化数据
      _this.request = request
      _this.groupID = parseInt(_this.request['id'])
      _this.currWeek = parseInt(_this.request['week'])

      // 获取数据
      getInfo(_this.request['id'], _this.request['week'])
    })
  },
  methods: {
    showInfo: function (style) {
      var info = [{
        section: '1-2节'
      }, {
        section: '3-4节'
      }, {
        section: '5-6节'
      }, {
        section: '7-8节'
      }, {
        section: '9-11节'
      }]
      var week = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      var _course = this.json.data[style]
      for (const weekday in _course) {
        const element = _course[weekday]
        for (const sector in element) {
          const grid = element[sector]
          const currWeekday = parseInt(weekday)
          const currSector = parseInt(sector)
          info[currSector - 1][week[currWeekday - 1]] = grid['peoplelist'].join(', ')
        }
      }
      this.courseInfo = info
    },
    alarm: function (msg, type) {
      this.$message({
        message: msg,
        type: type,
      })
    },
    home: function () {
      location.href = './info.html'
    },
    join: function() {
      location.href = './join.html?id=' + this.groupID
    }
  },
  watch: {
    tableType: function (type) {
      this.showInfo(type)
    },
    currWeek: function (curr) {
      this.loading = true
      getInfo(this.groupID, curr)

      const newUrl = location.pathname + '?id=' + this.groupID + '&week=' + this.currWeek
      console.log(newUrl)
      const oldTitle = '组织空课表' + ' - 第' + this.currWeek + '周'
      console.log(oldTitle)
      document.title = oldTitle
      history.pushState({}, oldTitle, newUrl)
    },
    json: function () {
      const peopleList = this.json.data['peopleList']
      if (peopleList.length == 0) {
        this.joined = true
        return
      }
      this.totalPerson = peopleList.namelist.length
      this.members = peopleList.namelist.length == 0 ? "无" : peopleList.namelist.join(', ')
      if (sessionStorage.getItem('sid') == null || peopleList.sidlist.indexOf(String(sessionStorage.getItem('sid'))) == -1) {
        this.joined = true
      } else {
        this.joined = false
      }

      this.showInfo(this.tableType)
    }
  }
})

var store = {
  debug: true,
  state: {
    message: 'Hello!'
  },
  setMessageAction(newValue) {
    if (this.debug) console.log('setMessageAction triggered with', newValue)
    this.state.message = newValue
  },
  clearMessageAction() {
    if (this.debug) console.log('clearMessageAction triggered')
    this.state.message = ''
  }
}