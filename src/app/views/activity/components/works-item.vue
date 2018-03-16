<template>
	<div class="works_item_wrap">
		<router-link :to="link" class="item_body">
			<div class="item_cover">
				<img :src="data.coverPlan | imageResize(2)" class="flow_item-thumb">
				<div>
					<div class="work_item-title" v-text="data.content || (data.user && data.user.userNickName)"></div>
					<!-- <div v-else class="work_item-title" v-text="data.user && data.user.userNickName"></div> -->
					<!-- <div v-else class="work_item-title" v-text="data.user && data.user.userNickName" @click.stop.prevent="toPersonalHome"></div> -->
					<div v-if="content" class="item_content" v-text="content"></div>
					<div class="work_item-footer">
						<span>票数：<i v-text="totalCount"></i></span>
						<span>编号：<i v-text="voteNo"></i></span>
					</div>
				</div>
			</div>
		</router-link>
		<div class="foot_button">
			<y-button block type="text" @click.native.stop="toDetail">帮TA拉票</y-button>
			<span></span>
			<y-button block type="text" :disabled="noHasVote" @click.native.stop="voted">{{noHasVote ? '票已投完' : '投TA一票'}}</y-button>
		</div>
		<state-label v-if="!!sort" :sort="sort"></state-label>
	</div>
</template>

 <script type="text/javascript">
import YButton from '@/components/button';
import StateLabel from '../components/state-label';
import moreActionMixin from '../../../mixins/more-action'
export default {
	name: 'work-item',
	components: {
		YButton,
		[StateLabel.name]: StateLabel,
	},
	mixins: [moreActionMixin],
	props: {
		data: {
			type: Object,
			required: true
		},
		sort: Number,
		noVote: Boolean,
	},
	watch: {
		data(val) {
			this.totalCount = val.totalCount;
		},
		noVote(val) {
			this.noHasVote = val;
		}
	},
	data() {
		return {
			inApp: !!this.$yryz.isNative(),
			totalCount: this.data.totalCount,
			noHasVote: this.noVote,
			hasVotes: 0,
			configVotes: 0,
			voteType: 1,
			shareData: {},
			moreActionDataModelKey: 'shareData',
			moreActionMenuList: [7],
		}
	},
	computed: {
		content() {
			return this.data.content1 || this.data.content2 || '';
		},
		voteNo() {
			return `${this.data.voteNo}`
		},
		link() {
			return { name: 'worksDetail', params: { id: this.data.kid } };
		}
	},
	mounted() {
		this.hasVotes = this.inApp ? this.data.inAppVoteCount : this.data.otherAppVoteCount;
		this.configVotes = this.inApp ? this.data.inAppVoteConfigCount : this.data.otherAppVoteConfigCount;
		this.voteType = this.inApp ? this.data.inAppVoteType : this.data.otherAppVoteType;
		this.noHasVote = this.hasVotes >= this.configVotes && this.data.userRollFlag === 10;

	},
	methods: {
		toPersonalHome(e) {
			console.log(`跳转wap端${this.data.user.userNickName}(${this.data.user.userId})的个人主页，暂无地址。`);
		},
		toDetail() {
			if (this.inApp) {
				let activityData = this.$attrs['activityData'];
				let content = this.data.content || this.data.content1 || this.data.content2 || '';
				this.shareData = {
					kid: activityData.kid,
					title: activityData.title,
					content: activityData.content,
					imgUrl: activityData.coverPlan,
				}
				this.moreActionMixinOpen();
				return;
			}
			this.$router.push({
				name: 'worksDetail',
				params: { id: this.data.kid }
			});
		},
		async voted() {			
			// console.log('activityData:', this.$attrs['activityData']);
			let activitydata = this.$attrs['activityData'];
			if (activitydata.activityStatus === 12) {
				let start = activitydata.activityVoteBegin;
				let end = activitydata.activityVoteEnd;
				let current = activitydata.currentDate;
				if (current >= end) {
					this.$toast('投票已结束，无法继续投票');
					return;
				}
				if (current < start) {
					this.$toast('投票尚未开始，暂时不能投票');
					return;
				}
			} else if (this.$attrs.activityData.activityStatus === 11) {
				this.$toast('活动尚未开始，暂时不能投票');
				return;
			} else {
				this.$toast('活动已结束，无法继续投票');
				return;
			}

			if (this.inApp)
				await this.$user.login();

			if (!this.$env.userId) {
				this.$eventBus.$emit('login');
				return;
			}

			let params = {
				activityInfoId: this.$route.params.activityId,
				candidateId: this.data.kid,
				voteNo: this.data.voteNo,
				otherFlag: this.inApp ? 0 : 1,
			}
			this.$indicator.open('投票中...');
			let response = await this.$http.post(`/services/app/v2/activity/vote/single`, params)
			this.$indicator.close();
			let resData = response.data;
			if (resData.code === '200') {
				this.totalCount++;
				this.hasVotes = resData.data.haveFreeVote;
				if (this.hasVotes >= this.configVotes && resData.data.userRollFlag === 10) {
					this.noHasVote = true;
					this.$eventBus.$emit('updateVoteStatus');
				}
				if (this.inApp) {
					this.$toast('投票成功');
				} else {
					if (resData.data.prizesFlag === 11) { // 有奖品
						this.$router.push({ name: 'prizes' });
						return;
					}
					this.$router.push({ name: 'prizesNot' }); // 无奖励页面
				}
				if (this.sort) {
					if (this.sort === 1) return;
					this.$emit('change', this.sort - 1, this.totalCount);
				}
			}
		}
	}
};
</script>

<style>
@import '#/css/var.css';
.works_item_wrap {
	position: relative;
	background-color: #FFF;
	padding: .4rem .3rem 0;
	margin-bottom: .1rem;
	& .item_cover {
		position: relative;
		display: flex;
		justify-content: flex-start;
		&>div {
			margin-left: .2rem;
			width: 4.46rem;  
		}
		& .work_item-title {
			 /* @apply --text-cut;   */
			@apply --text-cut-multi-line;  
			-webkit-line-clamp: 1;  
			font-size: .34rem; 
			font-weight: bold;
			word-break: break-all;
		}
		&>img {
			width: 2.24rem;
			height: 2.24rem;
		}
		& .item_content {
			@apply --text-cut-multi-line;
			-webkit-line-clamp: 2;
			width: 4.46rem;
			font-size: .28rem;
			line-height: 1.4;
			color: #666;
			margin-top: .2rem;
		}

		& .work_item-footer {
			/* position: absolute; */
			/* bottom: .28rem; */
			margin-top: .3rem;
			font-size: .28rem;
			color: var(--text-assist-color);
			& :first-child {
				margin-right: .2rem;
			}
			& i {
				color: #F8BC1A;
			}
		}
	}
	& .foot_button {
		color: var(--theme-color);
		border-top: 1px solid #ddd;
		display: flex;
		justify-content: space-around;
		margin-top: .4rem;

		& .disabled {
			color: var(--text-tips-color);
		}
		& span {
			display: inline-block;
			border-right: 1px solid #eee;
			margin: .12rem 0;
		}
		& .button {
			font-size: .28rem;
			padding: 0.6em 1em;
		}
	}
}

.works_item_wrap:last-child {
	margin-bottom: 0;
}
</style>
