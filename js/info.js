const loginUrl = "https://hexiaoling.cn/obk/dologin.php"  // 登录api

// 获取用户信息，用于缓存显示
var userInfo = sessionStorage.getItem('userInfo')

if (userInfo == null) {
  location.href = './index.html'
} else {
  userInfo = JSON.parse(userInfo)
}

var info = new Vue({
  el: '#info',
  data: {
    userInfo: {
      sid: sessionStorage.getItem('sid'),           // 学号
      name: userInfo.data.persondata.name,          // 姓名
      college: userInfo.data.persondata.college,    // 专业
      klass: userInfo.data.persondata.class + '班'  // 班级
    },
    loaded: false,                                  // 加载完毕
    activeName: null,                               // 需要打开的组织信息
    organizationInfo: userInfo.data.joinedgroupdata.map(function (item) {
      item.imgSrc = 'http://qr.liantu.com/api.php?text=https://item.lbinin.com/emptyTable/courseTable.html?id=' + item.groupno  // 组织二维码地址
      return item
    }),
    myCreateGroup: userInfo.data.mygroupdata.map(function (item) {
      item.imgSrc = 'http://qr.liantu.com/api.php?text=https://item.lbinin.com/emptyTable/courseTable.html?id=' + item.groupno  // 组织二维码地址
      return item
    }),
  },
  mounted: function () {
    const _this = this
    axios.get(loginUrl, {
      params: {
        sid: sessionStorage.getItem('sid'),
        password: sessionStorage.getItem('passwd')
      }
    })
      .then(function (response) {
        const data = response.data
        if (data.code == 0) {
          sessionStorage.setItem('userInfo', JSON.stringify(data))
          _this.organizationInfo = data.data.joinedgroupdata.map(function (item) {
            item.imgSrc = 'http://qr.liantu.com/api.php?text=https://item.lbinin.com/emptyTable/courseTable.html?id=' + item.groupno
            return item
          })
          _this.myCreateGroup = data.data.mygroupdata.map(function (item) {
            item.imgSrc = 'http://qr.liantu.com/api.php?text=https://item.lbinin.com/emptyTable/courseTable.html?id=' + item.groupno
            return item
          })
        } else {
          console.log('error')
        }
      })
      .catch(function (error) {
        console.log(error);
      })
  },
  methods: {
     /**
     * 退出登录
     */
    logout: function () {
      sessionStorage.removeItem('sid')
      sessionStorage.removeItem('passwd')
      sessionStorage.removeItem('userInfo')
      location.href = './index.html'
    },
     /**
     * 进入空课表页面
     */
    enterTable: function (id) {
      location.href = "./courseTable.html?id=" + id
    },
     /**
     * 创建组织
     */
    createGroup: function () {
      location.href = "./create.html"
    },
     /**
     * 加入组织
     */
    joinGroup: function () {
      location.href = "./join.html"
    }
  }
})

setTimeout(function () {
  info.loaded = true
}, 200)