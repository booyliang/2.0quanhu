<template>
	<div :class="['hot-like','hot-item',{'cur': likeActive}]" @click="handleLike">
		<span class="iconfont icon-good_line"></span>
		<span v-text="likeData.likeCount > 0 ? likeData.likeCount : '' " class="single-hot-count"></span>
	</div>
</template>
<script>
	export default {
		name: "y-like",
		components: {},
		props: {

			likeData: {
				type: Object,
				default: () => {}
			},
		},
		data() {
			return {
				likeClicked: false, // 是否已点赞
				likeActive: this.likeData.likeFlag === 11 ? true : false, //  10未点赞 , 11点赞
			}
		},
		watch: {
			likeData() {
				this.likeActive = this.likeData.likeFlag === 11 ? true : false;
				console.log("this.likeData.likeFlag:watch", this.likeData.likeFlag)	
			}
		},
		methods: {
			async handleLike() {
				await this.$user.login();
				this.likeClicked = true;
				let postData = {
					resourceId: this.likeData.kid, // 点赞 资源ID【必填】
					moduleEnum: "1011",
					userId: this.likeData.createUserId, // 被点赞人用户ID
				}
				let res = await this.$http.post('/services/app/v2/like/dian', postData);
				if (res.data.code === "200") {
					// 点赞操作成功后 改变点赞列表
					this.likeClicked = false;
					this.likeData.likeCount += (this.likeActive ? -1 : 1);
					this.likeActive = !this.likeActive;
					let commentDetail = document.getElementsByClassName('comment-detail-fix')[0];
					if (commentDetail) { // 只有详情页的点赞才emit事件‘detail-comment-like-change’
						console.log("评论详情页点赞啦，评论列表的点赞也要变化~")
						this.$eventBus.$emit("detail-comment-like-change", Object.assign({}, res.data.data, {commentId: postData.resourceId }) )
					}
					// console.log("changedItem:", JSON.stringify(this.likeData))
				}
			},
		}

	}
</script>
<style>
	@import "#/css/var.css";
	.hot-like {
		color: var(--text-assist-color);
		& .single-hot-count {
			display: inline-block;
			min-width: 1em;
			font-size: .26rem;
		}
	}
</style>