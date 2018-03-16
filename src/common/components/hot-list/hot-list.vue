<template>
	<div class="hot-list" >
		<y-hot :show-text = "showText" @comment-success = "$emit('comment-success')"  @click = "handleHot" :data = "data" :heat ="heat"  v-for="(heat, index) of heats" :key="index"></y-hot>
	</div>
</template>
<script>
	import Hot from "@/components/hot";
	import PermissionMixin from '@app/mixins/permission';
	export default {
		name: "y-hot-list",
		mixins: [PermissionMixin],
		components: {
			[Hot.name]: Hot,
		},
		props: {
			heats: {
				type: Array,
				defalut: ['comment', 'like']
			},
			showText: {
				type: Boolean,
				default: true
			},
			data: Object,
		},
		data() {
			return {
				likeClicked: false,
			}
		},
		computed: {
			
		},
		mounted() {
			
		},
		methods: {
			async handleHot(hotData) {
				// console.log("hotData", JSON.stringify(hotData))
				if (hotData.name === "repost") { // 调起原生转发之前需要校验 是否登录 是否被拉黑
					await this.$user.login();
					if (await this.isDefriend(this.data)) {
						this.handleRepost()
					}
				}
				if (hotData.name === "comment") { // 调起原生评论框之前需要校验 是否登录 是否平台禁言 私圈禁言 被拉黑
					await this.$user.login(); 
					if (await this.preverify(this.data) ) {
						this.handleComment();
					}
				}
				if (hotData.name === "like") {
					this.handleLike(hotData);
				}
			},
			async handleRepost() {
				// 调原生转发
				let extJson = this.data.extJson ? JSON.parse(this.data.extJson) : {};
				let repostState = this.data.moduleEnum === "1010"; // 动态
				let repostParams = {
					moduleEnum: repostState ? extJson.moduleEnum : this.data.moduleEnum,
					parentId: this.data.kid,
					resourceId: repostState ? (extJson.coterieId || extJson.kid) : this.data.kid,
					targetUserId: this.data.user.userId,
					resource: repostState ? extJson : this.data,
				}

				// console.log("转发Params:", JSON.stringify(repostParams))
				this.$yryz.forward(repostParams).then(data => {
					// console.log("转发返回参数", JSON.stringify(data)) 
					this.$emit("forward-success", data);
				});
			},
			async handleComment() {
				await this.$emit("open-comment");
			},
			
			async handleLike(hotData) { 
				await this.$user.login(); 
				this.likeClicked = true;
				let postData = {
					coterieId: this.data.coterieId ? this.data.coterieId : 0, // 私圈ID（有就传无则0）
					resourceId: this.data.kid, // 点赞 资源ID
					moduleEnum: this.data.moduleEnum,
					resourceUserId: this.data.user.userId, // 发布资源的用户ID
					userId: this.$env.userId, // 用户ID
				}
				let res = await this.$http.post('/services/app/v2/like/dian', postData);
				if (res.data.code === "200" && res.data.data.result === 1) {
					// 点赞操作成功后 改变点赞列表
					this.$emit("change-like", Object.assign({}, res.data.data) )
					this.likeClicked = false;
					hotData.count += (hotData.active ? -1 : 1);
					// console.log("changedItem", JSON.stringify(hotData))
					hotData.active = !hotData.active;
				}
			}
		}
	}
</script>
<style>
	@import "#/css/var.css";
	.hot-list {
		display: flex; 
		width: 100%;
		border-top: 1px solid #ddd;
		padding: .1rem 0;
		& .hot-item {
			position: relative;
			flex: 1;
			/* height: .4rem; */
			line-height: 1;
			margin: 10px 0;
			text-align: center;
			border-right:1px solid #ddd;
			-webkit-tap-highlight-color: color(#000 alpha(0));
			& span{
				display: inline-block;
				font-size: .26rem;
				color: var(--text-assist-color);
			}
			& .iconfont {
				margin-right: .1rem;
			}
			& .hot-value {
				
			}
		}
		& .hot-item:last-child{
			border:none;
		}
		
	}
</style>