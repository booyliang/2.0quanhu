<template>
	<div class="hot-item" :class="{'cur': this.heat ==='like' && this.hotData.active }" @click = "handleClick" v-if="hotData">
		<span v-if="hotData.icon" class="iconfont" :class="`icon-${hotData.icon}`"></span>		
		<span v-if="showText" v-text="hotData.text" :class="['hot-count',`hot-${hotData.name}-count`]"></span>
		<span v-else v-text="hotData.count=== 0 ? '' : hotData.count" :class="['single-hot-count']"></span>
	</div>
</template>
<script>
	let defaultHots = {
		repost: {
			text: '转发', // Repost/ transmit
			icon: 'share_line',
			count: 0,
			field: 'transmitCount'
		},
		comment: {
			text: '评论', // Comments
			icon: 'comment_line',
			count: 0,
			field: 'commentCount'
		},
		like: {
			text: '赞', // Likes
			icon: 'good_line',
			count: 0,
			field: 'likeCount'
		}
	}
	export default {
		name: "y-hot",
		props: {
			showText: {
				type: Boolean,
				default: false
			},
			heat: String,
			data: {
				type: Object,
				default: () => {}
				
			},
		},
		data() {
			return {
				hotData: null,
			}
		},
		watch: {
			data() {
				this.hotData.active = this.data.likeFlag === 11 ? true : false;
				// console.log("this.data.likeFlag:watch", this.data.likeFlag)	
			}
		},
		computed: {
			classList() {
				return [
					'hot-item',
					{'cur': this.hotData.active}
				]
			},
			getHotData() {
				let hot = defaultHots[this.heat];
				let field = hot.field;
				Object.assign(hot, {name: this.heat, count: this.data[field]});
				// 判断点赞状态
				if (hot.name === 'like') {
					hot.active = this.data.likeFlag === 11 ? true : false;  // 点赞状态统一为likeFlag 10未点赞 11点赞
				}
				// console.log("finalhot", JSON.stringify(hot))
				return hot
			},
			
		},
		mounted() {
			this.hotData = this.getHotData;
		},
		methods: {
			handleClick() {
				this.$emit("click", this.hotData)
			},
			
			
	
		}
	}
</script>
<style>
	@import "#/css/var.css";
	.hot-item {
		
	}
	.hot-item.cur {
		& .iconfont {
			color: #ff5959;
		}
		& .iconfont.icon-good_line:before {
			content: "\E638";
		}
		& .single-hot-count{
			color: #ff5959;
		}
	}
</style>