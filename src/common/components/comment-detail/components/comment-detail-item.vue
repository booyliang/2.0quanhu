<template>
	<div class="comment_detail_item" :class="{'fathercommentwrap':showLike}" v-if="itemData">
		<div class="comment_detail_item-header">
			<y-card v-if="itemData.user" :class="{'fathercomment':showLike}" :src="itemData.user.userImg" :badge="itemData.user.userRole === 11":user-id="itemData.user.userId" :title="itemData.user.userNickName" :assist="itemData.createTime | recentTime"></y-card>
			<y-like v-if="showLike" class="comment_btn-like" :like-data = "itemData"></y-like>
		</div>
		<div class="comment_detail_item-body">
			<p class="comment_detail_item-content" @click="handlePress"><span class="comment_reply_item-nickname" v-if="itemData.parentUser.userNickName">回复<i @click.stop="toUserHomePage(itemData.parentUser.userId)">{{ itemData.parentUser.userNickName}} </i>: </span>{{ itemData.contentComment }}</p>
		</div>
		<div class="comment_detail_item-line"></div>
	</div>
</template>
<script>
	import press from '@/directives/press'
	import YCard from '@/components/card'
	import Like from "@/components/like"
	import itemMixin from '@/components/detail-action/components/comment/mixins/item'
	import commentMixin from '@/components/detail-action/components/comment/mixins/comment'
	export default {
		mixins: [itemMixin, commentMixin],
		components: {
			YCard,
			[Like.name]: Like, 
		},
		directives: {
			press,
		},
		props: {
			showLike: { // 是否显示点赞按钮 默认不显示
				type: Boolean,
				default: false
			},
			itemData: {
				type: Object,
				default: () => {}
			},
			parentResourceData: Object, // 评论对应资源的data
		},
		computed: {	
		},
		methods: {
			
			toUserHomePage(userId) {
				this.$yryz.router({link: `quanhu://open/user/home?userId=${userId}`})
			},
			handlePress() {
				if (!this.$yryz.isNative()) return false;
				console.log("评论详情页长按itemData", this.itemData)
				let handleDelete = {
					text: '删除',
					handler: () => {
						this.commentItemMixinDelete(this.itemData);
					}
				};
				let handleArr = [
					{
						text: '回复',
						handler: () => {
							this.commentMixinReplyComment(this.itemData)
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
				let isAuthor = parseInt(this.$env.userId) === parseInt(this.parentResourceData.user.userId) ? true : false; // 资源发布者 
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
	@import '#/css/var.css';
	
	.comment_detail_item {
		background: #f8f8f8;
		
		& .icon-delete {
			color:var(--text-tips-color);
		}
		& .comment_detail_item-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: .2rem .3rem 0;
			& .y_card.fathercomment .y_card-title{
				color: #1d7dd6;
			}
			& .y_card-title{
				color: #666;
			}
		}
		& .comment_detail_item-body {
			margin-left: 1.18rem;
    		padding: .2rem .4rem 0 0;
		}
		& .comment_detail_item-line{
			height: 0;
			margin-left: 1.18rem;
   			padding: .2rem .4rem 0 0;
			border-bottom: 1px solid #eee;
		}
		& .comment_detail_item-content {
			font-size: .26rem;
			line-height: .46rem;
			white-space: pre-wrap;
			color: #666;
			& .comment_reply_item-nickname i{
				display: inline-block;
				color: #1d7dd6;
			}
		}
	}
	
	.fathercommentwrap {
		background: #fff;

		& .comment_detail_item-line {
			border: none;
		}
	}
	
	.comment_detail_item-delete  {
		width: 1.3rem;
		flex: 0 0 1.3rem;
		text-align: right;
		line-height: 1;
	}
</style>

