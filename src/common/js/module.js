import viewport from "./viewport";
import utils from "./utils";
import EventBus from "./event-bus";
import yryz from "./yryz";
import LocalStore from "./localStore";
import filter from "../filters";
import Components from "./components";
import Http from "./http";
import Resource from "./resource";
import Router from "./router";
import Toast from "../components/toast/toast";
import App from '@/views/App'
import Cache from "./cache";
import Env from "./env";
import fixBack from "./fix-back-not-render";
import User from "./user";
let module = {};
module.install = async function (Vue, options) {
	
	// Object.assign(module, options.appInfo)
	// if (!module.moduleName && options.validateModule !== false)
	// 	console.error('appconfig中必须配置moduleName')
	// Vue.prototype.$module = Vue.module = module;
	// Vue.prototype.$moduleOptions = Vue.moduleOptions = options;
	Vue.use(EventBus, options);
	await Env.install(Vue, options);
	for (let name in filter) {
		Vue.filter(name, filter[name]);
	}
	Vue.use(yryz);
	Vue.use(utils, options);
	Vue.use(Http, options);
	Vue.use(LocalStore);
	Vue.use(Resource, options);
	Vue.use(Components);	
	Vue.use(fixBack);
	Vue.use(Cache);
	Vue.use(User, options);
	Vue.config.productionTip = false;	
	viewport(Vue);
	let router = Router(Vue, options)
	// 非正式环境全局弹出错误
	if (window.location.href.indexOf('web.') === -1 && window.location.href.indexOf('m.') === -1) {
		Vue.config.errorHandler = function (err, vm, info) {
			// let msg = typeof err === 'string' ? err : JSON.stringify(err)
			Toast(err.toString() + (info || '').toString());
			throw err
		}
	}
	let vueInst =  new Vue({
		el: '#app',
		router,
		template: '<app/>',
		components: { App }
	});
	return vueInst;

}

export default module;
