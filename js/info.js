const loginUrl = "https://hexiaoling.cn/obk/dologin.php"

var userInfo = sessionStorage.getItem('userInfo')

if (userInfo == null) {
  location.href = './index.html'
} else {
  userInfo = JSON.parse(userInfo)
}
// sessionStorage.removeItem('sid')
// sessionStorage.removeItem('passwd')
// sessionStorage.removeItem('userInfo')

var info = new Vue({
  el: '#info',
  data: {
    userInfo: {
      sid: sessionStorage.getItem('sid'),
      name: userInfo.data.persondata.name,
      college: userInfo.data.persondata.college,
      klass: userInfo.data.persondata.class + '班',
    },
    loaded: false,
    activeName: null,
    organizationInfo: userInfo.data.joinedgroupdata.map(function (item) {
      item.imgSrc = 'http://qr.liantu.com/api.php?text=https://item.lbinin.com/emptyTable/courseTable.html?id=' + item.groupno
      return item
    }),
    myCreateGroup: userInfo.data.mygroupdata.map(function (item) {
      item.imgSrc = 'http://qr.liantu.com/api.php?text=https://item.lbinin.com/emptyTable/courseTable.html?id=' + item.groupno
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
    logout: function () {
      sessionStorage.removeItem('sid')
      sessionStorage.removeItem('passwd')
      sessionStorage.removeItem('userInfo')
      location.href = './index.html'
    },
    enterTable: function (id) {
      location.href = "./courseTable.html?id=" + id
    },
    createGroup: function () {
      location.href = "./create.html"
    },
    joinGroup: function () {
      location.href = "./join.html"
    }
  }
})

setTimeout(function () {
  info.loaded = true
}, 200)