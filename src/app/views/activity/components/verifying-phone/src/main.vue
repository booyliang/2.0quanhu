<template>
	<div class="verifying_phone_wrap">
		<y-input placeholder="请输入手机号" v-model="postData.userPhone" type="number" :maxlength="11"></y-input>
		<y-slide-captcha v-if="validSlideCaptcha" ref="slideCaptcha" @success="handleSlideCaptchaSuccess"></y-slide-captcha>
		<y-input placeholder="请输入验证码" v-model="postData.veriCode" class="box_veriCode">
			<template slot="append">
				<y-button v-if="inCodeCd" type="text">
					<y-countdown v-model="codeCD" start @finish="handleCodeCdFinished"></y-countdown>
				</y-button>
				<y-button v-else @click.native="sendCaptcha" type="text">获取验证码</y-button>
			</template>
		</y-input>
	</div>
</template>
<script>
import YSlideCaptcha from '@/components/slide-captcha'
import YInput from '@/components/input'
import YCountdown from '@/components/countdown'
import Mixins from '../../../mixins'
const CaptchaCD = 90;
export default {
	name: 'y-verifying-phone',
	components: {
		YInput,
		YSlideCaptcha,
		YCountdown,
	},
	mixins: [Mixins],
	props: {
		value: {
			type: Object,
			required: true,
		},
		code: {
			type: String,
			default: '9',
		}
	},
	data() {
		return {
			postData: this.value,
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
				code: this.code,
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
		}
	}
}
</script>
<style>
.verifying_phone_wrap {
	& .y-input {
		border: 1px solid #e4e4e4;
		border-radius: 0.1rem;
	}
	& .box_veriCode {
		margin-top: .3rem;
		& .y-input__append {
			background-color: #F8F8F8;
			border-left: 1px solid #e4e4e4;
		}
	}
	& .slide_captcha {
		margin-top: .3rem;
	}
}
</style>


