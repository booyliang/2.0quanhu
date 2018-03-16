<template>
		<div class="comment_tool">
			<div class="comment_tool-main" :class="$env.specialDeviceName">
				<span class="input-view" @click.stop="openCommentInput">{{ placeholder}}</span>
			</div>
		</div>
	</template>
	<script>
		import commentMixin from '@/components/detail-action/components/comment/mixins/comment'
		export default {
			mixins: [commentMixin],
			props: {
				placeholder: {
					type: String,
				},
				resourceData: Object,
			},
			methods: {
				async openCommentInput() {
					await this.$user.login();
					await this.commentMixinReplyComment(this.resourceData);
				}
			},
			
		}
	</script>
	
	<style>
		.comment_tool {
			height: 1.07rem;
		}
		.comment_tool-main {
			display: flex;
			align-items: center;
			position: fixed;
			right: 0;
			bottom: 0;
			left: 0;
			height: 1.07rem;
			background: #f8f8f8;
			padding: 0 .3rem;
			border-top: 1px solid #ddd;
			& .input-view {
				display: flex;
				align-items: center;
				padding-left: .2rem;
				flex: 1;
				height: .58rem;
				border-radius: .1rem;
				background: #fff;
				font-size: .28rem;
				color: #999;
				border: 1px solid #ddd;
			}
		}
		.comment_tool-main.iPhoneX{
			padding-bottom: .6rem;
			height: 1.67rem;
		}
		
	</style>
	