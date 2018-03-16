<template>
	<div class="activity_prizes_wrap">
		<div class="prizes_title"><img :src="headerImg" alt=""></div>
		<div class="prize" v-if="prizes">
			<h2 v-html="showTitleTips"></h2>
			<div v-for="(item, index) of prizes" :key="index" class="volume-container">
				<template v-if="item.prizesType === 11">
					<div class="volume" :class="{'ticket_over': item.issueNum === 0}">
						<div class="volume_left">
							<p class="ticket_type">
								<span class="prizes_name" v-text="item.prizesName"></span>
								<!-- <span class="only_code" v-if="item.onlyCode" v-text="item.onlyCode"></span> -->
							</p>
							<p class="ticket_date" v-text="prizesTime(item)"></p>
							<div v-text="item.remark" class="prizes_remark"></div>
						</div>
						<div class="divider">
							<div class="round_top"></div>
							<div class="line"></div>
							<div class="round_bottom"></div>
						</div>
						<div class="volume_right">
							<p v-text="item.canNum + '票'" class="ticket_num"></p>
							<p class="ticket_btn">{{item.state && item.state === 2 ? '已使用' : '可使用'}}</p>
						</div>
					</div>
				</template>
				<template v-else>
					<voucher-item :data="item"></voucher-item>
				</template>
			</div>
		</div>

		<div class="bind_phone" v-if="!isBindPhone">
			<y-verifying-phone v-model="postData" :code="code"></y-verifying-phone>
		</div>

		<div v-if="prizes">
			<y-button v-if="isBindPhone" block @click.native="downloadApp" class="get_button">下载圈乎APP使用奖励</y-button>
			<y-button v-else block @click.native="getPrizes" class="get_button">领取奖励</y-button>
		</div>
	</div>
