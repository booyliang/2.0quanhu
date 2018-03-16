<template>
		<div class="hot-reward-item" @click = "handleReward">
			<span class="iconfont icon-reward_solid"></span>
			<span v-if="rewardData.rewardCount > 0" v-text="rewardData.rewardCount"></span>
		</div>
</template>
<script>
	export default {
		name: "y-reward",
		components: {
		},
		props: {
			
			data: {
				type: Object,
				default: () => {}
			},
		},
		watch: {
			data() {
				this.rewardData = this.data;
			}
		},
		data() {
			return {
				rewardData: this.data,
			}
		},
		methods: {
			async handleReward() {
				await this.$user.login();
				let rewardParams = {
					authorId: this.data.user.userId, // 被打赏人
					resourceId: this.data.kid, // 资源id
					coterieId: this.data.coterieId ? this.data.coterieId : "", // 私圈id 
					moduleEnum: this.data.moduleEnum,

				}
				// console.log("打赏Params:", JSON.stringify(rewardParams))
				this.$yryz.reward(rewardParams).then(data => {
					this.rewardData.rewardCount += 1;
					// console.log("打赏返回data", JSON.stringify(data))
					this.$emit("reward-success", data);
					
				});
			},
		}

	}
</script>
<style>
	@import "#/css/var.css";
	.hot-reward-item{
		text-align: center;
		margin-bottom: .2rem;
  		background: #fff;
		& span{
			display: block;
			color: var(--text-tips-color);
			position: relative;
			margin-top: -.2rem;
		}
		& span.iconfont{
			color: #f5cd45;
			font-size: .9rem;
		}
		& .hot-reward-count{
			font-size: .24rem;
			line-height: .36rem;
			color: var(--text-tips-color);
		}
	}
</style>
