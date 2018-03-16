<template>
	<page-panel class="share_register">
		<img slot="cover" src="../../assets/banner-register.jpg">
		<div class="form">
			<y-input placeholder="请输入手机号" v-model="postData.userPhone" type="number" :maxlength="11"></y-input>
			<y-slide-captcha v-if="validSlideCaptcha" ref="slideCaptcha" @success="handleSlideCaptchaSuccess"></y-slide-captcha>
			<y-input placeholder="请输入验证码" type="number" v-model="postData.veriCode">
				<template slot="append">
					<y-button v-if="inCodeCd" type="text"><y-countdown v-model="codeCD" start @finish="handleCodeCdFinished"></y-countdown></y-button>
					<y-button v-else @click.native="sendCaptcha" type="text">获取验证码</y-button>
				</template>
			</y-input>
			<y-button block @click.native="onRegister">立即领取积分</y-button>
		</div>
		<div class="info">
			<h3 class="info_title">如何使用积分</h3>
			<ol>
				<li>新用户输入手机号平分积分</li>
				<li>下载圈乎APP，完成登录即可使用积分</li>
				<li>每个手机号只能参与评分1次</li>
			</ol>
		</div>
	</page-panel>
</template>
<script>
	import YSlideCaptcha from '@/components/slide-captcha'
	import YInput from '@/components/input'
	import YCountdown from '@/components/countdown'
	import PagePanel from './components/page-panel'
	const CaptchaCD = 90;
	export default {
		name: 'signup',
		components: {
			YInput,
			YSlideCaptcha,
			YCountdown,
			PagePanel
		},
		data() {
			return {
				postData: {
					userPhone: '',
					veriCode: '',
					userRegInviterCode: ''
				},
				aliCaptcha: {},
				codeCD: CaptchaCD,
				inCodeCd: false,
				validSlideCaptcha: false
			}
		},
		methods: {
			handleCodeCdFinished() {
				this.codeCD = CaptchaCD;
				this.inCodeCd = false;
				this.resetSlideCaptcha();
			},
			handleSlideCaptchaSuccess(data) {
				this.aliCaptcha = { ...data }
			},
			resetSlideCaptcha() {
				if (!this.validSlideCaptcha) return;
				this.$refs.slideCaptcha && this.$refs.slideCaptcha.reset();
				this.aliCaptcha = {};
			},
			verifyPhone(phone) {
				let reg = /^((13[0-9])|(14[1456789])|(15[0-9])|166|(17[0134678])|(18[0-9])|(19[8-9]))\d{8}$/;
				if (reg.test(phone) && phone.length === 11) {
					return true;
				}
				return false;
			},
			async sendCaptcha() {
				this.errorMsg = '';
				if (!this.verifyPhone(this.postData.userPhone)) {
					this.errorMsg = '请输入正确的手机号';
					this.$toast(this.errorMsg);
					return false;
				}
				if (!this.aliCaptcha.sig && this.validSlideCaptcha) {
					this.errorMsg = "请滑动验证";
					this.$toast(this.errorMsg);
					return false;
				}
				let postData = {
					phone: this.postData.userPhone,
					type: '1',
					code: '1',
					...this.aliCaptcha
				}
				this.$indicator.open('发送中...');
				let capthcaRes;
				try {
					capthcaRes = await this.$http.post('/services/app/v2/component/sendVerifyCodeForSlip', postData);
				} catch (error) {
					this.$indicator.close();
				}
				this.$indicator.close();
				let captchaResData = capthcaRes.data;
				if (parseInt(captchaResData.code) !== 200) {
					this.resetSlideCaptcha();
					return;
				}
				this.validSlideCaptcha = captchaResData.data.isSendViewCode;
				if (this.validSlideCaptcha) {
					this.$toast('请滑动验证');
					this.handleCodeCdFinished();
				} else {
					this.inCodeCd = true;
				}
			},
			onRegister() {
				let postData = {
					...this.postData
				}
				if (!this.verifyPhone(postData.userPhone)) {
					this.$toast('请输入正确的手机号');
					return;
				}
				if (!postData.veriCode) {
					this.$toast('请输入短信验证码');
					return;
				}
				this.$indicator.open('注册中...');
				this.$http.post('/services/app/v2/user/register', postData).then(res => {
					this.$indicator.close();
					let resData = res.data;
					if (parseInt(resData.code) === 200) {
						sessionStorage.setItem('inviter-register-phone', postData.userPhone);
						this.$toast('注册成功');
						this.$router.push({name: 'shareRegisterSuccess'})
					}
				})
			}
		},
		mounted() {
			const { inviter } = this.$route.query;
			this.postData.userRegInviterCode = inviter;
		}
	}
</script>
<style>
	@import "#/css/var.css";
	.share_register {
		& .form {
			min-height: 5rem;
		}
		& .y-input-wrap {
			margin-top: .5rem;
			border: 1px solid #aaa;
			& input {
				height: .8rem;
			}
		}
		& .slide_captcha {
			margin-top: .5rem;
		}
		& .button--block {
			margin: .5rem .2rem 0;
			max-width: none;
			width: calc(100% - .4rem);
			border-radius: 2.5em;
		}
		& .info {
			margin: .6rem auto 0;
		}
		& .info_title {
			text-align: center;
			font-size: .36rem;
			color: var(--text-assist-color);
			&:--before-after {
				content: "";
				display: inline-block;
				vertical-align: middle;
				width: 1.5rem;
				height: 1px;
				background: linear-gradient(to right, transparent, currentColor);
			}
			&::before {
				margin-right: 0.6em;
			}
			&::after {
				margin-left: 0.6em;
				transform: rotate(0.5turn);
			}
		}
		& ol {
			padding-top: .25rem;
			margin-left: .4rem;
		}
		& li {
			margin-top: .24rem;
			line-height: 1;
			list-style: decimal inside;
			color: var(--text-assist-color);
		}
	}
</style>