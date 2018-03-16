<template>
	<div class="topic-detail">
		<y-nav title="帖子详情">
			<y-button @click.native.stop="moreActionMixinOpen" slot="nav-right" type="text" class="iconfont icon-more_line"></y-button>
		</y-nav>
		<div class="topic-info" v-if="topicData.kid">
			<div class="topic-banner">
				<img :src="topicData.imgUrl" v-if="topicData.imgUrl" />
			</div>
			<div class="topic-text">
				<div class="title">#{{topicData.title}}#</div>
				<div class="content" v-text="topicData.content"></div>
				<div class="time">{{topicData.createDate | recentTime}}</div>
			</div>
		</div>

		<y-flow-detail :data="invitationData"></y-flow-detail>
		<y-detail-action :action-option="['comment', 'repost', 'reward', 'like']" v-if="invitationData.kid" :resource-data="invitationData"></y-detail-action>
	</div>
</template>

<script>
	import DetailAction from "@/components/detail-action";
	import moreActionMixin from '@app/mixins/more-action'
	export default {
		name: 'topic-detail',
		mixins: [moreActionMixin],
		components: {
			[DetailAction.name]: DetailAction
		},
		data() {
			return {
				topicData: {},
				invitationData: {},
				moreActionDataModelKey: 'invitationData',
				moreActionMenuList: [7, 3]
			}
		},
		async mounted() {
			this.$indicator.open();
			try {
				let invitationRes = await this.$http.get(`/services/app/v2/post/single?kid=${this.$route.params.invitationId}`)
				let invitationResData = invitationRes.data
				if (invitationResData.code === '200') {
					this.invitationData = invitationResData.data
					let invitationData = this.invitationData
					let topicId = invitationData.topicId
					if (this.$env.userId === invitationData.user.userId) {
						this.moreActionMenuList.push(4);
					} else {
						this.moreActionMenuList.push(5);
					}
					if (parseInt(invitationData.shelveFlag) !== 11 && parseInt(invitationData.delFlag) !== 11) {
						let topicRes = await this.$http.get(`/services/app/v2/topic/single?kid=${topicId}`)
						let topicResData = topicRes.data
						if (topicResData.code === '200') {
							this.topicData = topicResData.data
						}
					}
				}
			} catch (error) {
				this.$indicator.close();
			}
			this.$indicator.close();
		}
	}
</script>

<style>
</style>