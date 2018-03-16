<template>
	<div class="plat_activity_main_wrap">
		<router-view></router-view>
		<y-modal ref="modal" :hasInput="true">
			<div class="login_modal">
				<div class="login_modal-body">
					<p class="login_modal-error_tips" v-if="errorMsg">{{ errorMsg }}</p>
					<y-verifying-phone v-model="postData" :code="code"></y-verifying-phone>
					<p class="login_modal-tips">请先进行手机验证</p>
				</div>
				<div class="login_modal-footer">
					<y-button v-if="$env.userId" @click.native="bindPhone" class="login_modal-submit" block>提交</y-button>
					<y-button v-else @click.native="login" class="login_modal-submit" block>提交</y-button>
				</div>
			</div>
		</y-modal>
	</div>
</template>
<script>
const UserIdLocalKey = 'Qh_Activity_UserId';
const TokenLocalKey = 'Qh_Activity_Token';
import YModal from '@/components/modal'
import YInput from '@/components/input'
import Md5 from 'md5'
import moment from 'moment'
import YVerifyingPhone from './components/verifying-phone'
import Mixins from './mixins'
export default {
	name: 'activity-main',
	components: {
		YVerifyingPhone,
		YModal,
		YInput,
	},
	mixins: [Mixins],
	data() {
		return {
			modalHeight: 0,
			modalPaddingTop: 0,
			postData: {
				userPhone: '',
				veriCode: '',
				userRegInviterCode: ''
			},
			errorMsg: '',
			isRegister: false,
			code: '9',
		}
	},
	watch: {
		'postData.userPhone'(newVal, oldVal) {
			if (newVal !== oldVal) {
				this.errorMsg = '';
			}
		},
		'postData.veriCode'(newVal, oldVal) {
			if (newVal !== oldVal) {
				this.errorMsg = '';
			}
		}
	},
	methods: {
		validForm() {
			this.errorMsg = '';
			if (!this.verifyPhone(this.postData.userPhone)) {
				this.errorMsg = '请输入正确的手机号';
				return false;
			}
			if (!this.postData.veriCode) {
				this.errorMsg = '请输入短信验证码';
				return false;
			}
			return true;
		},
		async bindPhone() {
			if (!this.validForm()) return;
			let params = {
				phone: this.postData.userPhone,
				verifyCode: this.postData.veriCode,
			}
			let res = await this.$http.post(`/services/app/v2/user/activityCheckPhone`, params);
			if (res.data.code === '200')
				this.$refs['modal'].close();
			// let userIdentity = window.sessionStorage.getItem('userIdentity');
			// if (userIdentity === '1') window.sessionStorage.setItem('userIdentity', '0');
		},
		async login() {
			this.errorMsg = '';
			if (!this.validForm()) return;
			let postData = { ...this.postData };
			let url = '/services/app/v2/user/loginVerifyCode';
			this.$indicator.open('加载中...');
			let loginRes = await this.$http.post(url, postData);
			let loginResData = loginRes.data;
			this.$indicator.close();
			if (loginResData.code === '200') {
				let authInfo = { ...loginResData.data.authInfo }
				this.$env.userId = authInfo.userId;
				this.$env.token = authInfo.token;
				window.sessionStorage.setItem(UserIdLocalKey, authInfo.userId);
				window.sessionStorage.setItem(TokenLocalKey, authInfo.token);
				this.$refs['modal'].close();
				this.$eventBus.$emit('reloadData');
			} else {
				this.errorMsg = loginResData.msg;
			}
		},
		showLoginModal(params) {
			if (this.$yryz.isNative()) {
				this.$user.login();
			} else {
				this.code = '9';
				if (params && params.code) this.code = params.code;
				this.errorMsg = '';
				this.$refs['modal'].open();
				// let positionObj = this.$refs.activityMain.getBoundingClientRect();
				// this.modalHeight = positionObj.height;
				// this.modalPaddingTop = Math.abs(positionObj.top);
				// this.loginModalIsShow = true;
			}
		},
		handleRefreshActivityData(data) {
			this.postData.activityChannelCode = data.activityChannelCode;
		},
	},
	created() {
		const UserId = window.sessionStorage.getItem(UserIdLocalKey);
		const Token = window.sessionStorage.getItem(TokenLocalKey);
		if (Token && UserId) {
			this.$env.token = Token;
			this.$env.userId = UserId;
		}
		// let userIdentity = window.sessionStorage.getItem('userIdentity');
		// if (userIdentity === '1') this.code = '10';
	},
	mounted() {
		const { inviter } = this.$route.query;
		this.postData.userRegInviterCode = inviter || '';
		this.$eventBus.$on('login', this.showLoginModal);
		this.$eventBus.$on('activityDataRefresh', this.handleRefreshActivityData);
	},
	beforeDestroy() {
		this.$eventBus.$off('login', this.showLoginModal);
		this.$eventBus.$off('activityDataRefresh', this.handleRefreshActivityData);
	}
}
</script>
<style>
@import '#/css/var.css';
.plat_activity_main_wrap {
	min-height: 100vh; 
}

.modal.is-ios {
	/* display: block; */
	/* position: absolute; */
	& .modal-content {
		width: 6rem;
		/* margin: 50vh auto 0 !important; */
		/* transform: translateY(-50%); */
	}
}

.login_modal {
	width: 6rem;
	min-height: 4.1rem;
	background: #fff;
	& .login_modal-body {
		min-height: 3.26rem;
		padding: .4rem .3rem .2rem;
	}
	& .login_modal-tips {
		margin-top: .2rem;
		font-size: .24rem;
		color: #aaa;
	}
	& .login_modal-error_tips {
		font-size: .24rem;
		margin-bottom: .1rem;
		color: red;
	}
	& .login_modal-submit {
		line-height: .84rem;
		width: 100%;
		max-width: 100%;
		margin: 0;
		padding: 0;
		border: none;
		background: #f8f8f8;
		color: #000;
	}
}
</style>

