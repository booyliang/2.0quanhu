<template>
		<section class="tab-demo">
			<y-tab-bar v-model="tabId" :tabOption="tabOption"></y-tab-bar>
			<div class="content">
				<p>{{content}}</p>
				<p>{{content}}</p>
				<p>{{content}}</p>
			</div>
			<br><br>
			<y-tab-bar v-model="tabId2" :tabOption="tabOption2"></y-tab-bar>
			<y-tab-container v-model="tabId2">
				<y-tab-container-item id="time">
					<p>TabContainerItem1</p>
					<p>TabContainerItem1</p>
					<p>TabContainerItem1</p>
				</y-tab-container-item>
				<y-tab-container-item id="hot">
					<p>TabContainerItem2</p>
					<p>TabContainerItem2</p>
					<p>TabContainerItem2</p>
				</y-tab-container-item>
			</y-tab-container>
		</section>
</template>
<script>
import {YTabBar, YTabContainer, YTabContainerItem} from './'
export default{
	components: {
		YTabBar,
		YTabContainer,
		YTabContainerItem
	},
	data() {
		return {
			tabId: this.$route.params.tabId || 'time',
			tabOption: [{id: 'time', text: this.$R('time')}, {id: 'hot', text: this.$R('hot')}],
			content: '',
			tabId2: this.$route.params.tabId || 'time',
			tabOption2: [{id: 'time', text: '精华推荐'}, {id: 'hot', text: '全部动态'}]
		};
	},
	created() {
		this.content = this.tabId;
	},
	watch: {
		tabId(val) {
			this.content = this.tabId;
		}
	}
}
</script>
<style>
	.tab-demo {
		& .content{
			margin-top: 0.9rem;
			background: #fff;
		}
	}
</style>