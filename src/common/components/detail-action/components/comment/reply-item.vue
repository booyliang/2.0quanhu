<template>
		<div class="comment_reply_item">
			<p class="comment_reply_item-content">
				<span class="comment_reply_item-nickname" ><i @click.stop="toUserHomePage(itemData.user.userId)">{{ itemData.user.userNickName }}</i></span>
				<template v-if="itemData.parentUser.userNickName">
					<span>回复</span>
					<span class="comment_reply_item-nickname"><i  @click.stop="toUserHomePage(itemData.parentUser.userId)">{{ itemData.parentUser.userNickName}}</i></span>
				</template>
				<strong @click.stop="handleClick">: {{ itemData.contentComment }}</strong>
			</p>
		</div>
	</template>
	<script>
		import press from '@/directives/press'
		import itemMixin from './mixins/item'
		import commentMixin from './mixins/comment'
		export default {
			mixins: [itemMixin, commentMixin],
			directives: {
				press,
			},
			props: {
				itemData: {
					type: Object,
					default: () => {}
				},
				index: Number,
				resourceData: Object
			},
			methods: {
				toUserHomePage(userId) {
					this.$yryz.router({link: `quanhu://open/user/home?userId=${userId}`})
				},
				handleClick() {
					// console.log(parseInt(this.$env.userId), parseInt(this.resourceData.user.userId), parseInt(this.data.createUserId) )
					if (!this.$yryz.isNative()) return false;
					
					let handleDelete = {
						text: '删除',
						handler: () => {
							console.log('openReplyItemActionSheet')
							this.commentItemMixinDelete(this.itemData);
						}
					};
					let handleArr = [
						{
							text: '回复',
							handler: () => {
								this.commentMixinReplyComment(this.itemData, this.index)
							}
						},
						{
							text: '举报',
							handler: () => {
								this.$yryz.report({
									moduleEnum: "1011",
									resourceId: this.itemData.kid
								})
								
							}
						},
					]
					let isAuthor = parseInt(this.$env.userId) === parseInt(this.resourceData.user.userId) ? true : false; // 资源发布者 
					let isCommentUser = parseInt(this.$env.userId) === parseInt(this.itemData.user.userId) ? true : false; // 评论发布者
					if (isAuthor) { // 是资源发布者
						handleArr.splice(1, 0, handleDelete); // 回复/删除/举报
						// console.log("回复/删除/举报", JSON.stringify(handleArr))
						if (isCommentUser) {
							handleArr.splice(2, 1);  // 回复/删除
						}
					} else {
						if (isCommentUser) {
							handleArr.splice(1, 1, handleDelete);
							// console.log("回复/删除")
						}
					}
					this.$actionsheet(handleArr);
				}
			}
		}
	</script>
	
	<style>
		.comment_reply_item {
			display: flex;
			& ~ .comment_reply_item {
				margin-top: .15rem;
			}
		}
		.comment_reply_item-content {
			flex: 1;
			color: #4a4a4a;
			font-size: .26rem;
			line-height: .36rem;
			white-space: pre-wrap;
		}
		.comment_reply_item-delete {
			width: 1.3rem;
			flex: 0 0 1.3rem;
			text-align: right;
	
			& .icon-delete {
			  color: #999;
			}
		}
		.comment_reply_item-nickname i{
			color: #1d7dd6;
		}
	
	</style>
	