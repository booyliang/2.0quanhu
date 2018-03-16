<template>
	<div class="platform-activity-rank-wrap">
		<y-load-more-remote :request="request" @loaded="handleLoaded" @empty="empty" :endTip="!isEmpty">
			<div>
				<y-works-item :activityData="$attrs.activityData" v-for="(item, index) of list" :key="index" :data="item" :sort="index+1" :noVote="noVote" @change="changePosition"></y-works-item>
			</div>
		</y-load-more-remote>
		<y-message v-if="isEmpty" :icon="icon" :title="msgTitle">
			<span>现在参加赢得更多优势</span>
		</y-message>
	</div>
</template>
<script>
import LoadMoreRemote from '@/components/load-more-remote'
import YWorksItem from '../components/works-item';
import YMessage from '@/components/message';
import icon from '@/assets/no_friend@2x.png';
export default {
	name: 'vote-rank',
	components: {
		YWorksItem, YMessage,
		[LoadMoreRemote.name]: LoadMoreRemote,
	},
	computed: {
		msgTitle() {
			return '还没有人参与活动';
		}
	},

	data() {
		return {
			icon,
			list: [],
			isEmpty: false,
			request: {
				url: `/services/app/v2/activity/candidate/rank`,
				params: {
					activityInfoId: this.$route.params.activityId,
					otherFlag: this.$yryz.isNative() ? 0 : 1,
				}
			},
			noVote: false,
		}
	},
	methods: {
		handleLoaded(list, item) {
			this.list.push(...list);
		},
		empty() {
			this.isEmpty = true;
		},
		changePosition(index, vote) {
			if (vote > this.list[index - 1].totalCount) {
				let temp = this.list[index - 1];
				this.$set(this.list, index - 1, this.list[index]);
				this.$set(this.list, index, temp);
				this.$set(this.list[index - 1], 'totalCount', vote);
			}
		},
		updataVoteStatus() {
			this.noVote = true;
		}
	},
	mounted() {
		this.$eventBus.$on('updateVoteStatus', this.updataVoteStatus);
	},
	beforeDestroy() {
		this.$eventBus.$off('updateVoteStatus');
	},
}
</script>
<style>
@import '#/css/var.css';
.platform-activity-rank-wrap {
	padding-top: .68rem; 
}
</style>

