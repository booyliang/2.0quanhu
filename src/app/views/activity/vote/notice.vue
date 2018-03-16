<template>
	<div class="platform-activity-prize-wrap" v-if="data">
		<fm-header :status="data.activityStatus" :coverPlan="data.coverPlan">
				<y-count-down v-if="currTime && showCount" :endDate="endTime" :nowDate="currTime" @countdown_end="countdownEnd"></y-count-down>
		</fm-header>
		<y-content-source v-if="data.prizesSources" :content-source="data.prizesSources"></y-content-source>
		<y-message v-else :icon="icon" :title="msgTitle">
			<span v-text="msgSubTitle"></span>
		</y-message>
	</div>
</template>
<script>
import YContentSource from '@/components/content-source';
import YMessage from '@/components/message';
import HeaderImg from '../components/header-img';
import CountDowm from '../components/count-down';
import icon from '@/assets/no_data@2x.png';
export default {
	name: 'vote-prize',
	components: {
		[HeaderImg.name]: HeaderImg,
		[CountDowm.name]: CountDowm,
		YContentSource,
		YMessage,
	},
	computed: {
		endTime() {
			return this.data.activityStatus === 12 ? this.data.endTime : this.data.beginTime;
		},		
		msgTitle() {
			return this.data.activityStatus === 13 ? '系统正在核对中奖者信息，相关中奖公告' : '活动尚未结束';
		},
		msgSubTitle() {
			return this.data.activityStatus === 13 ? '稍后给出，请耐心等待' : '活动相关奖品信息请查看活动介绍';
		}
	},
	data() {
		return {
			data: null,
			showCount: true,
			currTime: null,
			icon,
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
		countdownEnd() {
			this.showCount = false;
			this.data.activityStatus = 12;
		}
	}
}
</script>
<style>
@import '#/css/var.css';
.platform-activity-prize-wrap {	
	padding-top: .68rem; 
	& .content_source {
		padding: 0 .3rem;
	}
}
</style>

