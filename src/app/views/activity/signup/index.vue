<template>
	<div class="signup_wrap">
		<y-nav :title='activity.title' class="nav-demo-b" :showLeftArrow="inApp">
			<span slot="nav-right" v-if="inApp">
				<y-button type="text" class="iconfont icon-more_line" @click.native.stop="moreActionMixinOpen"></y-button>
			</span>
		</y-nav>
		<section class="notice">
			<div class="count-down">
				<img :src="activity.coverPlan" alt="" @click="previewImg(activity.coverPlan)">
				<div class="timer">
					<div>
						<span class="iconfont icon-clock_line"></span>
						<span class="title_status">{{ titleStatus }}</span>
					</div>
					<y-count-down v-if="timer && activity.currentDate" :now-date="nowDate" :end-date="timer"></y-count-down>
				</div>
			</div>
		</section>
		<section class="activity-rule">
			<h4><span class="rule-icon"></span>活动规则</h4>
			<y-content-source :content-source="activity.contentSources"></y-content-source>
		</section>
		<div class="activity-btn-wrapper" :class="$env.specialDeviceName + '_btn_join'">
			<y-button block @click.native="partActivity(activity.activityStatus)">{{btnStatus}}</y-button>
		</div>
		<!-- 确认弹框 -->
		<div class="win-pop" v-if="showModel">
			 <div class="win-pop-main">
			       <p>
				       <label>参与本次活动需支付</label>
				       <label v-if="this.signUpForm.signUpType === 11"  class="win-pop-color">{{ this.signUpForm.amount | priceUnit }}悠然币</label>
					   <label v-if="this.signUpForm.signUpType === 12"  class="win-pop-color">{{ this.signUpForm.amount }}积分</label>
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
const Not_STARTED = 11;  // 活动未开始
const STARTING = 12;		// 活动已开始-未结束
const END = 13;			// 活动已经结束
const ALREADY_SIGN_UP = 12; // 已经报名
const SIGN_UP = 11; // 可以参与
const NORMAL = 1;  // 正常码
const INIT_TIME = -1;
import Toast from '@/components/toast';
import ConentSource from '@/components/content-source';
import CountDown from './../components/count-down';
import Mixin from '../mixins'
import moreActionMixin from '../../../mixins/more-action'
import Button from '@/components/button';
export default {
	mixins: [Mixin, moreActionMixin],
	components: {
		[ConentSource.name]: ConentSource,
		[CountDown.name]: CountDown,
		[Button.name]: Button,
	},
	data() {
		return {
			inApp: !!this.$yryz.isNative(),
			activity: {},
			btnStatus: "参加活动",
			titleStatus: "距离活动还有",
			shareData: {},
			timer: null,
			visible: {
				share: false
			},
			nowDate: null,
			signUpForm: {}, // 后台配置信息
			showModel: false,
			options: {},
			moreActionDataModelKey: 'shareData',
			moreActionMenuList: [7, 6],
		};
	},
	computed: {

	},
	methods: {
		previewImg(imgUrl) {
			if (!this.inApp) return;
			this.$yryz.picturePreview({
				imageUrls: [imgUrl],
				currentIndex: 1
			})
		},
		async getActivity() {
			let params = { activityInfoId: this.$route.params.activityId };
			const res = await this.$http.get(`/services/app/v2/activity/signUp/activitySignUpHome`, { params });
			if (res.data.code === '200') {
				this.activity = res.data.data;
				this.shareData = {
					kid: this.activity.kid,
					title: this.activity.title,
					content: this.activity.content,
					imgUrl: this.activity.coverPlan,
				}
				this.nowDate = this.activity.currentDate
				this.setActivityStatus(this.activity.activityStatus);
				this.$eventBus.$emit('activityDataRefresh', this.activity);
				if (!this.inApp) {
					let content = this.activity.content || '';
					this.$utils.setBrowserShareInfo(this.activity.title, content);
				}
			} else {
				throw new Error(res.data.msg);
			}
		},
		setActivityStatus(status) {
			// 设置当前倒计时状态
			if (status === Not_STARTED) {
				this.timer = this.activity.beginTime
				this.titleStatus = "距离活动开始还有";
			} else if (status === STARTING) {
				this.timer = this.activity.endTime;
				this.titleStatus = "距离活动结束还有";
			}
			// 如果活动名额已经满
			if (this.activity.joinCount >= this.activity.enrolUpper) {
				this.btnStatus = "名额已满";
			}
			// 设置参加活动按钮状态
			if (status === END) {
				this.btnStatus = "已结束";
				this.titleStatus = "活动已结束";
				this.activity.currentDate = INIT_TIME;
				this.timer = INIT_TIME;
			}
			// 如果已经报名
			if (this.activity.enrolStatus === ALREADY_SIGN_UP) {
				this.btnStatus = "已报名";
			}
		},
		async partActivity(status) {
			if (status === STARTING && this.activity.enrolStatus === SIGN_UP && this.activity.joinCount < this.activity.enrolUpper) {
				await this.getSignUpForm().then(res => {
					this.signUpForm = res;
				});
			}

			// 不需要支付的能在H5参加，需要支付的toast提示
			if (!this.inApp && this.signUpForm.signUpType === 11) {
				this.$toast('请下载圈乎APP完成报名');
				return false;
			}
			if (!this.inApp && this.signUpForm.signUpType === 12) {
				this.$toast('请下载圈乎APP完成报名');
				return false;
			}

			// 如果是第三方
			if (this.inApp && !this.$env.userId && status === STARTING && this.activity.enrolStatus === SIGN_UP && this.activity.joinCount < this.activity.enrolUpper) {
				await this.$user.login();
				return;
			}

			if (!this.inApp && !this.$env.userId && status === STARTING && this.activity.enrolStatus === SIGN_UP && this.activity.joinCount < this.activity.enrolUpper) {
				await this.$eventBus.$emit('login');
				return;
			}

			

			let _signUpForm = this.signUpForm;

			// 已支付完成,但并未报名成功
			if (this.activity.enrolStatus === 13) {
				this.$toast('已支付完成，请勿重复支付');
				return;
			}			
			// 活动未开始toast提示“活动尚未开始，还不能参与
			if (status === Not_STARTED) {
				this.$toast('活动尚未开始，还不能参与');
				return;
			}
			// 活动已结束时，显示已结束状态，点击弹出toast提示“活动已结束”
			if (status === END) {
				this.$toast('活动已结束');
				return;
			}
			// 已报名的，显示已报名状态，点击弹出toast提示“该活动您已报名，无需重复报名”
			if  (this.activity.enrolStatus === ALREADY_SIGN_UP) {
				this.$toast('该活动您已报名，无需重复报名');
				return;
			}
			// 报名的名额已满，显示名额已满状态，点击弹出toast提示“非常抱歉，该活动名额已满”
			if  (this.activity.joinCount >= this.activity.enrolUpper) {
				this.$toast('非常抱歉，该活动名额已满');
				return;
			}
			// 后台发布活动时未配置任何填写项但配置了支付项（支付悠然币或积分）
			if (this.inApp && status === STARTING && _signUpForm.configSources.length === 0 && _signUpForm.phoneRequired === 12 && _signUpForm.signUpType !== 13) {
				this.showModel = true;
				return;
			}
			// 后台发布活动未配置任何填写项和支付项
			if (status === STARTING && _signUpForm.configSources.length === 0 && _signUpForm.phoneRequired === 12  && _signUpForm.signUpType === 13) {
				this.submitPay(_signUpForm);
				return;
			}
			
			// 活动已开始未结束时，显示参与活动按钮，点击进入参与报名界面；
			this.$router.push(`/activity/signup/${this.activity.kid}/join`);
		},
		submitModel() {
			this.submitPay(this.signUpForm);
		},
		closeModel() {
			this.showModel = false;
		}
	},
	async mounted() {
		// 微信授权，掉接口获取活动渠道码		
		// if (!this.inApp && this.isWx && !this.$env.userId) {
		// 	let params = {
		// 		activityInfoId: this.$route.params.activityId,
		// 		type: 2
		// 	}
		// 	let activitCode = await this.$http.get('/services/app/v2/activity/info/activityInfo', { params })
		// 	this.wxOauth(activitCode.data.activityChannelCode);
		// }			
		this.getActivity();
		this.$eventBus.$on('reloadData', this.getActivity);
	},
	beforeDestroy() {
		this.$eventBus.$off('reloadData');
	},

}
</script>

