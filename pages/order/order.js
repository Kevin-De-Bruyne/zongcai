// pages/order/order.js
const url = require('../../utils/util.js');
const token = wx.getStorageSync('token');
const app = getApp();
var dis = false;
var dis_ = false;
import Dialog from '../../vant/dialog/dialog';
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		active: 0,
		shop:[],
		nvabarData: {
          showCapsule: 1,  //1表示显示    0表示不显示
          title: '订单',   // 名片
          type: '1',
          showlist:'2'
        },
        height: app.globalData.height * 2
	},


	/** all_status
		1 待付款 
		2 待发货
		3 已取消
		4 已申请退款
		5 退款成功
		6 退款拒绝
		7 待收货
		8 待评价
		9 已完成
	**/

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		if(options.id){
			this.setData({active: Number(options.id)})
		}
		this.getlist();
	},
	getlist(){
		url._post('api/user/order_list',{
			token: app.globalData.token ? app.globalData.token : token,
		}).then(res => {
			for(var i in res.order){
				if(res.order[i].msg == "待付款"){
					this.update(res.order[i].order_id)
				}
			}
			this.setData({
				shop: res.order
			})
		}).catch(res => {
            //wx.showToast({ title:"网络访问错误", icon: 'none' })
        })
	},
	// 更新订单状态
	update(order_id){
		console.log(order_id)
		url._post('api/cart/update_order',{
			token: app.globalData.token ? app.globalData.token : token,
			id: order_id
		}).then(res => {
			// console.log(res)
			if(res.status == "t"){
				this.getlist();
			}
		}).catch(res => {
            //wx.showToast({ title:"网络访问错误", icon: 'none' })
        })
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		this.getlist();
	},


	onChange(event) {
		// wx.showToast({
		// 	title: `切换到标签 ${event.detail.index + 1}`,
		// 	icon: 'none'
		// });
	},
	onappraise(e){
		wx.navigateTo({
			url: "/pages/assess/assess"
		})
	},
	logistics(r){
		wx.navigateTo({
			url: "/pages/logistics/logistics?order_id="+r.target.dataset.item.order_id
		})
	},
	onrecall(e){
		Dialog.confirm({
			title: '提示',
			message: '是否确定取消订单',
		})
		.then(() => {
			url._post('api/user/cancel_order', {
				token: app.globalData.token ? app.globalData.token : token,
				id: e.target.dataset.item.order_id
			}).then(res => {
				wx.showToast({ title: res.msg, icon: 'none' });
				this.getlist();
			}).catch(res => {
	            //wx.showToast({ title:"网络访问错误", icon: 'none' })
	        })
		})
		.catch(() => {
			
		});
	},
	onpay(e){
		if(dis_){return false};
		dis_ = true;
		setTimeout(()=>{
			dis_ = false;
		},2500)
		var _this = this;
		url._post('api/pay/weixinpay',{
            token: app.globalData.token ? app.globalData.token : token,
            money: e.target.dataset.item.order_amount,
            order_id: e.target.dataset.item.order_id,
            order_sn: e.target.dataset.item.order_sn
        }).then(res => {
            wx.requestPayment({
                'timeStamp': res.data.timeStamp,
                'nonceStr': res.data.nonceStr,
                'package': res.data.package,
                'signType': res.data.signType,
                'paySign': res.data.paySign,
                success: function (res) {

                },
                fail: function (res) {

                },
                complete: function (res) {
                    if (res.errMsg == 'requestPayment:ok') {
                        wx.showToast({ title:"支付成功", icon: 'none' })
                    }
                    _this.getlist();
                }
            })
        }).catch(res => {
            //wx.showToast({ title:"网络访问错误", icon: 'none' })
        })
	},
	reimburse(e){
		wx.navigateTo({
			url: "/pages/order/recall/recall?order_id="+e.target.dataset.item.order_id
		})
	},
	schedule(e){
		wx.navigateTo({
			url: "/pages/order/schedule/schedule?order_id="+e.target.dataset.item.order_id
		})
	},
	detail(e){
		var index = e.currentTarget.dataset['index'];
		wx.navigateTo({
			url: "/pages/order/detail/detail?order_id="+this.data.shop[index].order_id
		})
	},
	receipt(e){
		if(dis){return false};
		dis = true;
		setTimeout(()=>{
			dis = false;
		},2500)
		url._post('api/user/order_confirm',{
			token: app.globalData.token ? app.globalData.token : token,
			id: e.target.dataset.item.order_id
		}).then(res => {
			wx.showToast({ title: res.msg, icon: 'none' })
			this.getlist();
		})
	},
	//复制
	copyText(r){
	    var text= r.target.dataset.invoice_no;
	    if(text){
	    	wx.setClipboardData({
		        data: text,
		        success:res=>{
		            wx.getClipboardData({
		                success:res=>{
		                    // wx.showToast({ title: "复制成功", icon: 'success' })
		                }
		            })
		        }
		    })
	    }else{
	    	wx.showToast({ title:"暂无订单号，复制失败", icon: 'none' })
	    }
	},
})