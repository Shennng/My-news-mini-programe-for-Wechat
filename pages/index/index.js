//index.js
const newsTypeMap = {
  '国内': 'gn',
  '国际': 'gj',
  '财经': 'cj',
  '娱乐': 'yl',
  '军事': 'js',
  '体育': 'ty',
  '其他': 'other'
}


Page({
  data: {
    //newsType：状态变量，显示当前的栏目名称，colorDesc负责改变栏目字体颜色为更亮的白色
    columnColor: { newsType: '国内', colorDesc:'color: #ffffff;' },
    No1Entry: {},  //头条文章概要
    restEntries: []  //其余文章概要
  },
  onLoad() {
    this.getEntries('国内');
    this.setNavigationBarColor();
  },
  onPullDownRefresh() {
    //下拉刷新，重新获取当前栏目文章概要
    let newsType = this.data.columnColor.newsType  //获取状态变量newsType
    this.getEntries(newsType, () => {
      wx.stopPullDownRefresh()
    })
  },
  setNavigationBarColor() {
    //导航栏颜色与栏目颜色一体化
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#2f9be4',
      animation: {
        duration: 500,
        timingFunc: "easeOut"
      }
    })
  },
  getEntries(newsType, callback) {
    //请求获取当前栏目下的所有文章摘要
    wx.request({
      url: 'https://test-miniprogram.com/api/news/list',
      data: {
        type: newsTypeMap[newsType]
      },
      success: res => {
        this.dealData(res)  //简单清洗数据
      },
      fail: res => {
        wx.showToast({
          title: '获取失败',
          image: "../../images/error_icon.png"
        })
      },
      complete: () => {
        callback && (callback(), wx.showToast({title: '刷新成功'}))
      }
    })
  },
  dealData(res) {
    let allEntries = res.data.result
    console.log(allEntries)
    for (let i = 0; i < allEntries.length; i++) {
      allEntries[i].date = allEntries[i].date.slice(12, 16)
      //若某文章来源为空，将source改为未知来源
      if (allEntries[i].source.length === 0) {
        allEntries[i].source = '未知来源'
      }
      //若某文章无首图，将firstImage改为默认图片
      if (allEntries[i].firstImage.length === 0) {
        allEntries[i].firstImage = '/images/default.jpg'
      }
    }
    //array.shift():删除数组的第一个元素，并返回这个元素
    let No1Entry = allEntries.shift()
    let restEntries = allEntries
    this.setData({
      No1Entry: No1Entry,
      restEntries: restEntries
    })
  },
  onTapGetEntriesAndChangeColor(event) {
    //点击栏目名称，触发该事件，获取该栏目的所有文章概要
    let newsType = event.currentTarget.dataset.newstype //获得newsType参数
    this.getEntries(newsType)  //wx.request
    this.setData({
      columnColor: {
        newsType: newsType,  //状态变量变更
        colorDesc: 'color: #ffffff;' },
    })
  },
  onTapNavigateToEntry(event) {
    //点击某文章条目(entry)，跳转到详情页entry.wxml
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../pages/entry/entry?id=' + id  //向entry传递参数：id
    })
  }
})
