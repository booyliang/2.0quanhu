/**
 * @author https://github.com/AlanZhang001/H5CallUpNative
 * @overview 测试在浏览器中打开native App;
 *
 */
import Config from '@/config/app.js'
const ua = window.navigator.userAgent;
 // UA鉴定
var browser = {
	isAndroid: function () {
		return ua.match(/Android/i) ? true : false;
	},
	isMobileQQ: function () {
		return /(iPad|iPhone|iPod).*? (IPad)?QQ\/([\d\.]+)/.test(ua) || /\bV1_AND_SQI?_([\d\.]+)(.*? QQ\/([\d\.]+))?/.test(ua);
	},
	isIOS: function () {
		return ua.match(/iPhone|iPad|iPod/i) ? true : false;
	},
	isWx: function () {
		return ua.match(/micromessenger/i) ? true : false;
	},
	isWeibo: function () {
		return ua.match(/WeiBo/i) ? true : false;
	}
};

var AppConfig = {
	
	// 协议头
	PROTOCAL: Config.APP_PROTOCOL,

	// 主页
	HOME: "",

	HOST: Config.APP_HOST,

	// 唤起失败时的跳转链接
	FAILBACK: {
		ANDROID: Config.DOWNLOAD_APP_URL,
		IOS: Config.DOWNLOAD_APP_URL
	},

	FAILFUNCTION: null,

	// 唤起超时时间，超时则跳转到下载页面
	LOAD_WAITING: 2500
};

// 是否为Android下的chrome浏览器，排除mobileQQ；
// Android下的chrome，需要通过特殊的intent 来唤醒
// refer link：https://developer.chrome.com/multidevice/android/intents
var isAndroidChrome = (ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/)) && browser.isAndroid() && !browser.isMobileQQ();
export default {
	/**
	 * [mixinConfig 重新收拢配置]
	 * @param  {[type]} config [description]
	 * @return {[type]}        [description]
	 */
	mixinConfig: function (config) {
		if (!config) {
			return;
		}

		AppConfig.PROTOCAL = config.protocal || AppConfig.PROTOCAL;
		AppConfig.schema   = config.schema || AppConfig.HOME;
		AppConfig.FAILFUNCTION = config.failFunction;
		AppConfig.LOAD_WAITING = config.loadWaiting || AppConfig.LOAD_WAITING;

		if (browser.isIOS()) {
			AppConfig.FAILBACK.IOS = config.failUrl || AppConfig.FAILBACK.IOS;
		} else if (browser.isAndroid()) {
			AppConfig.FAILBACK.ANDROID = config.failUrl || AppConfig.FAILBACK.ANDROID;
		}

	},
	/**
	 * [generateSchema 根据不同的场景及UA生成最终应用的schema]
	 * @return {[type]}                [description]
	 */
	generateSchema: function (schema) {
		var schemaStr = window.location.pathname;
		if (schema) {
			schemaStr = schema;
		} else {
			schemaStr = `/web/jssdk?routeUrl=${schemaStr}`;
		}
		schemaStr = `${AppConfig.PROTOCAL}://${AppConfig.HOST}${schemaStr}`;
		return schemaStr;
	},

	/**
	 * [loadSchema 唤醒native App，如果无法唤醒，则跳转到下载页]
	 * @return {[type]} [description]
	 */
	loadSchema: function (config) {

		this.mixinConfig(config);

		var schemaUrl = this.generateSchema(AppConfig.schema);

		var iframe    = document.createElement("iframe"),
			aLink     = document.createElement("a"),
			body      = document.body,
			loadTimer = null;

		// 隐藏iframe及a
		aLink.style.cssText = iframe.style.cssText = "display:none;width:0px;height:0px;";

		// Android 微信不支持schema唤醒，必须提前加入腾讯的白名单
		if (browser.isWx() && browser.isAndroid()) {
			if (AppConfig.FAILFUNCTION) {
				AppConfig.FAILFUNCTION();
				return;
			}
			window.location.href = AppConfig.FAILBACK.ANDROID;

		// ios 9 safari 不支持iframe的方式跳转
		} else if (browser.isIOS()) {
			if (browser.isWx()) {
				if (AppConfig.FAILFUNCTION) {
					AppConfig.FAILFUNCTION();
					return;
				}
				window.location.href = AppConfig.FAILBACK.IOS;
			} else {
				aLink.href = schemaUrl;
				body.appendChild(aLink);
				aLink.click();
			}

		// Android chrome 不支持iframe 方式唤醒
		// 适用：chrome,leibao,mibrowser,opera,360
		} else if (isAndroidChrome) {

			aLink.href = schemaUrl;
			body.appendChild(aLink);
			aLink.click();

		// 其他浏览器
		// 适用：UC,sogou,firefox,mobileQQ
		} else {

			body.appendChild(iframe);
			iframe.src = schemaUrl;

		}

		// 如果LOAD_WAITING时间后,还是无法唤醒app，则直接打开下载页
		// opera 无效
		var start = Date.now(),
			that  = this;
		loadTimer = setTimeout(function () {

			if (document.hidden || document.webkitHidden) {
				return;
			}

			// 如果app启动，浏览器最小化进入后台，则计时器存在推迟或者变慢的问题
			// 那么代码执行到此处时，时间间隔必然大于设置的定时时间
			if (Date.now() - start > AppConfig.LOAD_WAITING + 200) {
				// come back from app

				// 如果浏览器未因为app启动进入后台，则定时器会准时执行，故应该跳转到下载页
			} else {
				if ((browser.isWx() || browser.isMobileQQ() || browser.isWeibo()) && AppConfig.FAILFUNCTION) {
					AppConfig.FAILFUNCTION();
					return;
				}
				window.location.href = browser.isIOS() ? AppConfig.FAILBACK.IOS : AppConfig.FAILBACK.ANDROID;
			}

		}, AppConfig.LOAD_WAITING);


		// 当本地app被唤起，则页面会隐藏掉，就会触发pagehide与visibilitychange事件
		// 在部分浏览器中可行，网上提供方案，作hack处理
		var visibilitychange = function () {
			var tag = document.hidden || document.webkitHidden;
			tag && clearTimeout(loadTimer);
		};
		document.addEventListener('visibilitychange', visibilitychange, false);
		document.addEventListener('webkitvisibilitychange', visibilitychange, false);
		// pagehide 必须绑定到window
		window.addEventListener('pagehide', function () {
			clearTimeout(loadTimer);
		}, false);
	}
}
