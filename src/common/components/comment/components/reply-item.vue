<template>
		<div class="comment_reply_item" v-press="handlePress">
			<p class="comment_reply_item-content">
				<span class="comment_reply_item-nickname" @click.stop="toUserHomePage(itemData.createUserId)">{{ itemData.nickName }}</span>
				<template v-if="itemData.targetUserId">
					<span>回复</span>
					<span class="comment_reply_item-nickname" @click.stop="toUserHomePage(itemData.targetUserId)">{{ itemData.targetUserNickName || itemData.targetUserId }}</span>
				</template>
				<strong>: {{ itemData.contentComment }}</strong>
			</p>
		</div>
	</template>
	<script>
		import press from '@/directives/press'
		import itemMixin from '@/components/comment/mixins/item'
		export default {
			mixins: [itemMixin],
			directives: {
				press,
			},
			props: {
				itemData: {
					type: Object,
					default: () => {}
				}
			},
			methods: {
				toUserHomePage(userId) {
					this.$yryz.router({link: `quanhu://open/user/home?userId=${userId}`})
				},
				handlePress(itemData) {
					if (!this.$yryz.isNative()) return false;
					console.log(this.$env.userId, this.itemData.createUserId)
					let handleDelete = {
						text: '删除',
						handler: () => {
							this.$toast('删除');
							this.commentItemMixinDelete(itemData);
						}
					};
					let handleArr = [
						{
							text: '回复',
							handler: () => {
								this.$toast('回复');
							}
						},
						{
							text: '举报',
							handler: () => {
								this.$toast('举报');
							}
						},
					]
					if (parseInt(this.$env.userId) === parseInt(this.itemData.createUserId)) {
						handleArr.splice(1, 1, handleDelete);
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
		.comment_reply_item-nickname {
			color: #1d7dd6;
		}
	
	</style>
	