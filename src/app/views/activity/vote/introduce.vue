<template>
	<div class="introduction-wrap" v-if="data">
		<!--活动主页头部-->
		<fm-header :status="data.activityStatus" :coverPlan="data.coverPlan">
			<y-count-down v-if="currTime && showCount" :endDate="endTime" :nowDate="currTime" @countdown_end="countdownEnd"></y-count-down>
		</fm-header>
		<y-list>
			<!-- 活动时间 -->
			<y-item vertical v-if="data.introduceSources">
				<div slot="head">活动奖励</div>
				<y-content-source slot="foot" :content-source="data.introduceSources"></y-content-source>
			</y-item>

			<!-- 活动简介 -->
			<y-item vertical v-if="data.contentSources">
				<div slot="head">活动简介</div>
				<y-content-source slot="foot" :content-source="data.contentSources"></y-content-source>
			</y-item>
		</y-list>
	</div>
</template>

<script>
import YContentSource from '@/components/content-source';
import HeaderImg from '../components/header-img';
import CountDowm from '../components/count-down';
import YList from '@/components/list';
import YItem from '@/components/item';
import moment from 'moment';

export default {
	name: 'vote-introduction',
	components: {
		YList, YItem, YContentSource,
		[HeaderImg.name]: HeaderImg,
		[CountDowm.name]: CountDowm,
	},
	data() {
		return {
			data: null,
			showCount: true,
			currTime: '',
		}
	},
	computed: {
		endTime() {
			return this.data.activityStatus === 12 ? this.data.endTime : this.data.beginTime;
		}
	},
	async mounted() {
		let params = { activityInfoId: this.$route.params.activityId }
		let res = await this.$http.get(`/services/app/v2/activity/vote/detail`, { params })
		let resData = res.data;
		if (resData.code === '200') {
			this.data = resData.data;
			this.currTime = this.data.currentDate;
		}
	},
	methods: {
		// 倒计时结束
		countdownEnd() {
			this.showCount = false;
			this.data.activityStatus = 12;
		},
	}
}
</script>

<style>
@import "#/css/var.css";
.introduction-wrap {
	min-height: calc(100vh - 1.28rem);
	padding-top: .68rem;
	background-color: #fff;
	& .list {
		& .item {
			padding: 0 .3rem .3rem;
			& .item-wrap {
				padding: .4rem 0 0;
			}
		}
		& .item-head {
			font-size: .28rem;
			color: #999;
			border-left: 2px solid #5DB1FF;
			padding-left: .1rem;
			line-height: 1;
		}
		& .item-foot {
			font-size: .32rem;
			line-height: 20px;
			margin-top: .1rem;
		}
	}
	& .content_source-text {
		margin: 0;
	}
}
</style>
