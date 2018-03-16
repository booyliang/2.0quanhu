<template>
	<router-view :activity-data="activityData" v-if="activityData"></router-view>
</template>
<script>
export default {
	data() {
		return {
			activityData: {},
			activityId: ''
		}
	},
	mounted() {		
		this.activityId = this.$route.params.activityId;
		this.getData();
		this.$eventBus.$on('reloadData', this.getData);
	},
	beforeDestroy() {
		this.$eventBus.$off('reloadData');
	},
	methods: {
		async getData() {
			let params = { activityInfoId: this.activityId }
			let res = await this.$http.get(`/services/app/v2/activity/vote/detail`, { params })
			let resData = res.data;
			if (resData.code === '200') {
				this.activityData = resData.data;
				this.$eventBus.$emit('activityDataRefresh', this.activityData);
			}
		},
	},
	activated() {
		let currentId = this.$route.params.activityId;
		if (this.activityId !== currentId) {
			this.$eventBus.$emit('global-message', { type: 'refresh' });
		}
	}
}
</script>