</template>
<script>
import List from '@/components/list';
import Item from '@/components/item';
import VoucherItem from '../components/voucher-item';
import YVerifyingPhone from '../components/verifying-phone'
import Mixin from '../mixins';
export default {
	components: {
		[List.name]: List,
		[Item.name]: Item,
		YVerifyingPhone,
		VoucherItem,
	},
	mixins: [Mixin],
	data() {
		return {
			prizes: [],
			postData: {
				userPhone: '',
				veriCode: '',
			},
			code: '10',
			isBindPhone: true,
			isGetPrizes: false,
		}
	},

	computed: {
		headerImg() {
			return this.isGetPrizes
				? require('../../../assets/plat_activity/h5_prizes_title@2x.png')
				: require('../../../assets/plat_activity/h5_prizes_title1@2x.png')
		},
		showTitleTips() {
			return this.isBindPhone
				? `奖品已发放至${this.postData.userPhone}的账户<br>登录圈乎APP即可使用奖励`
				: '为了感谢您对参赛选手的支持，您已获得如下奖励：';
		},
		status() {
			return
		}
	},
	async mounted() {
		document.title = '参与成功';
		// let userIdentity = window.sessionStorage.getItem('userIdentity');
		// this.isBindPhone = userIdentity === '0';
		// 获取用户信息 手机号
		let resData = await this.$http.get(`/services/app/v2/user/find`);
		if (resData.data.code === '200') {
			let userPhone = resData.data.data.userPhone;
			this.isBindPhone = !!userPhone;
			if (userPhone) {
				this.postData.userPhone = userPhone;
				this.submit(); // 领取奖品
				return;
			}
		} else {
			this.isBindPhone = false;
		}
		
		// 奖品列表信息
		let params = { activityInfoId: this.$route.params.activityId, }
		this.$indicator.open('加载中...');
		resData = await this.$http.get(`/services/app/v2/activity/vote/prizeslist`, { params })
		this.$indicator.close();
		if (resData.data.code === '200') {
			this.prizes = resData.data.data.entities || [];
			let prizesOverList = this.prizes.filter(item => item.issueNum > 0);
			if (prizesOverList.length === 0) { // 奖品已领完
				this.$router.replace({ name: 'prizesNot' }); // 无奖励页面
			}
		}
	},
	methods: {
		transformTime(time) {
			let date = new Date(time);
			return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
		},
		prizesTime(item) {
			return this.transformTime(item.beginTime) + ' 至 ' + this.transformTime(item.endTime);
		},
		async validation() {
			if (!this.verifyPhone(this.postData.userPhone)) {
				this.$toast('请输入正确的手机号');
				return false;
			}
			if (this.postData.veriCode === '') {
				this.$toast('请输入短信验证码');
				return false;
			}
			let params = {
				phone: this.postData.userPhone,
				verifyCode: this.postData.veriCode,
			}
			let res = await this.$http.post(`/services/app/v2/user/activityCheckPhone`, params);
			if (res.data.code !== '200') 
				return false;
			// let userIdentity = window.sessionStorage.getItem('userIdentity');
			// if (userIdentity === '1') window.sessionStorage.setItem('userIdentity', '0');
			return true;
		},
		getPrizes() {
			if (!this.validation()) return;
			this.isGetPrizes = true;
			this.submit();
		},
		async submit() {
			let params = {
				activityInfoId: this.$route.params.activityId,
				phone: this.postData.userPhone,
			}
			this.$indicator.open('加载中...');
			let res = await this.$http.post(`/services/app/v2/activity/vote/getPrize`, params)
			this.$indicator.close();
			if (res.data.code === '200') {
				this.isBindPhone = true;
				// 已领过奖 || 奖品已领完
				if (res.data.data.receiveFlag === 11 || res.data.data.remainingFlag === 11) {
					this.$router.replace({ name: 'prizesNot' }); // 无奖励页面
					return;
				}
				this.prizes = res.data.data.prizes || [];
			}
		}
	}
}
</script>
<style>
@import "#/css/var.css";
.activity_prizes_wrap {
	position: relative;
	width: 100%;
	background-size: 100% 4.48rem;
	background-repeat: no-repeat;
	background-position: top center;
	background-image: url('../../../assets/plat_activity/h5_prizes_header@2x.png');
	padding-top: .001rem;
	padding-bottom: .4rem;
	min-height: 100vh;
	background-color: #fff;
	& .prizes_title {
		width: 3.8rem;
		margin: 0 auto;
		margin-top: 1.3rem;
	}
	& .prize {
		position: relative;
		margin-top: 1.6rem;
		margin-bottom: .6rem;
		& h2 {
			color: #666;
			font-size: .26rem;
			text-align: center;
			margin-bottom: .6rem;
		}

		& .volume-container {
			margin-top: .3rem;
			& .volume {
				position: relative;
				display: flex;
				justify-content: space-between;
				width: 7.1rem;
				margin: 0 auto;
				color: #fff;
				background: linear-gradient(#3d9af1, #54aaf9);
				border-radius: .2rem;
				padding: .4rem .3rem;
				min-height: 2.26rem;

				& .volume_left {
					max-width: 4.2rem;
				}
				& .ticket_type {
					font-size: .36rem;

					& .prizes_name {
						font-weight: bold;
					}
					& .only_code {
						font-size: .32rem;
						margin-left: .1rem;
					}
				}

				& .prizes_date {
					margin-top: .2rem;
					font-size: .26rem;
				}

				& .prizes_remark {
					margin-top: .5rem;
					font-size: .24rem;
				}
				& .divider {
					position: absolute;
					top: 0;
					left: 4.9rem;
					display: flex;
					flex-direction: column;
					justify-content: space-around;
					align-items: center;
					height: 100%;

					& .round_top,
					& .round_bottom {
						width: .24rem;
						height: .12rem;
						border-radius: 0 0 .12rem .12rem;
						position: absolute;
						top: 0;
						background-color: #fff;
					}
					& .round_bottom {
						border-radius: .12rem .12rem 0 0;
						top: auto;
						bottom: 0;
					}
					& .line {
						height: calc(100% - .8rem);
						border-left: 1px dashed #fff;
					}
				}
				& .volume_right {
					text-align: center;
					padding-right: .18rem;
					margin-top: .24rem;
				}
				& .ticket_num {
					font-size: .5rem;
				}
				& .ticket_btn {
					width: 1.2rem;
					/* height: .4rem; */
					/* line-height: .4rem; */
					font-size: .24rem;
					border: 1px solid #fff;
					border-radius: 1rem;
					margin-top: .3rem;
				}
			}
			& .volume_over {
				background: #d7d7d7;
			}
		}
	}
	& .bind_phone {
		width: 5.4rem;
		margin: 0 auto;
	}

	& .get_button {
		margin-top: .4rem;
	}
}
</style>


