// pages/entry/entry.js
Page({
  data: {
    allNodes: [],  //分块存储文章内容中所有的段落（节点）
    details: {}  //存储除去文章内容外文章的title、source、date等
  },
  onLoad(options) {
    let id = options.id
    this.getDetails(id)
  },
  getDetails(id, callback) {
    //按id请求文章详情
    wx.request({
      url: 'https://test-miniprogram.com/api/news/detail',
      data: {
        id: id
      },
      success: res => {
        let content = res.data.result.content
        this.dealData(res)
        this.setNodes(content)
      },
      fail: res => {
        wx.navigateBack({
          url:"../../pages/index/index"
        })
        wx.showToast({
          title: '获取失败',
          image: "../../images/error_icon.png"
        })
      },
      complete: () => {
        callback && callback()
      }
    })
  },
  dealData(res) {
    //清洗数据
    delete res.data.result.content  //删去content，留下的赋值给details
    let details = res.data.result
    details.date = details.date.slice(12, 16)
    //若文章来源为空，将source改为未知来源
    if (details.source.length === 0) {
      details.source = '未知来源'
    }
    this.setData({
      details: details
    })
  },
  setNodes(content) {
    //将所有节点格式化分快存储
    let allNodes = []
    for (let i = 0; i < content.length; i++) {
      if (content[i].type !== 'image') {
        allNodes.push(`<${content[i].type}>${content[i].text}</${content[i].type}>`)
      } else {
        allNodes.push(`<img src="${content[i].src}" style="max-width:100%;height:auto"></img>`)
      }
    }
    this.setData({
      allNodes: allNodes
    })
  }
})