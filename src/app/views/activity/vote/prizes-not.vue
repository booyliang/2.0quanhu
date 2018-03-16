<template>
	<div class="activity_prizes_not_wrap">
		<div class="prizes_title">
			<img src="../../../assets/plat_activity/h5_prizes_title1@2x.png" alt="">
		</div>

		<p v-text="noRewardContent" class="no_reward_content"></p>

		<y-button block @click.native="downloadApp" class="download_button">下载圈乎APP，投更多票</y-button>
	</div>
</template>
<script>
import Mixin from '../mixins';
export default {
	mixins: [Mixin],
	data() {
		return {
			noRewardContent: '',
		}
	},
	async mounted() {
		document.title = '参与成功';
		// 无奖励文案
		let params = { activityInfoId: this.$route.params.activityId, }
		let resData = await this.$http.get(`/services/app/v2/activity/vote/noPrize`, { params })
		if (resData.data.code === '200') {
			this.noRewardContent = resData.data.data.noRewardContent || '';
		}
	}
}
</script>
<style>
.activity_prizes_not_wrap {
	width: 100%;
	height: 4.48rem;
	background-size: 100%;
	background-repeat: no-repeat;
	background-position: top center;
	background-image: url('../../../assets/plat_activity/h5_prizes_header@2x.png');
	padding-top: .1rem;
	min-height: 100vh;
	background-color: #fff;
	& .prizes_title {
		width: 3.8rem;
		margin: 0 auto;
		margin-top: 1rem;
	}
	& .no_reward_content {
		margin-top: 1.5rem;
		text-align: center;
		color: #666;
		font-size: .26rem;
	}
	& .download_button {
		margin-top: 1rem;
	}
}
</style>


