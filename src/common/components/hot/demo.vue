<template>
	<div>
		
		<y-hot heat="like" :show-text = "true" :data = "hotData" @click = "handleLike"></y-hot>
		<y-hot heat="like" :data = "hotData"></y-hot>
		<y-hot heat="comment" :data = "hotData" @click = "handleComment"></y-hot>
		<y-hot heat="comment" :show-text = "true" :data = "hotData" @click = "handleComment"></y-hot>
		<y-hot heat="repost" :data = "hotData"></y-hot>
		<y-hot heat="reward" :data = "hotData"></y-hot>
	</div>
</template>
<script>
	import Hot from "@/components/hot"
	export default {
		components: {
			[Hot.name]: Hot,
		},
		data() {
			return {
				hotData: {
					moduleEnum: "10016",
					kid: 10248,
					createUserId: "729894078090174500",
					likeFlag: 1,
					likeCount: 1,
					rewardCount: 17,
					commentCount: 0,
					transmitCount: 15,
				}
			}
		},
		methods: {
			async handleLike(emitData) {
				// console.log("点赞信息", JSON.stringify(emitData));
				this.$emit("changeLike");
		
			},
			handleComment(emitData) {
				console.log("评论信息：", JSON.stringify(emitData));
				this.$toast("调起原生评论")
			}
		}
	}
</script>