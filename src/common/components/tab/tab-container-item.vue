/**
*	Author: zhulin
*
*/
<template>
	<div v-if="!updateNow" v-show="$parent.swiping || id == $parent.currentActive" class="tab-container-item ">
		<slot></slot>
	</div>
</template>
<script>
export default {
	name: 'y-tab-container-item',
	props: {
		id: String | Number,
	},

	data() {
		return {
			updateNow: false
		}
	},

	mounted() {
		this.$eventBus.$on('updateTab', this.reload)
	},

	beforeDestroy() {
		this.$eventBus.$off('updateTab', this.reload);
	},

	methods: {
		reload() {
			if (this.id !== this.$parent.currentActive)
				return;
			this.updateNow = true;
			this.$nextTick(() => {
				this.updateNow = false;
			})
		},
	}
}
</script>
<style >
tab-container-item {
	flex-shrink: 0;
	width: 100%;
}
</style>
