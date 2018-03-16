<template>
	<div class="invitation-item" @click="skipToDetail">
		<y-card :user-id="data.user.userId" :badge="data.user.userRole === 11" :title="data.user.userNickName" :src="data.user.userImg" :assist="data.createDate | recentTime"></y-card>
		<div class="content" :style="lineNum" v-text="data.content"></div>
		<y-video v-if="data.videoUrl" :src="data.videoUrl" :poster="data.videoThumbnailUrl | imageResize(3)" class="video"></y-video>
		<ul class="flow_item-images" v-else-if="images">
			<li v-for="(item, index) of images" :key="index" class="image-wrap">
				<img :src="item | imageResize(images.length > 1 ? 2 : 3)" alt="">
			</li>
		</ul>
		<div class="foot">
			<div class="like">
				<span v-text="data.behaviorVo.likeCount || 0"></span>
				<span>赞同</span>
			</div>
			<div class="comment">
				<span v-text="data.behaviorVo.commentCount || 0"></span>
				<span>评论</span>
			</div>
		</div>
	</div>	
</template>

<script>
	import Card from '@/components/card';
	import Video from '@/components/video';
	import ImageResize from '@/filters/imageResize'
	export default {
		name: 'invitation-item',

		components: {
			[Card.name]: Card,
			[Video.name]: Video
		},
		data() {
			return {
				inApp: this.$yryz.isNative()
			}
		},
		props: {
			data: {
				type: Object,
				required: true
			}
		},

		computed: {
			lineNum() {
				if (this.data.imgUrl) {
					return { '-webkit-line-clamp': 2 }
				} else {
					return { '-webkit-line-clamp': 4 }
				}
			},

			images() {
				let urls = this.data.imgUrl;
				if (urls) {
					let imgArr = urls.split(',')
					if (imgArr.length < 3) {
						return imgArr.slice(0, 1)
					} else {
						return imgArr.slice(0, 3)
					}
				} else {
					return null
				}
			},
		},

		methods: {
			skipToDetail() {
				if (!this.inApp) return
				this.$router.push({path: `/topic/detail/${this.data.kid}`})
			}
		}
	}
</script>

<style>
	@import '#/css/var.css';
	.invitation-item {
		margin-bottom: .1rem;
		padding: 0.3rem;
		background: #fff;
		&:last-of-type {
			margin-bottom: 0;
		}

		& .content {
			margin: .2rem 0;
			@apply --text-cut-multi-line;
		}

		& .video {
			margin-bottom: .24rem;
		}

		& .flow_item-images {
			margin: 0 0 .24rem 0;
			@apply --clearfix;

			&>.image-wrap {
				float: left;
				width: 32.2%;

				&:nth-child(n+2) {
					margin-left: 1.7%;
				}
				& img {
					width: 100%;
					height: 2.22rem;
				}
				&:only-child {
					float: none;
					width: 100%;
					& img {
						width: 100%;
						height: 3.1rem;
					}
				}
			}
		}

		& .foot {
			display: flex;
			&>div {
				display: flex;
				padding: 0 .16rem;
				border: 1px solid #999;
				border-radius: .1rem;
				font-size: .2rem;
				color: var(--text-tips-color);
				&.like {
					margin-right: .12rem;
				}
				&>span:first-child {
					margin-right: .1rem;
				}
			}
		}

		& .y_avatar {
			width: .8rem;
			height: .8rem;
			flex: 0 0 .8rem;
		}
	}
</style>