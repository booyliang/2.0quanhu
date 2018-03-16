<template>
	<div class="detail-action-list">
		<y-load-more-remote :request="finalRequest" @loaded="handleLoaded"　@empty="empty" :endTip="endTip">
			<div　class="action-list">
				<component :is="listComponent" :resource-data = "resourceData" v-for="(item, index) of list" :index="index" :key="index" :data = "item"></component>
			</div>
		</y-load-more-remote>
		<y-message v-if="list.length === 0 && isLoaded" :icon="noDataIcon" :title="msgTitle"></y-message>
	</div>
</template>
<script>
	let defaultOption = {
		like: {
			id: 'like',
			text: "赞",
			count: 0,
			noDataText: "快来点个赞吧",
			flowItem: LikeItem,
			request: {
				url: '/services/app/v2/like/frontlist',
				params: {
					currentPage: 1,
					pageSize: 10
				}
			},
			
		},
		comment: {
			id: 'comment',
			text: "评论",
			count: 0,
			noDataText: "暂无评论，点击抢沙发",
			flowItem: CommentItem,
			request: {
				url: '/services/app/v2/comment/list',
				params: {
					currentPage: 1,
					pageSize: 10
				}
			},
		},
		repost: {
			id: 'repost',
			text: "转发",
			count: 0,
			noDataText: "快来转发吧",
			flowItem: RepostItem,
			request: {
				url: '/services/app/v2/transmit/single',
				params: {
					currentPage: 1,
					pageSize: 20
				}
			},
		},
		reward: {
			id: 'reward',
			text: "打赏",
			count: 0,
			noDataText: "还没有打赏",
			flowItem: RewardItem,
			request: {
				url: '/services/app/v2/resource/reward/user/list',
				params: {
					currentPage: 1,
					pageSize: 10
				}
			},
		},
		
	}
	import noDataIcon from '@/assets/no_data@2x.png';
	import CommentItem from "./comment/comment-item"
	import RewardItem from "./reward-item"
	import LikeItem from "./like-item"
	import RepostItem from "./repost-item"
	import YLoadMoreRemote from '@/components/load-more-remote'
	import YMessage from '@/components/message';
	export default {
		name: "y-detail-action-list",
		components: {
			[YLoadMoreRemote.name]: YLoadMoreRemote,
			[YMessage.name]: YMessage
		},
		data() {
			return {
				noDataIcon,
				endTip: true,
				isLoaded: false,
				list: [], // 列表
			}
		},
		props: {
			itemName: String,
			resourceData: Object,
		},
		computed: {
			listComponent() {
				return defaultOption[this.itemName].flowItem
			},
			msgTitle() {
				return defaultOption[this.itemName].noDataText
			},
			finalRequest() {
				let res = defaultOption[this.itemName].request;
				let params = {
					moduleEnum: this.resourceData.moduleEnum,
					resourceId: this.resourceData.kid,
				}
				if (this.itemName === "comment") {
					params = {
						resourceId: this.resourceData.kid,
					}
				}
				if (this.itemName === "repost") {
					params =  {
						moduleEnum: this.resourceData.moduleEnum,
						parentId: this.resourceData.kid,
					}
				}
				let newParams = Object.assign(res.params, params)
				res = Object.assign(res, {params: newParams})
				// console.log("finalRequest:", JSON.stringify(res))
				return res;
			},
		},
		created() {
				
		},
		mounted() {
			this.$eventBus.$on('comment-item-delete', this.handleCommentDelete);
			this.$eventBus.$on('comment-item-add', this.handleCommentAppend);
			this.$eventBus.$on('detail-comment-like-change', this.handleCommentListLike);
		},
		beforeDestroy() {
			this.$eventBus.$off('comment-item-delete', this.handleCommentDelete);
			this.$eventBus.$off('comment-item-add', this.handleCommentAppend);
			this.$eventBus.$off('detail-comment-like-change', this.handleCommentListLike);
			
		},
		methods: {
			handleCommentListLike(data) {
				if (this.itemName !== 'comment')
					return;
				console.log("handleCommentListLike", data)
				let targetComment = this.list.find(item => item.kid ===  data.commentId);
				console.log("targetComment-before:", targetComment)
				if ( data.result && data.result === 1 ) {
					// targetComment.likeFlag = 10;
					// targetComment.likeCount--;
					console.log("targetComment-after:", targetComment)
					console.log("评论详情页取消点赞", data, data.commentId)
					
				} else {
					console.log("评论详情页点赞", data)
					// targetComment.likeFlag = 11;
					// targetComment.likeCount++;
				}
			},
			empty() {
				this.isLoaded = true;
				this.endTip = false;
			},
			handleLoaded(list, item) {
				this.list.push(...list);
			},
			handleListDataAppend(data) { // 追加数据
				this.list.unshift(data);
				this.isLoaded = false; // 手动插入数据成功后显示“没有更多了”
				this.endTip = true;
			},
	
			handleListRemoveLike(data) { // 取消点赞 删除数据
				console.log("取消点赞:", this.list, this.$env.userId )
				this.list = this.list.filter((item) => parseInt(item.user.userId) !== parseInt(this.$env.userId) )
				console.log(this.list)
				if (this.list.length === 0) {
					this.isLoaded = true; 
					this.endTip = false;
				}
			
			},
			handleCommentDelete(comment) {
				console.log("列表页comment:", comment)
				if (this.itemName !== 'comment')
					return;
				let parentId = comment.parentId;
				if (parentId  !== 0) {
					// 处理回复
					let parentComment = this.list.find(item => item.kid === comment.parentId);
					console.log(parentComment, parentId);
					if (parentComment && parentComment.commentCount) {
						console.log("parentComment.commentCount", parentComment.commentCount)
						parentComment.commentCount--;
						parentComment.replyVos = parentComment.replyVos.filter(item => item.kid !== comment.kid);
						
					}
					// parentComment.commentCount--;
					// parentComment.replyVos = parentComment.replyVos.filter(item => item.kid !== comment.kid);
					this.$eventBus.$emit('hanlde-comment-count-delete', 0);
				} else {
					// 处理评论
					let totalDelete = 0;
					if (comment.replys) { // 如果是删除评论详情页的主评论 
						totalDelete = comment.replys.count
						console.log("详情页删除时列表页数量减：", totalDelete + 1)
					} else if (comment.commentCount) {
						totalDelete = comment.commentCount;
						console.log("列表页数量减：", totalDelete + 1)
					}
					this.$eventBus.$emit('hanlde-comment-count-delete', totalDelete); // 删除评论时候 评论减少数是一级评论及其回复总数
					this.list = this.list.filter(item => item.kid !== comment.kid);
					
				}
				
			},
			handleCommentAppend(comment) {
				
				if (this.itemName !== 'comment')
					return;
				
				// comment.createDate = comment.createDateNew ? comment.createDateNew : ""
				console.log("评论成功后追加评论数据到列表:add", comment )
				let topId = comment.topId;
				console.log("topId为0是直接评论 否则是回复评论", topId);
				if (topId  !== 0) {
					// 处理回复
					let parentComment = this.list.find(item => item.kid === comment.topId);
					console.log(parentComment, topId);
					parentComment.commentCount++;
					if (!parentComment.replyVos) {
						this.$set(parentComment, 'replyVos', [])
					}
					
					parentComment.replyVos.unshift(comment);
					console.log("parentComment.replyVos:", parentComment.replyVos)
					this.$eventBus.$emit('hanlde-comment-count-add');
				} else {
					// 处理评论
					this.list.unshift(comment);
					this.$eventBus.$emit('hanlde-comment-count-add');
					
				}
				this.isLoaded = false; // 手动插入数据成功后显示“没有更多了”
				this.endTip = true;
			},
			
			
		}
	}
</script>
<style>

</style>