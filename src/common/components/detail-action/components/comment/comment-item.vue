<template>
	<div class="comment_item">
		<y-card :src="data.user.userImg" :user-id="data.user.userId" :title="data.user.userNickName || `${this.$R('user')}`" :assist="data.createTime | recentTime" :badge="data.user.userRole === 11">
		</y-card>
		<y-like class="comment_btn-like" :like-data = "data"></y-like>
		<div class="comment_item-main">
			<p class="comment_item-content"  @click ="handleCommentPress">{{ data.contentComment }}</p>
		</div>
		<div class="comment_item-replay_list" v-if="showReplyList">
			<reply-item  v-press="handleReplyItemPress(item)" :resource-data = "resourceData" :item-data="item" :index="index" :key="index" v-for="(item, index) in replyListData"></reply-item>
			<div @click.stop="showCommentDetail" class="comment_item-view_all_reply" v-if="data.commentCount > 3">共{{data.commentCount}}条回复<span class="iconfont icon-rightarrow_line"></span></div>
		</div>
		<div class="comment_item-line"></div>
	</div>
</template>
<script>
	import press from '@/directives/press'
	import YCard from '@/components/card'
	import Like from "@/components/like"
	import ReplyItem from './reply-item'
	import itemMixin from './mixins/item'
	import commentMixin from './mixins/comment'
	export default {
		mixins: [itemMixin, commentMixin],
		directives: {
			press,
		},
		components: {
			YCard,
			ReplyItem,
			[Like.name]: Like, 
		},
		props: {
			data: {
				type: Object,
				default: () => {}
			},
			index: Number,
			resourceData: Object,
		},
		data() {
			return {
				inApp: !!this.$yryz.isNative(),
			}
		},
		computed: {
			replyListData() {
				let list = [ ...this.data.replyVos];
				return list.splice(0, 3);
			},
			showReplyList() {
				const { replyVos } = this.data;
				return replyVos  && replyVos.length > 0;
			}
		},
		mounted() { 
		},
		beforeDestroy() {

		},
		methods: {
	
			handleCommentPress() {
				// console.log(parseInt(this.$env.userId), parseInt(this.resourceData.user.userId), parseInt(this.data.createUserId) )
				if (!this.inApp) return false;
				let handleDelete = {
					text: '删除',
					handler: async () => {
						this.commentItemMixinDelete(this.data);
					}
				};
				let handleArr = [
					{
						text: '回复',
						handler: () => {
							this.commentMixinReplyComment(this.data, this.index)
						}
					},
					{
						text: '举报',
						handler: () => {
							this.$yryz.report({
								moduleEnum: "1011",
								resourceId: this.data.kid
							})
						}
					},
				]
				let isAuthor = parseInt(this.$env.userId) === parseInt(this.resourceData.user.userId) ? true : false; // 资源发布者 
				let isCommentUser = parseInt(this.$env.userId) === parseInt(this.data.user.userId) ? true : false; // 评论发布者
				
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
			},
			handleReplyItemPress(itemData) {
				// if (!this.inApp) return false;
				// return () => {
				// 	this.openReplyItemActionSheet(itemData);
				// }
			},
			openReplyItemActionSheet(itemData) {
				let handleDelete = {
					text: '删除',
					handler: () => {
						console.log('openReplyItemActionSheet')
						this.commentItemMixinDelete(itemData);
					}
				};
				let handleArr = [
					{
						text: '回复',
						handler: () => {
							this.commentMixinReplyComment(itemData, this.index)
						}
					},
					{
						text: '举报',
						handler: () => {
							this.$yryz.report({
								moduleEnum: "1011",
								resourceId: itemData.kid
							})
							
						}
					},
				]
				let isAuthor = parseInt(this.$env.userId) === parseInt(this.resourceData.user.userId) ? true : false; // 资源发布者 
				let isCommentUser = parseInt(this.$env.userId) === parseInt(itemData.user.userId) ? true : false; // 评论发布者
				if (isAuthor) { // 是资源发布者
					handleArr.splice(1, 0, handleDelete); // 回复/删除/举报
					console.log("回复/删除/举报", JSON.stringify(handleArr))
					if (isCommentUser) {
						handleArr.splice(2, 1);  // 回复/删除
					}
				} else {
					if (isCommentUser) {
						handleArr.splice(1, 1, handleDelete);
						console.log("回复/删除")
					}
				}
				this.$actionsheet(handleArr);
			},
			showCommentDetail() {
				this.$eventBus.$emit('show-comment-detail', this.data);
			},
			
			hanldeCommentReplayItemDelete(index) {
				console.log("hanldeCommentReplayItemDelete:data", this.data, index)
				this.list.splice(index, 1);
				this.data.commentCount -= 1;
			},
		}
	}
</script>
<style>
	@import '#/css/var.css';
	.comment_item{
		position: relative;
		& .y_card{
			padding: .2rem .3rem 0;
			& .y_card-title{
				color:#666;
			}
		}
		& .comment_btn-like{
			position: absolute;
			top: .1rem;
			right: .3rem;
		}
		& .comment_item-main {
			display: flex;
			margin-left: 1.18rem;
			padding: .2rem .2rem .2rem 0;
		}
		& .comment_item-content {
			display: block;
			width: 100%;
			/* font-size: .26rem; */
			line-height: .36rem;
			white-space: pre-wrap;
			padding-right: .1rem;
		}
		& .comment_item-replay_list {
			margin: 0 .2rem .2rem 1.18rem;
			padding: .2rem;
			background: #f7f7f7;
			color: #666;
			font-size: .26rem;
		}
		& .comment_item-view_all_reply {
			display: inline-block;
			font-size: .26rem;
			line-height: 1;
			color: #1d7dd6;
			margin-top: .2rem;
			& span{
				margin-left: .05rem;
				font-size: .18rem;
			}
		}
		& .comment_item-line{
			position: relative;
			height: 0;
			margin: 0 0 0 1.18rem;
			border-bottom: 1px solid #eee;
			& :after{

			}
		}
	}

</style>
	
	