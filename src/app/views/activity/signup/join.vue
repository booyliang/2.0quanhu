<template>
	<div class="activity-signup-wrap">
		<y-nav title="参与报名" class="nav-demo-b" :showLeftArrow="inApp">
			<span slot="nav-right" class="sign-text" @click="onsubmit">
				确认报名
			</span>
		</y-nav>
		<y-list v-if="signUpForm.configSources" class="list-itme">
			<y-item v-for="config in signUpForm.configSources" :key="config.id" :title="config.title" :subtitle="subTitle(config.required)" :vertical="config.type === '0'">
				<div slot="body">
					<y-input :placeholder="config.inputPrompt" :type="config.type === '1' ? 'text' : 'textarea'" v-model.trim="config.value" :show-text-length-info="config.type === '0'" :maxlength="config.type === '0' ? 500 : 30">
					</y-input>
				</div>
			</y-item>
			<y-item title="手机号" :subtitle="subTitle(signUpForm.phoneRequired)" v-if="signUpForm.phoneRequired !== 12">
				<div slot="body">
					<y-input placeholder="请输入手机号码" type="text" v-model.trim="phone">
					</y-input>
				</div>
			</y-item>
		</y-list>
		<p clsss="desc" v-if="signUpForm.signUpType && signUpForm.signUpType !== 13">
			<span class="iconfont icon-remind"></span>
			参与本次活动需要支付{{amount}}<span v-if="signUpForm.signUpType === 11">悠然币</span><span v-else>积分</span>
		</p>

		<!-- 确认弹框 -->
		<div class="win-pop" v-if="showModel">
			 <div class="win-pop-main">
			       <p>
				       <label>参与本次活动需支付</label>
				       <label v-if="signUpForm.signUpType === 11" class="win-pop-color">{{ amount }}悠然币</label>
					   <label v-else class="win-pop-color">{{ signUpForm.amount }}积分</label>
					   <label>是否确认报名？</label>
			       </p>
				   <div class="win-pop-btn">
					<span class="win-pop-btnleft" @click="closeModel">取消</span>
					<span class="win-pop-btnlne"></span>
					<span class="win-pop-btnright" @click="submitModel">确认</span> 
				   </div> 
			 </div>
		</div>
		<!-- 确认弹框结束 -->
	</div>
</template>

<script>
import YList from '@/components/list';
import YInput from '../components/input';
import Toast from '@/components/toast';
import YItem from '../components/item'
const PAY_CURRENCY = 1;  // 支付货币
const PAY_INTEGRAL = 2;  // 支付积分
const PHONE_EMPTY = 10;   // 手机号码允许为空
const PHONE_NO_EMPTY = 11;   // 手机号码不允许为空
const PHONE_HIDE = 12;  // 不显示手机号码
const NORMAL = 1; // 数据正常状态
const REQUIRED_FILL = "1"; // 必须填写
export default {
	components: {
		[YList.name]: YList,
		[YInput.name]: YInput,
		YItem

	},
	data() {
		return {
			inApp: !!this.$yryz.isNative(),
			signUpForm: {},
			phone: "",
			showModel: false
		}
	},
	computed: {
		amount() {
			return this.signUpForm.signUpType === 11 ? this.signUpForm.amount / 100 : this.signUpForm.amount;
		}
	},
	mounted() {
		this.checkLogin();
		this.getSignUpForm();
	},
	methods: {
		checkLogin() {
			// 用浏览器分享到第三方，链接打开后是活动首页
			if (!this.$yryz.isNative()) {
				if (!this.$env.userId) {
					this.$router.replace(`/activity/signup/${this.$route.params.activityId}/index`);
					return false;
				}
			}
		},
		subTitle(type) {
			if (type === '1' || type === 1 || type === 11) return "(必填)";
		},
		validateSignUp() {
			this.checkLogin();
			const sources = this.signUpForm.configSources;
			const signUpForm = this.signUpForm;
			for (let source of sources) {
				if (source.required === REQUIRED_FILL) {
					const maxLen = source.type === '1' ? 30 : 500;
					if (source.value === "" || source.value.length > maxLen) {
						Toast(source.errorPrompt);
						return false;
					}
				}
			}
			let phoneReg = /^((13[0-9])|(14[1456789])|(15[0-9])|166|(17[0134678])|(18[0-9])|(19[8-9]))\d{8}$/;
			let phone = this.phone;
			// 手机号码是必填
			if (signUpForm.phoneRequired === PHONE_NO_EMPTY) {
				if (!phone) {
					Toast("手机号码不能为空");
					return false;
				}
			}
			// 手机号码为空允许为空的话,如果还是填写依然判断
			if (phone) {
				if (!phoneReg.test(phone)) {
					Toast("您输入的手机号无效");
					return false;
				}
			}
			return true;
		},
		async getSignUpForm() {
			let params = { activityInfoId: this.$route.params.activityId };
			const res = await this.$http.get(`/services/app/v2/activity/signUp/activitySignUpFrom`, { params });
			if (res.data.code === '200') {
				// 解析configSource
				let data = res.data.data;
				data.configSources = JSON.parse(data.configSources);
				console.log(data.configSources);
				data.configSources.forEach((source) => {
					source.value = "";
				});
				this.signUpForm = data;
				// 如果配置信息为空,并且手机号码不显示就直接提交
				if (data.configSources.length === 0 && data.phoneRequired === PHONE_HIDE) {
					this.submitPay();
				}
			} else {
				throw new Error(res.data.msg);
			}
		},
		parseParams() {
			let params = {
				activityInfoId: 0,
				enrolSources: [],
				phone: ""
			};
			const sources = this.signUpForm.configSources;
			for (let source of sources) {
				params.enrolSources.push({ id: source.id, value: source.value });
			}
			params.enrolSources = JSON.stringify(params.enrolSources);
			params.activityInfoId = this.$route.params.activityId;
			params.phone = this.phone;
			return params;
		},
		async validatePay(id, orderNo) {
			//  支付验证
			// orderNo = orderNo || "";
			let params = {
				orderId: orderNo || ""
			}
			let status = await this.$http.get('/services/app/v2/pay/getOrderInfo', { params });
			if (status.data.data.orderState === NORMAL) {				
				this.$router.replace(`/activity/signup/${id}/share`);
				return false;
				
			} else {
				throw status;
			}
		},
		async submitPay() {
			console.log(this.validateSignUp())
			if (!this.validateSignUp()) {
				return;
			}
			let params = this.parseParams();
			const res = await this.$http.post("/services/app/v2/activity/signUp/activitySignUpSubmit", params);
			const option = res.data.data;
			if (res.data.code === '200') {
				window.sessionStorage.setItem('pay', JSON.stringify({type: option.signUpType, amount: option.amount}))
				const id = this.$route.params.activityId;
				// 有订单号码并且需要支付货币
				if (option.orderNo && option.signUpType === 11) {
					// 调用原生支付
					try {
						await this.$yryz.pay({
							payMoney: option.amount,
							orderId: option.orderNo
						});
						// 验证是否支付成功的接口
						this.validatePay(id, option.orderNo);
					} catch (err) {
						if (err.data) {
							Toast(err.data.msg || err.data);
						}
					}
				} else {				
					if (this.signUpForm.amount === 0 || !this.signUpForm.amount) {
						this.$router.replace(`/activity/signup/${id}/share`);
						return false;
					}	
					this.$router.replace(`/activity/signup/${id}/share`);
				}
			} else {
				// Toast(res.data.msg)
			}
		},
		onsubmit() {
			if (this.signUpForm.signUpType !== 13) {
				if (!this.validateSignUp()) {
					return;
				}
				this.showModel = true;
			} else {
				this.submitPay();
			}
		},
		submitModel() {
			this.submitPay();
		},
		closeModel() {
			this.showModel = false;
		}
	}
}
</script>

