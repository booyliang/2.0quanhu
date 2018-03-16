/** * Author: yefan * */
<template>
	<div class="view-swiper-wrap" v-if="show" @click="show = false;">
		<y-slider class="swiper-box" :options="swiperOptions" v-if="list.length > 1">
			<div class="slide-item-main" :class="zoomStyle" v-for="(item,index) in list" :key="index">
				<img :src="item" v-if="typeof item === 'string'" v-press="saveImg">
				<y-video width="100%" v-else :src="item.url" :poster="item.thumbnailImage"></y-video>
			</div>
		</y-slider>
		<div class="swiper-box" v-else>
			<img v-if="typeof list[0] === 'string'" :src="list[0]" v-press="saveImg">
			<y-video v-else width="100%" v-else :src="list[0].url" :poster="list[0].thumbnailImage"></y-video>
		</div>
		<div class="view-mask"></div>
	</div>
</template>
<script>
	import YSlider from '@/components/slider'
	import YVideo from '@/components/video'
	import press from '@/directives/press'
	export default {
		components: {
			YSlider,
			YVideo
		},
		data() {
			return {
				show: false,
				list: [],
				swiperOptions: {
					initialSlide: 1,
					autoHeight: true
				}
			}
		},
		methods: {
			saveImg(evt) {
				evt.stopPropagation();
				this.show = true;
				this.$actionsheet([{
					text: '保存',
					handler: async () => {
						let imgSrc = evt.target.src;
						try {
							await this.$yryz.saveImage({data: imgSrc});
							this.$toast('保存成功！')
						} catch (error) {
							error.data && this.$toast(error.data)
						}
					}
				}], {
					blankClose: false,
					transparentMask: true
				});
			}
		},
		directives: {
			press,
		},
		computed: {
			zoomStyle() {
				return this.swiperOptions.zoom ? 'swiper-zoom-container' : '';
			}
		}
	}
</script>

<style>
	.view-swiper-wrap {
		& .swiper-box {
			position: fixed;
			z-index: 1001;
			width: 100vw;
			top: 50%;
			transform: translateY(-50%);
			& > img {
				width: 100%;
				-webkit-touch-callout: none;
				-webkit-user-select: none;
			}
		}
		& .view-mask {
			position: fixed;
			top: 0;
			right: 0;
			width: 100vw;
			height: 100vh;
			background: #000;
			z-index: 999;
		}
		& .slide-item-main {
			display: flex;
			align-items: center;
			justify-content: center;
			overflow: hidden;
			position: relative;
			margin: auto;
			& .video {
				width: 100%;
			}
		}
	}

	.view-swiper-wrap+.actionsheet {
		z-index: 1003;
	}
	.view-swiper-wrap+.toast {
		z-index: 1004;
	}
</style>