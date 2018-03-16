import AppConfig from '@/config/app'
const enrolData = {};
export default {
	computed: {
		isWx() {
			return navigator.userAgent.match(/micromessenger/i) ? true : false;
		},
		isQq() {
			return navigator.userAgent.indexOf('MQQBrowser') !== -1;
		},
	},
	methods: {
		onAction(options) {
			this.$yryz.moreAction(options);
		},
		downloadApp() {
			window.location.href = 'https://static.yryz.com/quanhu/download/index.html';
		},
		verifyPhone(phone) {
			let reg = /^((13[0-9])|(14[1456789])|(15[0-9])|166|(17[0134678])|(18[0-9])|(19[8-9]))\d{8}$/;
			if (reg.test(phone) && phone.length === 11) {
				return true;
			}
			return false;
		},
		wxOauth(activityChannelCode) {
			const UserIdLocalKey = 'Qh_Activity_UserId';
			const TokenLocalKey = 'Qh_Activity_Token';
			let version = window.sessionStorage.getItem('version'); // 本地版本号
			if (this.$utils.getUrlKey('userId') || version === this.$route.params.activityId) {
			// if (version === this.$route.params.activityId) {
				this.$env.userId = this.$utils.getUrlKey('userId');
				this.$env.token = this.$utils.getUrlKey('token');
				// let userIdentity = String(this.$utils.getUrlKey('userIdentity'));
				// window.sessionStorage.setItem('userIdentity', userIdentity)
				window.sessionStorage.setItem(UserIdLocalKey, this.$env.userId);
				window.sessionStorage.setItem(TokenLocalKey, this.$env.token);
				window.sessionStorage.removeItem('version');
				this.$eventBus.$emit('reloadData');
				this.$router.replace({ path: this.$route.path });
				return;
			}
			window.sessionStorage.setItem('version', this.$route.params.activityId)
			let redirectUri = this.$utils.getShareUrl().replace('localhost', 'm-dev.quanhu365.com');
			let baseUrl = location.origin.indexOf('localhost') > -1 ? `http://api2-dev.quanhu365.com${this.$http.baseUrl}` : this.$http.baseUrl
			let oauthUrl = `${baseUrl}/services/app/v2/user/wxOauthLogin?activityChannelCode=${activityChannelCode}&returnUrl=${redirectUri}`
			// console.log(oauthUrl)
			window.location.replace(oauthUrl);
		},

		// 获取参与活动配置
		async getSignUpForm() {
			let params = { activityInfoId: this.$route.params.activityId };
			const res = await this.$http.get(`/services/app/v2/activity/signUp/activitySignUpFrom`, { params });
			console.log('活动配置', res.data);
			if (res.data.code === '200') {
				// 解析configSource
				let data = res.data.data;
				data.configSources = JSON.parse(data.configSources);
				return data;
			} 	
			return res.data.msg;
		},
		
		// 确认报名
		async submitPay(_signUpForm) {
			let params = {
				activityInfoId: this.$route.params.activityId,
				enrolSources: "",
				phone: ""
			};
			const res = await this.$http.post("/services/app/v2/activity/signUp/activitySignUpSubmit", params);
			const option = res.data.data;
			if (res.data.code === '200') {
				window.sessionStorage.setItem('pay', JSON.stringify({type: option.signUpType, amount: option.amount}))
				const id = this.$route.params.activityId;
				// 后台发布活动未配置任何填写项和支付项
				if (_signUpForm.configSources.length === 0 && option.signUpType === 13 && _signUpForm.phoneRequired === 12) {
					this.$router.replace(`/activity/signup/${id}/share`);
					return;
				}
				// 有订单号码并且需要支付货币
				if (option.orderNo && option.signUpType === 11) {
					// 调用原生支付
					try {
						await this.$yryz.pay({
							payMoney: option.amount,
							orderId: option.orderNo
						});
						// 验证是否支付成功的接口
						this.validatePay(id, option.orderNo, _signUpForm);
					} catch (err) {
						if (err.data) {
							this.$toast(err.data.msg || err.data);
						}
					}
				} else {
					if (_signUpForm.amount === 0 || !_signUpForm.amount || option.signUpType === 13) {
						this.$router.replace(`/activity/signup/${id}/share`);
						return false;
					} else if (!_signUpForm.amount && option.signUpType === 12) {
						this.$router.replace(`/activity/signup/${id}/share`);
						return false;
					}
					// this.$router.replace(`/activity/signup/${id}`);
				}

			} else {
				// this.$toast(res.data.msg)
			}
		},
		//  支付验证
		async validatePay(id, orderNo, _signUpForm) {
			let params = {
				orderId: orderNo || ""
			}
			let status = await this.$http.get('/services/app/v2/pay/getOrderInfo', { params });
			if (status.data.data.orderState === 1) {
				this.$router.replace(`/activity/signup/${id}/share`);
				return false;
			} else {
				throw status;
			}
		},
		// 上传地址
		// getUploadUrl() {
		// 	let baseUrls = {
		// 		dev: "http://upload-dev.yryz.com",
		// 		test: "http://upload-test.yryz.com",
		// 		mo: "https://upload-mo.yryz.com",
		// 		m: "https://upload.yryz.com"
		// 	};
		// 	let baseUrl = "";
		// 	let match = window.location.href.match(/([A-Za-z]+)?\./);

		// 	if (match && match.length > 1) {
		// 		baseUrl = baseUrls[match[1].toLowerCase()];
		// 	} else {
		// 		baseUrl = baseUrls["localhost"] || baseUrls["dev"];
		// 	}
		// 	return baseUrl
		// },

		// 上传
		async uploadFile(file) {
			var formData = new FormData();
			formData.append('fileUpload', file);
			this.$indicator.open('上传中...');
			// console.log(AppConfig.UPLOAD_URL)
			let upload_url = AppConfig.UPLOAD_URL || 'http://upload-dev.yryz.com';
			let fileRes = await this.$http.post(`${upload_url}/uploadResource/oss/uploadImage?loc=quanhu&ossUnzip=true`, formData);
			this.$indicator.close();
			let resData = fileRes.data;
			if (resData.msg === 'success') {
				return resData.resouceUrl;
			}
		},
		getFile(e) {
			let file = e.target.files[0];
			e.target.value = '';
			return file;
		},

	}
}