<style scoped>
@import "#/css/var.css";

.signup_wrap {
	background-color: #fff;
	& .notice {
		& .count-down {
			background-color: #fff;
			position: relative;
			&>img {
				width: 100%;
				height: 3.36rem;
				display: block;
			}
			&>.timer {
				width: 100%;
				display: flex;
				justify-content: space-between;
				height: .84rem;
				line-height: 0.84rem;
				position: absolute;
				bottom: 0;
				padding: 0 0.3rem;
				color: #fff;
				font-size: .26rem;
				background: rgba(0, 0, 0, .5);
				&>:first-child>first-child {
					padding-right: .12rem;
				}
				& .icon-clock_line{
					font-size: 1.2em;
				}

				& .title_status {
					font-size: .3rem;
				}
			}
		}
	}
	& .activity-rule {
		margin-top: .2rem;
		padding: .44rem .3rem .14rem;
		padding-bottom: 1rem;
		background-color: #fff;
		&>h4 {
			display: flex;
			color: var(--text-assist-color);
			font-size: .28rem;
		}
		& .rule-icon {
			width: 0.06rem;
			height: 0.3rem;
			align-self: center;
			margin-right: .1rem;
			background-color: #00AFF7;		
		}
	}
	& .activity-btn-wrapper {
		padding: .2rem 0;
		text-align: center;
		background-color: #fff;
		position: fixed;
		width: 100%;
		bottom: 0;
		left: 0;
		border-top: #f3f3f3 solid 1px;
		& .button--block {
			padding: 0;
			height: .68rem;
			border-radius: .16rem;
		}
	}
	& .iPhoneX_btn_join {
		padding: .5rem 0 .7rem 0;
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
