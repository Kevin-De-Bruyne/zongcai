// pages/muster/job/job.js
const url = require('../../../utils/util.js');
const token = wx.getStorageSync('token');
const app = getApp();
Page({

/**
* 页面的初始数据
*/
data: {
	job:[]
},

/**
* 生命周期函数--监听页面加载
*/
onLoad: function (options) {
    url._post('api/index/jiuye',{
        token: app.globalData.token ? app.globalData.token : token
    }).then(res => {
        this.setData({job:res.list})
    }).catch(res => {
        //wx.showToast({ title:"网络访问错误", icon: 'none' })
    })
},

navst(res){
	wx.navigateTo({url: '/pages/muster/job/jobs/jobs?id='+res.currentTarget.dataset.item.id})
}
})