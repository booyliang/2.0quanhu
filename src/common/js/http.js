import axios from "axios";
import Toast from "@/components/toast";
import Indicator from '@/components/indicator'
import env from "./env";
import eventBus from './event-bus'
import yryz from './yryz';
import user from './user'
import AppConfig from '@/config/app'
import Utils from '@/js/utils'
import Modules from '@/config/modules'
let axiosInst = axios.create({
	timeout: 20000,
	headers: {
		post: {
			"Content-Type": "application/json;charset=UTF-8"
		}
	},
	validateStatus: function (status) {
		return (status >= 200 && status < 300) || (parseInt(status) === 401);
	}
});
const validHeaderList = ['userId', 'token', 'sign', 'devType', 'devName', 'devId', 'ip', 'net', 'appId', 'appVersion', 'clientVersion', 'ditchCode']
let tokenRefresh = false;
let requestTokenRefresh = [];
function refreshToken(data) {
	return new Promise((async (resolve, reject) => {
		if (requestTokenRefresh.length > 0) {
			requestTokenRefresh.push(resolve);
			return;
		}
		requestTokenRefresh.push(resolve);
		let envData;
		try {
			envData = await yryz.refreshToken({token: env.token});
			for (let key in envData) {
				eventBus.env[key] = envData[key]
			}
			requestTokenRefresh.forEach(resolve => {
				resolve();
			})
			requestTokenRefresh = [];
		} catch (error) {
			requestTokenRefresh = [];
			reject();
		}
	}))
}


axiosInst.install = function (Vue, options) {
	var baseUrl = "";
	if (Utils.NODE_ENV !== "development") {
		baseUrl = AppConfig.REQUEST_URL;
	}
	baseUrl += AppConfig.REQUEST_URL_PREFIX;
	this.baseUrl = baseUrl
	Vue.http = Vue.prototype.$http = this;
	this.interceptors.request.use(function (config) {
		if (!config.url) {
			console.log("services请求地址出错", this, config);
		}
		if (config.url.indexOf("http") !== 0) {
			config.url = baseUrl + config.url;
			for (let i in eventBus.env) {
				if (validHeaderList.indexOf(i) > -1) {
					config.headers.common[i] = eventBus.env[i];
				}
			}
		}
		return config;
	});

	this.interceptors.response.use(
		async function (res) {
			if (parseInt(res.status) === 401) {
				try {
					await refreshToken({token: env.token});
					res.config.url = res.config.url.replace(baseUrl, '');
					delete res.config['headers']
					let newRes = await axiosInst({
						...res.config
					});
					return newRes;
				} catch (error) {
					Toast(res.data.msg);
					return res;
				}
			}
			let resData = res.data;
			const resCode = parseInt(resData.code);
			if (resCode === 1001) {
				await user.reLogin();
				return res;
			}
			if (resCode !== 200 && !res.config.disabledErrorToast) {
				if (resCode === 1029) { // 私圈下架了 私圈对应的资源页被下架
					Vue.nextTick(() => {
						Vue.eventBus.$emit("global-message", {
							type: "removed",
							action: (app) => {
								app.currentView = "y-removed";
							}
						});
					});
					return false
				}
				Toast(resData.msg);
			}
			let modelData = resData.data;
			// for removed recource    delFlag (string): 删除状态  10未删除，11已删除  shelveFlag: 10未下架，11已下架
			if (resData && modelData && (parseInt(modelData.shelveFlag) === 11 || parseInt(modelData.delFlag) === 11) ) {
				let moduleInfo = Modules[modelData.moduleEnum];
				Vue.nextTick(() => {
					Vue.eventBus.$emit("global-message", {
						type: "removed",
						action: (app) => {
							app.title = moduleInfo.title;
							app.currentView = "y-removed";
						}
					});
				});
			}
			
			return res;
		},
		async function (error) {
			Indicator.close();
			console.log('error', error.config, JSON.stringify(error));
			if (error.message.indexOf("timeout") > -1) {
				Toast("操作超时！");
			}
			if (error.message.indexOf("Network Error") > -1) {
				if (yryz.isNative())
					Toast("当前网络不可用，请检查网络设置");
			}
			return Promise.reject(error);
		}
	);
};

export default axiosInst;