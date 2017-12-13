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
    organizationInfo: userInfo.data.groupdata.map(function (item) {
      item.imgSrc = 'https://tool.oschina.net/action/qrcode/generate?data=http%3A%2F%2Fitem.lbinin.com%2FemptyTable%2FcourseTable.html%3Fid%3D' + item.groupno + '&output=image%2Fjpeg&error=L&type=0&margin=0&size=4'
      return item
    }),
  },
  mounted: function () {
    const _this = this
    axios.get(loginUrl, {
      params: {
        // role: 'test',
        // hash: 'test',
        sid: sessionStorage.getItem('sid'),
        password: sessionStorage.getItem('passwd')
      }
    })
      .then(function (response) {
        const data = response.data
        if (data.code == 0) {
          sessionStorage.setItem('userInfo', JSON.stringify(data))
          _this.organizationInfo = data.data.groupdata.map(function (item) {
            item.imgSrc = 'https://tool.oschina.net/action/qrcode/generate?data=http%3A%2F%2Fitem.lbinin.com%2FemptyTable%2FcourseTable.html%3Fid%3D' + item.groupno + '&output=image%2Fjpeg&error=L&type=0&margin=0&size=4'
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