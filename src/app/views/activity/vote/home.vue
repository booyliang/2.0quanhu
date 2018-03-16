<template>
	<div class="activity_home_wrap" :class="$env.specialDeviceName + '_home_wrap'">
		<y-search @search="onSearch" :class="{'search_shadow': isScroll}"></y-search>
		<div class="intro_banner">
			<img :src="$attrs.activityData.coverPlan | imageResize(5)" :alt="$attrs.activityData.title" @click="picturePreview">
		</div>

		<y-load-more-remote v-if="showList" :request="request" @loaded="handleLoaded" @empty="empty" :endTip="!isEmpty">
			<div class="candidate_list">
				<y-works-item :activityData="$attrs.activityData" v-for="(item, index) of list" :key="index" :data="item" :noVote="noVote"></y-works-item>
			</div>
		</y-load-more-remote>
		<y-message v-if="isEmpty && !request.params.queryCondition" :icon="noDataIcon" title="还没有人参与活动">
			<p>现在参加赢得更多优势</p>
			<y-button block @click.native="join" v-if="isOver">我要参加</y-button>
		</y-message>
		<y-message v-if="isEmpty && request.params.queryCondition" title="未搜索到相关内容" :icon="noSearchResultIcon">
		</y-message>
		<span class="activity-button" v-if="showJoin" @click="join">我要</br>参加</span>
		<y-modal ref="download">
			<div class="download_app">
				<p>请下载APP参与该活动</p>
				<div>
					<y-button @click.native="cancel" class="cancel_btn">取消</y-button>
					<y-button @click.native="downloadApp" class="download_btn">下载APP</y-button>
				</div>
			</div>
		</y-modal>
	</div>