<style>
@import '#css/var.css';
.activity-signup-wrap {
	height: 100vh;
	background: #f7f7f7;
	& input[type="text"] {
		text-align: right;
	}
	& .nav-left {
		width: 1.5rem;
	}
	& .sign-text {
		font-size: .32rem;
		color: #0085ff;
	}
	&>p {
		font-size: .28rem;
		padding-left: .2rem;
		color: #afafaf;
		margin: 0.3rem 0 2.3rem;
		& span {
			padding-right: .1rem;
		}
	}

	& .y-textarea {
		/* @apply --border-bottom; */
		&>textarea {
			padding: 0;
		}
	}

	& .list {
		@apply --border-bottom;
	}
	& .list-itme {
		border: 0;
	}
	& .item-subtitle {
		font-size: .3rem;
	}
	& .win-pop {
		width: 100%;
		height: 100%;		
		position: fixed;
		top: 0;
		left: 0;			
		background: color(#000 alpha(.7));
		z-index: 20;
		& .win-pop-main {
           width: 6rem;
           height: 3.4rem;
		   border-radius: 10px;
           background-color: #fff;
           position: absolute;
           z-index: 21;
           top: 50%;
           left: 50%;
           margin-top: -2.2rem;
           margin-left: -3rem;
           display: flex;
		   justify-content: center;
		   align-items: flex-end;
		   & .win-pop-color {
			   color: #ffba00;
		   }  
		   & p {
			 width: 100%;
		   	 position: absolute;
		   	 bottom: 1.45rem;
		   	 font-size: .34rem;
		   	 line-height: .56rem;
		   	 color: #333;
		   	 text-align: center;
		   	 /* left: 32%; */
		   	 & label {
				width: 100%;
				text-align: center;
		   	 	display: block;
		   	 }
		   }
           & .win-pop-btn {
			   display: flex;
			   justify-content: center;
			   width: 100%;
			   background-color:#f8f8f8;
			   color: #333;
			   border-bottom-left-radius: 10px;
			   border-bottom-right-radius: 10px;
			   & span {
				   font-size:.34rem;
			   }
			   & .win-pop-btnlne {
				   display: inline-block;
				   width: 0.03rem;
				   height: 0.5rem;
				   margin-top: 0.17rem;
				   margin-bottom: 0.17rem;
				   background-color:#e4e4e4;
			   }
			   & .win-pop-btnleft {
				   text-align: center;
				   align-self: center;
				   width: 50%;

			   }
			   & .win-pop-btnright {
				   text-align: center;
				   align-self:center;
				   color:#0185ff;
				   width: 50%;

			   }

           }
		}
	}
}
</style>
