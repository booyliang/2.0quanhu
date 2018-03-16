<template>
	<div class="coterie-dynamic_item" v-if = "mainData">
		<!-- 路人视角 显示免费的文章3篇 begin -->
		<div class="article_main" v-if="mainData.moduleEnum === '1003'">
			<div class="dynamic_source">
				<h3 class="dynamic_title">{{mainData.title}}</h3>
				<div class="dynamic_video" v-if="mainData.videoUrl">
					<y-video :src="mainData.videoUrl" :poster="mainData.videoThumbnailUrl | imageResize(6)"></y-video>
				</div>
				<div class="dynamic_content" v-if="mainData.content && !mainData.videoUrl">{{mainData.content}}</div>
				<div class="dynamic_img" v-if="imgUrl && !mainData.videoUrl">
					<y-flow-item-images :data="imgUrl"></y-flow-item-images>
				</div>
				<div class="dynamic_createDate">{{mainData.createDate | recentTime}}</div>			
			</div>
		</div>

	</div>
</template>
<script>
	import YFlowItemImages from '@/components/flow-item/flow-item-images';
	import YVideo from '@/components/video';
	export default {
		name: "y-coterie-dynamic-item",
		components: {
			YFlowItemImages,
			YVideo,
		},
		props: {
			data: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {
			
			}
		},
		computed: {
			
			imgUrl() {
				let urls = this.mainData.imgUrl;
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
			mainData() {
				if (this.data.extjson) {
					return Object.assign({}, this.data, JSON.parse(this.data.extjson))
				}
				return this.data;
			}
		}
	}
</script>
<style>
@import '#/css/var.css';
.coterie-dynamic_item {
	background: #fff;
	padding: .3rem;
	margin-bottom: .1rem;
	& .dynamic_title{
		font-size: .34rem;
		color: #000;
		line-height: .5rem;
		font-weight: 700;
		margin-bottom: .2rem;
		@apply --text-cut-multi-line;
		-webkit-line-clamp: 2;
	}
	& .dynamic_content {
		@apply --text-cut-multi-line;
		-webkit-line-clamp: 3;
		margin-bottom: .24rem;
	}
	& .dynamic_createDate{

	}
	& .dynamic_img{
		margin-bottom: .24rem;
		& .flow_item-images {
			margin-top: 0;
			& .image--responsive {
				padding-bottom: 0;

				& img {
					height: 2.24rem;
				}

				&:only-child {
					float: none;
					width: 100%;

					& img {
						height: 3.24rem;
					}
				}
			}
		}
	}
	& .dynamic_createDate{
		font-size: .22rem;
		color: #999;
	}
	
	
}
</style>