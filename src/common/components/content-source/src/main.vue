/**
*	Author: yefan
*
*/
<template>
	<div class="content_source">
		<div v-show="isNewSource" ref="contentBox"></div>
		<div v-if="!isNewSource">
			<template v-for="item in metaData">
				<p class="content_source-text" v-if="Object.keys(item)[0] == 'text'"><slot v-if="!metaData.indexOf(item)" name="icon"></slot><span v-html="item.text"></span></p>
				<div v-else-if="Object.keys(item)[0] == 'image'" class="image-box" @click="previewImg(item.image)">
					<img max-width="100%" :src="item.image | imageResize(6)" @load="imgLoadCallback">
				</div>
				<div v-else-if="Object.keys(item)[0] == 'video' && !hasThumbnailVideo" class="video-box">
					<y-video width="100%" :src="item.video.url" :poster="item.video.thumbnailImage | imageResize(3)"></y-video>
				</div>
				<div v-else-if="Object.keys(item)[0] == 'audio'" class="audio-box">
					<y-audio :src="item.audio.url" :time="item.audio.time"></y-audio>
				</div>
			</template>
			<!-- 拓展发布时间 -->
			<slot></slot>
		</div>
	</div>
</template>
<script>
import Vue from 'vue'
import YVideo from '@/components/video'
import YAudio from '@/components/audio'
import ImageResize from '@/filters/imageResize'
export default {
	name: 'y-content-source',
	props: {
		contentSource: {
			type: String,
			default: '[]'
		},
		hasThumbnailVideo: {
			type: Boolean,
			default: false,
		}
	},
	components: {
		YVideo,
		YAudio
	},
	data() {
		return {
			metaData: [],
			imgList: [],
			isNewSource: false,
		}
	},
	watch: {
		'contentSource': 'initData'
	},
	filters: {
		convertSpacing(value) {
			let result = value.replace(/\&nbsp;/g, " ");
			return decodeURIComponent(encodeURIComponent(result));
		}
	},
	methods: {
		imgLoadCallback(e) {
			let currentImg = e.target;
			currentImg.className += ' loaded';
		},
		previewImg(imgUrl) {
			const currentIndex = this.imgList.indexOf(imgUrl);
			this.$yryz.picturePreview({
				imageUrls: this.imgList,
				currentIndex
			})
		},
		parseNewSouce() {
			
			let sourceHtml = this.metaData[0].html || '';
			let videoReg = /<video[\s\S]*?<\/video>/;
			
			let sourceVideo = sourceHtml.match(videoReg) && sourceHtml.match(videoReg)[0];
			
			let videoSrc = sourceVideo && sourceVideo.match(/src=(.*?)\s/)[1];
			let videoPoster = sourceVideo && sourceVideo.match(/poster=(.*?)\s/)[1];
			sourceHtml = `<div>${sourceHtml}</div>`;
			let newHtml = this.hasThumbnailVideo ? sourceHtml.replace(videoReg, '') : sourceHtml.replace(videoReg, `<y-video src=${videoSrc} poster=${videoPoster}></y-video>`);
			let tmp = Vue.extend({
				template: newHtml,
				components: {
					YVideo
				}
			});
			new tmp().$mount(this.$refs.contentBox)
		},
		initData() {
			this.imgList = [];
			try {
				let metaData = JSON.parse(this.contentSource);
				
				if (!Array.isArray(metaData)) {
					throw new Error(`${metaData} is not an array.`);
				}
				
				this.metaData = metaData;
				let htmlObj = this.metaData.find((item) => item.html);				
				if (htmlObj) {
					this.isNewSource = true;
					this.parseNewSouce();
				} else {
					this.metaData.forEach(item => {
						if (Object.keys(item)[0] === 'image') {
							this.imgList.push(item.image);
						}
					})
				}

			} catch (error) {
				console.error(error);
				console.error('组件content-source：请传入正确的contentSource格式')
			}
		}
	},
	mounted() {
		this.initData();
	}
}
</script>
<style>
.content_source {
	& .image-box,
	& .audio-box,
	& .video-box {
		margin: 0.15rem 0;
	}
	& .image-box {
		text-align: center;
		& img {
			vertical-align: top;
		}
	}
	& b,
	& strong {
		font-weight: bold;
	}
	& i,
	& em {
		font-style: italic;
	}
}

.content_source-text {
	margin: 0.15rem 0;
	font-size: .34rem;
	line-height: .56rem;
	min-height: .56rem;
	white-space: pre-wrap;
	word-wrap: break-word;
	word-break: break-all;
	width: 100%;
	overflow: hidden;
}
</style>


