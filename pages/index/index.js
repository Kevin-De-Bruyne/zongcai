//index.js
//获取应用实例
const token = wx.getStorageSync('token');
const app = getApp()
const API = require('../../utils/util.js');
var times = null;
import Toast from '../../vant/toast/toast';
Page({
    data: {
        value:'',
        navTab:[],
        swiper:[],
        scroll:[],
        shops:[], //热卖
        activity_goods:[], //活动
        time_goods:[], //限时
        recommend_goods:[], //推荐
        num: 2,
        newtimes: "23:59:59",
        nvabarData: {
          showCapsule: 1,  //1表示显示    0表示不显示
          title: '首页',   // 名片
          type: '1',
          showlist: '3'
        },
        height: app.globalData.height * 2,
        showicon:false,
        topNum:0
    },
    
    swipergoods(r){
        console.log(r.currentTarget.dataset.goods);
        wx.navigateTo({
            url: r.currentTarget.dataset.goods
        });
    },
    onLoad: function (options) {
        console.log(options)
        app.userLogin().then(res => {
            if(res == 1){
                API._post('api/Index/index',{
                    scenes: JSON.stringify(options),
                    token: app.globalData.token ? app.globalData.token : token
                }).then(res => {
                    this.setData({
                        swiper: res.banner,
                        navTab: res.nav,
                        scroll: res.primary_classification,
                        shops: res.hot_goods,
                        activity_goods: res.activity_goods,
                        time_goods: res.time_goods,
                        recommend_goods: res.recommend_goods
                    })
                    wx.setStorageSync('scenes',JSON.stringify(options))
                }).catch(res => {
                    //wx.showToast({ title:"网络访问错误", icon: 'none' })
                });
            }
        });
        // this.startTime()
    },
    liveGoGo(){
        let roomId = 20 // 填写具体的房间号，可通过下面【获取直播房间列表】 API 获取
    let customParams = encodeURIComponent(JSON.stringify({ path: 'pages/index/index', pid: 1 })) // 开发者在直播间页面路径上携带自定义参数（如示例中的path和pid参数），后续可以在分享卡片链接和跳转至商详页时获取，详见【获取自定义参数】、【直播间到商详页面携带参数】章节（上限600个字符，超过部分会被截断）
    wx.navigateTo({
    url: 'plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=21'
    })
    console.log(111)
    },
    /**
    * 生命周期函数--监听页面显示
    */
    onShow: function (options) {
        API._post('api/Index/index',{
            scenes: JSON.stringify(options),
            token: app.globalData.token ? app.globalData.token : token
        }).then(res => {
            this.setData({
                swiper: res.banner,
                navTab: res.nav,
                scroll: res.primary_classification,
                shops: res.hot_goods,
                activity_goods: res.activity_goods,
                time_goods: res.time_goods,
                recommend_goods: res.recommend_goods
            })
            wx.setStorageSync('scenes',JSON.stringify(options))
        }).catch(res => {
            //wx.showToast({ title:"网络访问错误", icon: 'none' })
        });
    },

    startTime(){
        var today = new Date();
        var h = today.getHours();
        var m = today.getMinutes();
        var s = today.getSeconds();
        m = this.checkTime(m);
        s = this.checkTime(s);
        this.setData({newtimes: h+":"+m+":"+s})
        times = setTimeout(this.startTime,1000);
    },

    checkTime(i){
        if (i<10){
            i="0" + i
        };
        return i;
    },


    goTop (r) {
        this.setData({topNum:0})
    },
    modeshop(r){
        // 0 热卖 1推荐 2活动 3限时
        var i = r.target.dataset.index;
        wx.navigateTo({
            url: '/pages/index/idetails/idetails?index='+i
        });
    },
    search(){
        if( this.data.value != ''){
            wx.navigateTo({
                url: '../classification/classification?value='+this.data.value
            })
        }else{
            Toast("搜索关键词不能为空！")
        }
    },
    bindKeyInput: function (e) {
        this.setData({value: e.detail.value})
    },

    upper(r) {
        this.setData({showicon:false});
    },

    scroll(r) {
        if(r.detail.scrollTop > 77){
            this.setData({showicon:true});
        }else{
            this.setData({showicon:false});
        }
    },
    liveGo(){
      wx.navigateTo({
        url: '/pages/live/live'
      })
        
    },
    handleContact(r){
        console.log(r.detail)
    },

    // 横向滑动
    scorll: function (r) {
        var data = r.currentTarget.dataset.index;
        if(r.currentTarget.dataset.index.id == 0){
            wx.switchTab({
                url:'/pages/class/class'
            })
        }else{
            wx.navigateTo({
                url: '../classification/classification?id=' + data.id +'&conters=' + data.name
            })
        }
            
    },
    navst(r) {
        var value= r.currentTarget.dataset.index;
        wx.navigateTo({
            url: value.menu_url
        })
    },
    gouser(){
        wx.switchTab({
            url:'/pages/personal/personal'
        })
    },
    /**
    * 用户点击右上角分享
    */
    onShareAppMessage: function (options) {
        var that = this;
        var shareObj = {
            title: "怀朴线上商城",
            path: '/pages/index/index',
            successs: res=>{
                wx.showToast({ title:"分享成功", icon: 'successs' })
            },
            fail: res=>{
                // 转发失败之后的回调
                if(res.errMsg == 'shareAppMessage:fail cancel'){

                }else if(res.errMsg == 'shareAppMessage:fail'){

                }
            }
        };
        if(options.from == 'button'){

        };
        return shareObj;
    },
})