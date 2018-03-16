export default {
	data() {
		return {
			// 评论详情页默认的评论
			commentMixinDefaultReplyItem: {},
			// 当前选中的回复评论
			commentMixinCurrentReplyItem: null,
			// 当前选中回复评论的index
			commentMixinCurrentReplyIndex: undefined,
			commentMixinDraftContent: ''
		}
	},
	props: {
		placeholderNative: {  // 前端传给原生评论框的placeholder
			type: String,
		},
	},
	computed: {
		isNative() {
			return this.$yryz.isNative();
		},
		isReply() {
			return this.commentMixinCurrentReplyItem ? true : false;
		},
		replyData() {
			console.log("commentMixinCurrentReplyItem", this.commentMixinCurrentReplyItem)
			if (this.commentMixinCurrentReplyItem) { // 处理回复
				const { kid, moduleEnum, coterieId, user, resourceId, topId } = this.commentMixinCurrentReplyItem;
				return {
					coterieId,
					moduleEnum: "1011",
					resourceId,
					targetUserId: user ? user.userId : "",
					parentId: kid,
					topId: topId === 0 ? kid : topId,
				}
			} else { // 处理评论
				console.log("this.resourceData", this.resourceData)
				const { kid, moduleEnum, coterieId, user, resourceId, transmitType, createUserId  } = this.resourceData;
				return {
					coterieId,
					moduleEnum: moduleEnum,
					resourceId: kid,
					targetUserId: createUserId ? createUserId : (user ? user.userId : ""),
					
				}
			}
			
			
		},
		defaultCommentConfig() { // 前端传给原生评论框的默认文案
			if (this.isReply) {
				const { user, contentComment } = this.commentMixinCurrentReplyItem;
				return {
					title: `回复${user.userNickName}: ${contentComment}`,
					placeholder: `回复:${user.userNickName}`,
					sendText: "发送",
					content: this.commentMixinDraftContent,
					txtMaxNum: 1000
				}
			}
			return {
				placeholder: this.placeholderNative || "说些什么...",
				content: this.commentMixinDraftContent,
				txtMaxNum: 1000,
				sendText: "发送",
			};
		},
	},
	methods: {
		openNativeComment() {

			let postData = this.replyData
			
			this.$yryz.comment({
				...this.defaultCommentConfig
			}).then(data => {
				postData.contentComment = data.content;
				console.log("postData:data", postData)
				this.$http.post('/services/app/v2/comment/accretion', postData).then(res => {
					this.$indicator.close();
					let resData = res.data;
					if (resData.code === '200') {
						// 追加评论
						console.log("评论成功返回data：", resData.data)
						this.$eventBus.$emit('comment-item-add', resData.data)
					} else if (resData.code === '2060') { // 评论时，被评论的对象被删除 需要刷新页面
						this.$utils.refresh();
					}
				}).catch(error => {
					this.$indicator.close();
				})
			});
		},
		commentMixinReplyComment(data, index) {
			// if (!this.isNative) return;
			this.commentMixinCurrentReplyItem = data;
			this.commentMixinCurrentReplyIndex = index;
			// console.log("commentMixinReplyComment:data", JSON.stringify(data), index)
			this.$nextTick(() => {
				this.openNativeComment(data);
			})
		},
		commentMixinClearData(data = {}) {
			this.commentMixinDraftContent = data.draftContent;
			this.commentMixinCurrentReplyIndex = undefined;
			this.commentMixinCurrentReplyItem = this.commentMixinDefaultReplyItem;
		}
	}
}