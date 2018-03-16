import yryz from './yryz'
import utils from './utils'
import eventBus from './event-bus'
import Toast from '@/components/toast'

let env = eventBus.env = {
	userId: '',
	language: 'zh',
	devType: 13
}
async function setEnv(Vue, options) {
	let newEnv = {};
	try {
		if (yryz.isNative()) {
			let data = await yryz.httpHeader(null, 3000);
			Object.assign(newEnv, data);
		} else if (options.appInfo.NODE_ENV === "development") {
			let defaultEnv = {
				userId: '', // 用户id 738944295740751872 727447149320273920 739876045945667600 729840906395050000
				token: "", // 用户令牌 727447149320273920-n8F0xjhg80JD1516969738769
				sign: "ceshi", // 签名（接口鉴权）
				devType: "13", // 11： IOS，12：安卓 13:WEB
				devName: "IOS", // 设备名称
				devId: "123456578", // 当前访问设备id
				ip: "127.0.0.1", // 当前网络ip
				net: "wift", // 网络环境
				appId: '', // 应用id
				appVersion: "3.0.0", // APP版本号
				clientVersion: "", // 客户端版本号
				ditchCode: "", // APP应用渠道码
			};
			Object.assign(newEnv, defaultEnv)
		} 
			
	} catch (ex) {
		// yryz.isNative() && Toast('无法获取原生环境')
	}

	for (let key in newEnv) {
		eventBus.$set(eventBus.env, key, newEnv[key])
	}
	env = eventBus.env
	Vue.prototype.$env = Vue.env = env;

}
env.install = async function (Vue, options) {
	yryz.on('nativeLogin', async () => {
		await setEnv(Vue, options);
		eventBus.$emit('global-message', { type: 'refresh' })
	});
	await setEnv(Vue, options);
	return env;
}

export default env;