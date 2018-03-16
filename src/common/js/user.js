import yryz from './yryz'
import Toast from "../components/toast";
import http from './http'
import eventBus from './event-bus'
let env = eventBus.env;
let user = {
	get isLogin() {
		return env.userId;
	},
	async login() { 
		if (env.userId)
			return;
	
		let data = await yryz.login();	
		for (let key in data) { 
			env[key] = data[key]
		}
		eventBus.$emit('global-message', { type: 'refresh' })
		throw '用户登录'
	},
	async reLogin() {
		let data = await yryz.login();	
		for (let key in data) { 
			env[key] = data[key]
		}
		eventBus.$emit('global-message', { type: 'refresh' })
	},
	install(vue, options) { 
		yryz.on('nativeLogin', async () => {
			eventBus.$emit('global-message', { type: 'refresh' })
		});
		vue.prototype.$user =  user;
		yryz.on('nativeLogout', async (data) => { 
			env.userId = '';
			return env;
		})
	},
};

export default user