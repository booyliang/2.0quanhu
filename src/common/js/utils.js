import commonModules from "@/config/modules";
import eventBus from "./event-bus";
// import wx from './wx';
import Toast from "@/components/toast";

let modules = commonModules;
let utils = {
	getUrl(path, params) { },
	getShareUrl() {
		return window.location.href;
	},
	alert(...rests) {
		if (
			window.location.href.indexOf("web.") === -1 &&
			window.location.href.indexOf("m.") === -1 &&
			window.location.href.indexOf("m-mo.") === -1 &&
			window.location.href.indexOf("web-mo.") === -1
		) {
			let err = "";
			for (let rest of rests) {
				if (!rest) continue;
				if (typeof rest === "object") {
					err += JSON.stringify(rest);
				} else {
					err += rest;
				}
			}
			alert(err);
		}
	},
	getModule(id) {
		const module = modules[id];

		if (!module) {
			console.error(`Module "${id}" doesn't exist.`);
		}

		return module;
	},
	refreshOnBack() {
		eventBus.$emit("global-message", { type: "refreshOnBack" });
	},
	refresh() {
		eventBus.$emit("global-message", { type: "refresh" });
	},
	goBack() {
		if (document.getElementById("navigator")) {
			eventBus.$emit("goBack");
		} else {
			window.history.go(-1);
		}
	},
	getUrlKey(name) { // 取地址栏参数
		let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		let r = window.location.search.substr(1).match(reg);
		if (r !== null) return unescape(r[2]);
		return null;
	},	
	setBrowserShareInfo(title, description) {
		const doc = window.document;
		if (title) {
			doc.title = title || '圈乎';
		}
		if (description) {
			let descriptionEl = doc.querySelector('meta[name="description"]');
			if (!descriptionEl) {
				descriptionEl = doc.createElement('meta');
				descriptionEl.setAttribute('name', 'description');
				doc.head.appendChild(descriptionEl);
			}
			descriptionEl.setAttribute('content', description);
		}
	},
	getNativeLink(params) {
		const { moduleEnum, kid, coterieId } = params;
		return `quanhu://open/web/jssdk?routeUrl=/redirect/${moduleEnum}/${kid}?coterieId=${ coterieId || 0 }`
	},
	// async wxShare(params = {}) {
	// 	let shareData = {
	// 		title: params.title || '圈乎',
	// 		desc: params.desc || '圈乎',
	// 		link: params.link,
	// 		imgUrl: params.imgUrl || '', // 不传设置默认分享图
	// 		trigger: params.trigger || function (res) { },
	// 		success: params.success || function (res) {
	// 			Toast('分享成功')
	// 		},
	// 		cancel: params.cancel || function (res) {
	// 			Toast('取消分享')
	// 		},
	// 		fail: params.fail || function (res) {
	// 			Toast(JSON.stringify(res));
	// 		}
	// 	}
	// 	// console.log('shareData', shareData);
	// 	await wx.wxConfig()
	// 	wx.onMenuShareTimeline(shareData);
	// 	wx.onMenuShareAppMessage(shareData);
	// 	wx.onMenuShareQQ(shareData);
	// 	wx.onMenuShareWeibo(shareData);
	// },
	setQQShare(params) {
		let options = [
			{ key: 'name', value: params.title },
			{ key: 'description', value: params.desc },
			{ key: 'image', value: params.imgUrl }
		]
		for (let i = 0; i < options.length; i++) {
			let oMeta = document.querySelector(`meta[itemprop="${options[i].key}"]`)
			if (!oMeta) {
				oMeta = document.createElement('meta');
				if (options[i].key === 'description') oMeta.name = 'description';
				document.getElementsByTagName('head')[0].appendChild(oMeta);
			}
			oMeta.setAttribute('itemprop', options[i].key)
			oMeta.setAttribute('content', options[i].value)
		}
	}
};

utils.install = function (Vue, options) {
	let { moduleModules, appInfo } = options;
	modules = Object.assign(modules, moduleModules);
	utils.NODE_ENV = appInfo.NODE_ENV;
	Vue.prototype.$utils = Vue.utils = utils;
};
export default utils;
