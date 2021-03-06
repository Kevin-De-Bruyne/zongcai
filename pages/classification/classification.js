// pages/classification/classification.js
const API = require('../../utils/util.js');
const app = getApp();
Page({

/**
* 页面的初始数据
*/
data: {
    value:'',
    url: 'http://www.yumeili.com/',
    shops:[],
    items: ['综合', '新品', '评价'],
    arrow: true,
    moneydown:true,
    sai:['显示全部','仅看包邮','仅看有货','促销商品'],
    money:['0-500','500-1000','1000-1500','1500-2000','2000-2500','2500-3000'],
    down:false,
    title:'',
    taber:true,
    id:'',
    num:1,
    indOf:0,
    show: false,
    sort: '',
    sort_asc: '',
    spec: '',
    price: '',
    sel: '',
    topmoney:'',
    number:0,
    arr:[],
    xiaup:false,
    moneyup:false,
    conters:null,
    sales_sum:false,
    nvabarData: {
      showCapsule: 1,  //1表示显示    0表示不显示
      title: '分类筛选',   // 名片
      type: '1'
    },
    height: app.globalData.height * 2
},

/**
* 生命周期函数--监听页面加载
*/
onLoad: function (options) {
    if(options.value){
    this.setData({value:options.value});
    }
    if(options.id){
    this.setData({id:options.id});
    }
    if(options.conters){
    this.setData({conters:options.conters});
    }
    this.setData({title: this.data.items[0]});
    this.search();
},
search(){
    API._post('api/goods/goods_list',{
    id:this.data.id,
    q: this.data.value,
    sort: this.data.sort,
    sort_asc: this.data.sort_asc,
    spec: this.data.spec,
    price: this.data.price,
    sel: this.data.sel
    }).then(res => {
    if(res.status == 500){
    wx.showToast({ title: es.msg , icon: 'none'});
    }else{
    this.setData({
    shops:res.goods_list,
    arr: res.cateArr
    })
    }
    }).catch(res => {
    //wx.showToast({ title:"网络访问错误", icon: 'none' })
    });
},
bindKeyInput: function (e) {
    this.setData({
    value: e.detail.value
    })
},
clicktab(){
    this.setData({
    taber:(!this.data.taber)
    })
},
changeOil: function (e) {
    this.setData({
    num: e.currentTarget.dataset.num,
    sort:'',
    })
    if (this.data.num == 1) {
    this.setData({
    down: (!this.data.down)
    // arrow:(!this.data.arrow)
    })
    }
    if (this.data.num == 2) {
    this.setData({
    sort: "sales_sum",
    topmoney:false
    })
    this.search();
    }
    if (this.data.num == 3) {
    if (this.data.sort_asc == '' || this.data.sort_asc == 'desc'){
    this.setData({
    sort_asc: "asc",
    sort: "shop_price",
    topmoney:false
    })
    } else if (this.data.sort_asc == 'asc'){
    this.setData({
    sort_asc: "desc",
    sort: "shop_price",
    topmoney:true
    })
    }
    this.search();
    }
    if(this.data.num == 4){
    this.setData({
    show: true
    })
    }
},
change: function (e) {
    this.setData({
    indOf: e.currentTarget.dataset.index
    })
    if (this.data.indOf == 0) {
    this.setData({
    sort:'',
    title: this.data.items[0],
    down:false
    })
    this.search();
    } else if (this.data.indOf == 1) {
    this.setData({
    sort: 'is_new',
    title: this.data.items[1],
    down: false
    })
    this.search();
    } else if (this.data.indOf == 2) {
    this.setData({
    sort: 'comment_count',
    title: this.data.items[2],
    down: false
    })
    this.search();
    }
},
sai(e){
    this.setData({
    number: e.currentTarget.dataset.index
    })
},
onClose() {
    this.setData({ 
    show: false 
    });
},
fenlei(){
    this.setData({
    xiaup: (!this.data.xiaup),
    arrow: (!this.data.arrow)
    })
},
moneyclass() {
    this.setData({
    moneyup: (!this.data.moneyup),
    moneydown: (!this.data.moneydown)
    })
},
fenleishop(e){
    var fen = e.currentTarget.dataset.index;
    var fenlei = e.target.dataset.index;
    this.setData({
    id: this.data.arr[fen].sub_menu[fenlei].id,
    show:false
    })
    this.search();
},
thismoney(e){
    var mon = e.currentTarget.dataset.index;
    this.setData({
    price: this.data.money[mon],
    show: false
    })
    this.search();
},
})