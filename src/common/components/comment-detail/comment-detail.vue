<template>
	<transition name="fade">
	<div class="comment_detail-wrap">
		<y-nav :title="commentDetailTitle" :beforeBack="hideCommentDetail"></y-nav>
		<div class="comment_detail-main">
			<comment-detail-item  :show-like = "true" :parent-resource-data = "parentResourceData" :item-data="resourceData"></comment-detail-item>
		</div>
		<div class="comment_detail-reply_main">
			<y-load-more :state="loadMoreState" @can-load="onCanLoad" :endTip="loadMoreEnd">
				<div class="comment_detail-reply_list">
					<comment-detail-item  v-for="(item, index) in listData" :key="index" :item-data="item" :parent-resource-data = "parentResourceData"></comment-detail-item>
				</div>
				<div v-if="listEmpty" class="empty-tip">
					<span class="icon"></span>暂无回复~
				</div>
			</y-load-more>
			<comment-tool v-if="resourceData" :resource-data="resourceData" @comment-cancel="commentMixinClearData" ref="commentMixinCommentTool" :placeholder="$R('comment-input-placeholder')"></comment-tool>
		</div>
	</div>
</transition>
</template>
<script>
	import YLoadMore from '@/components/load-more'
	import CommentTool from './components/comment-tool'
	import CommentDetailItem from './components/comment-detail-item'
	import commentMixin from '@/components/detail-action/components/comment/mixins/comment'

	export default {
		mixins: [commentMixin],
		components: {
			YLoadMore,
			CommentDetailItem,
			CommentTool
		},
		props: {
			kid: {
				type: [Number, String],
			},
			resourceId: {
				type: [Number, String],
			},
			parentResourceData: Object, // 评论对应资源的data
		},
		data() {
			return {
				resourceData: null,
				count: 0,
				loadMoreState: undefined,
				listData: [],
			}
		},
		computed: {
			commentDetailTitle() {
				return this.count + "条回复"
			},
			listGetDataParams() {
				return  {
					currentPage: 1,
					pageSize: 30,
					kid: this.kid,
					resourceId: this.resourceId
				}
			},
			loadMoreEnd() {
				return this.loadMoreState === 'end';
			},
			listEmpty() {
				return this.listData.length === 0 && (this.loadMoreState && this.loadMoreState !== 'loading');
			}
		},
		methods: {
			onCanLoad() {
				this.loadMoreState = 'loading';
				this.getListData();
			},
			getListData() {
				this.$http({
					method: 'get',
					url: '/services/app/v2/comment/singleInfo',
					params: this.listGetDataParams
				}).then(res => {
					let resData = res.data;
					if (resData.code === '200') {
						this.resourceData = resData.data || {};
						let params = this.listGetDataParams;
						if (params.currentPage === 1) this.listData = [];
						this.listData.push(...resData.data.replys.entities);
						console.log("commentdetail listData", this.listData)
						
						this.count = resData.data.replys.count;
						params.currentPage += 1;
						this.loadMoreState = resData.data.replys.entities.length < params.pageSize ? 'end' : 'prepared';
					}
				})
			},
			hideCommentDetail() {
				this.$emit('hide');
				return false;
			},
			handleReplayCommentSuccess(itemData) {
				console.log("handleReplayCommentSuccess:data", itemData)
				this.listData.unshift(itemData);
				this.count += 1;
			},
			handleCommentDelete(comment) {
				console.log("detailComemt:", comment);
				let parentId = comment.parentId;
				if (parentId  !== 0) {
					// 处理回复
					this.listData = this.listData.filter(item => item.kid !== comment.kid);
					this.count -= 1;
				} else {
					// 处理评论
					this.hideCommentDetail();

				}

				
			
			}

		},
		
		mounted() {
			console.log("parentResourceData", JSON.stringify(this.parentResourceData))
			this.onCanLoad();
			this.$yryz.on('back', () => {
				this.$emit('hide');
			});
			this.$eventBus.$on('comment-item-delete', this.handleCommentDelete);
			this.$eventBus.$on('comment-item-add', this.handleReplayCommentSuccess);
			
		},
		beforeDestroy() {
			this.$eventBus.$off('comment-item-delete', this.handleCommentDelete);
			this.$eventBus.$off('comment-item-add', this.handleReplayCommentSuccess);
		},

	}
</script>
<style>
	.comment_detail-wrap {
		min-height: calc(100vh - 1.28rem);
		padding-bottom: 1.1rem;
		background: #f8f8f8;
		&.fade-enter-active,
		&.fade-leave-active {
			visibility: visible;
			transition: .35s;
		}
		&.fade-enter,
		&.fade-leave-active {
			visibility: hidden;
			opacity: 1;
			transform: translate(100%, 0);
		}
		& #navigator {
			border-bottom: 1px solid #ddd;
		}
	}
	.comment_detail-main {
		/* padding: .3rem 0 .1rem; */
	}
	.comment_detail-reply_main {
		/* border-top: .1rem solid #f8f8f8; */
		& .comment_header {
			padding: .3rem .2rem 0;
		}
		& .comment_detail_item {
			padding-top: .2rem;
			&:not(:last-child) {
				/* border-bottom: 1px solid #e3e3e3; */
			}
		}
	}
</style>

