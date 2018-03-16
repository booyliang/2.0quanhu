import wx from 'weixin-js-sdk';
import http from './http'

let hasConfig = {};
let wxWarpper = {

	async wxConfig(url) {
		return new Promise(async (resolve, reject) => {
			url = url || window.location.href.split("#")[0];
			if (hasConfig[url]) {
				resolve();
				return
			}
			let res = await http.get(`/services/wx/v1/api/config/getConfig?url=${encodeURIComponent(url)}`);
			let body = res.data;
			if (body.code !== '200') {
				reject(body.errorMsg);
				return
			}
			let data = body.data;
			wx.config({
				debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				appId: data.appid, // 必填，公众号的唯一标识
				timestamp: data.timestamp, // 必填，生成签名的时间戳
				nonceStr: data.noncestr, // 必填，生成签名的随机串
				signature: data.signature, // 必填，签名，见附录1
				jsApiList: [
					'onMenuShareAppMessage',
					'onMenuShareQQ',
					'onMenuShareWeibo',
					'onMenuShareQZone',
					'onMenuShareTimeline',
					'hideMenuItems',
					'showMenuItems',
					'hideAllNonBaseMenuItem',
					'showAllNonBaseMenuItem'
				] // 必填，需要使用的JS接口列表，
			});
			wx.ready(() => {
				hasConfig[url] = true;
				// alert(url || window.location.href.split("#")[0])
				resolve();
			})
			wx.error(() => {
				console.log('wx加载出错');
				// alert(url || window.location.href.split("#")[0])
				reject();
			});
		})

	},
	async checkJsApi(apiList) {
		await this.wxConfig();
		return new Promise(async (resolve, reject) => {
			wx.checkJsApi({
				jsApiList: apiList, // 需要检测的JS接口列表，所有JS接口列表见附录2,
				success: (res) => {
					let { checkResult = {} } = res
					for (let api in checkResult) {
						if (!checkResult[api]) {
							reject();
							return;
						}
					}
					resolve();
				},

				error: async () => {
					await this.wxConfig();
					resolve();
				}


			})
		})
	},
	async  onMenuShareTimeline(shareData) {
		await this.checkJsApi(['onMenuShareTimeline'])
		wx.onMenuShareTimeline(shareData);
	},
	async  onMenuShareAppMessage(shareData) {
		await this.checkJsApi(['onMenuShareAppMessage'])
		wx.onMenuShareAppMessage(shareData);
	},
	async  onMenuShareQQ(shareData) {
		await this.checkJsApi(['onMenuShareQQ'])
		wx.onMenuShareQQ(shareData);
	},
	async  onMenuShareWeibo(shareData) {
		await this.checkJsApi(['onMenuShareWeibo'])
		wx.onMenuShareWeibo(shareData);
	},
	async hideAllNonBaseMenuItem() {
		await this.checkJsApi(['hideAllNonBaseMenuItem'])
		
		wx.hideAllNonBaseMenuItem({
			success: (res) => {
				// alert('hideAllNonBaseMenuItem' + JSON.stringify(res));
			},
			fail: (res) => {
				// alert('hideAllNonBaseMenuItem' + JSON.stringify(res));
			}
		});
	},
	async showAllNonBaseMenuItem() {
		await this.checkJsApi(['showAllNonBaseMenuItem'])
		
		wx.showAllNonBaseMenuItem({
			success: (res) => {
				// alert('showAllNonBaseMenuItem' + JSON.stringify(res));
			},
			fail: (res) => {
				// alert('showAllNonBaseMenuItem' + JSON.stringify(res));
			}
		});
	},
	async showMenuItems() {
		await this.checkJsApi(['showMenuItems'])
		wx.showMenuItems({
			success: () => {
				console.log('显示成功');
			},
			fail: (res) => {
				// alert('showerror' + JSON.stringify(res));
			},
			menuList: [
				"menuItem:share:appMessage",
				"menuItem:share:timeline",
				"menuItem:share:qq",
				'menuItem:share:QZone',
				"menuItem:share:weiboApp",
				"menuItem:copyUrl",
			]
		});
	},
	async hideMenuItems() {
		await this.checkJsApi(['hideMenuItems'])
		wx.hideMenuItems({
			success: () => {
				console.log('隐藏成功');
			},
			fail: (res) => {
				// alert('hidefail: ' + JSON.stringify(res));
			},
			menuList: [
				"menuItem:share:appMessage",
				"menuItem:share:timeline",
				"menuItem:share:qq",
				'menuItem:share:QZone',
				"menuItem:share:weiboApp",
				"menuItem:copyUrl",
			]
		});
	}
}

export default wxWarpper;