</template>
<script>
import YModal from '@/components/modal';
import noDataIcon from '@/assets/no_friend@2x.png';
import noSearchResultIcon from '@/assets/no_search@2x.png'
import YSearch from '../components/search'
import YWorksItem from '../components/works-item'
import YLoadMoreRemote from '@/components/load-more-remote'
import YMessage from '@/components/message';
import Mixin from '../mixins';
import moment from 'moment';
export default {
	name: 'vote-index',
	components: {
		YModal,
		YSearch,
		YWorksItem,
		YLoadMoreRemote,
		YMessage
	},
	mixins: [Mixin],
	data() {
		return {
			showList: true,
			inApp: !!this.$yryz.isNative(),
			noDataIcon,
			noSearchResultIcon,
			noVote: false,
			isEmpty: false,
			list: [],
			voteDisabled: false,
			joinFlag: false,
			request: {
				url: '/services/app/v2/activity/candidate/list',
				params: {
					activityInfoId: this.$route.params.activityId,
					timestamp: new Date().getTime(),
					queryCondition: '',
					otherFlag: this.$yryz.isNative() ? 0 : 1,
				}
			},
			isScroll: false,
		}
	},
	computed: {
		isOver() {
			let activityData = this.$attrs.activityData;
			let start = activityData.activityJoinBegin;
			let end = activityData.activityJoinEnd;
			let current = activityData.currentDate;
			if (current < start || current >= end) return false;
			return activityData.userFlag === 11	&& activityData.joinCount < activityData.userNum;
		},
		showJoin() {
			let activityData = this.$attrs.activityData;
			if (!this.list.length) return false;
			if (this.joinFlag) {
				activityData['joinFlag'] = 11;
				return false;
			}
			let start = activityData.activityJoinBegin;
			let end = activityData.activityJoinEnd;
			let current = activityData.currentDate;
			if (current < start || current >= end) return false;

			return activityData.activityStatus === 12
				&& activityData.userFlag === 11
				&& activityData.joinFlag === 10
				&& activityData.joinCount < activityData.userNum;
		},
	},
	watch: {
		'$attrs.activityData': 'setShareData',
	},
	mounted() {
		this.$eventBus.$on('updateVoteStatus', this.updataVoteStatus);
		window.addEventListener('scroll', this.scroll)
		let publishSuccess = sessionStorage.getItem('publishSuccess');
		if (publishSuccess) {
			// 刷新数据
			this.list = [];
			this.request.params.timestamp = new Date().getTime();
			this.joinFlag = true;			
			this.$eventBus.$emit('reloadData');
			sessionStorage.removeItem('publishSuccess');
		}
	},
	beforeDestroy() {
		this.$eventBus.$off('updateVoteStatus');
		window.removeEventListener('scroll', this.scroll)
	},
	activated() {
		// console.log('activated')
		this.showList = true;
		this.setShareData();
		this.$eventBus.$off('refreshVoteList', this.refreshVoteList);
		let publishSuccess = sessionStorage.getItem('publishSuccess');
		if (publishSuccess) {
			// 刷新数据
			this.list = [];
			this.request.params.timestamp = new Date().getTime();
			this.joinFlag = true;			
			this.$eventBus.$emit('reloadData');
			sessionStorage.removeItem('publishSuccess');
		}
	},
	deactivated() {
		this.$eventBus.$on('refreshVoteList', this.refreshVoteList);
	},
	methods: {
		picturePreview() {
			if (!this.inApp) return;
			let imgs = [this.$attrs.activityData.coverPlan]
			this.$yryz.picturePreview({
				imageUrls: imgs,
				currentIndex: 1
			})
		},
		scroll() {
			let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			if (scrollTop > 1)
				this.isScroll = true;
			else this.isScroll = false;
		},
		refreshVoteList() {
			this.list = [];
			this.showList = false;
		},
		setShareData() {
			// this.$toast(this.isWx + '-----' + this.$env.userId)
			let activityData = this.$attrs.activityData;
			if (this.isWx && !this.$env.userId) {
				this.wxOauth(activityData.activityChannelCode);
				this.list = [];
				this.request.params.timestamp = new Date().getTime();
			}
			this.$utils.setBrowserShareInfo(activityData.title, activityData.content);
			
		},
		onSearch(value) {
			if (value === this.request.params.queryCondition) return;
			this.list = [];
			this.request.params.queryCondition = value;
		},
		handleLoaded(list, item) {
			this.list.push(...list);
		},
		empty() {
			this.isEmpty = true;
		},
		cancel() {
			this.$refs.download.close();
		},
		async join() {
			let params, res, resData;
			params = { activityInfoId: this.$route.params.activityId }
			if (this.inApp) { await this.$user.login() }
			else {
				if (!this.$env.userId) {
					this.$eventBus.$emit('login');
					return;
				}
				// 视频活动第三方无法参加
				res = await this.$http.get(`/services/app/v2/activity/candidate/config`, { params })
				resData = res.data;
				if (resData.code === '200') {
					let { videoUrl } = JSON.parse(res.data.data.configSources);
					if (videoUrl) {
						this.$refs.download.open();
						return;
					}
				}
				// 微信授权用户绑定手机号
				resData = await this.$http.get(`/services/app/v2/user/find`);
				if (resData.data.code === '200' && !resData.data.data.userPhone) {
					this.$eventBus.$emit('login', { code: '10' }); // 绑定手机号
					return;
				}
			}
			// params = { activityInfoId: this.$route.params.activityId }
			res = await this.$http.get(`/services/app/v2/activity/vote/detail`, { params })
			resData = res.data;
			if (resData.code === '200') {
				if (resData.data.activityStatus === 11) {
					this.$toast('活动未开始');
				} else if (resData.data.activityStatus === 13) {
					this.$toast('活动已结束');
				} else if (resData.data.joinFlag === 11) {
					this.$toast('您已参与活动');
				} else {
					this.$router.push({ name: 'joinWorks' })
				}
			}
		},
		updataVoteStatus() {
			this.noVote = true;
		}
	}

}
</script>
<style>
@import '#/css/var.css';
.activity_home_wrap {
	margin-top: 1.84rem; 

	& .message {
		background: #fff;
		padding-bottom: 2rem;
	}
	& .search_shadow {
		box-shadow: 0px 2px 6px rgba(50, 50, 50, .2)
	}
	& .message-title+* {
		margin: 0;
	}
	& .message>button {
		margin-top: .3rem;
	}
	& .intro_banner {
		width: 100%;
		height: 3.36rem;
		overflow: hidden;
		& img {
			width: 100%;
			height: 100%;  
		}
	}
	& .activity-button {
		@apply --circle;
		position: fixed;
		width: 1.2rem;
		height: 1.2rem;
		bottom: .5rem;
		right: .2rem;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: var(--default-font-size);
		color: #FFF;
		background-color: var(--theme-color);
		line-height: 1;
		box-shadow: 0px 0px 8px rgba(50, 50, 50, .6);
	}
	& .download_app {
		width: 6rem;
		height: 2.76rem;
		border-radius: .2rem;
		background-color: #fff;
		margin: 0 auto;
		text-align: center;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		& p {
			padding-top: .8rem;
			font-size: .32rem;
			color: #333;
		}
		& div {				
			display: flex;
			justify-content: space-between;
			padding: .13rem 0;
			background: #f8f8f8;
		}
		& .button {
			width: 50%;
			border-radius: none !important;
			color: #666;
			background: transparent !important;
			padding: .25em 1em;
		}
		& .download_btn {
			color: #0185ef;
			border-left: 1px solid #e4e4e4;
		}
	}
}
.iPhoneX_home_wrap {
	margin-top: 1.68rem; 
}
</style>
