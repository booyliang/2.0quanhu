/**
*	Author: yefan
*
*/
<template>
	<div class="content_editor">
		<div class="content_editor-view">
			<y-input v-if="textMaxLength>0" type="textarea" :maxlength="textMaxLength" v-model="content" :placeholder="placeholder"></y-input>
			<transition-group name="list" tag="div" class="content_editor-img_list" v-if="imgs.length || video.url">
				<div class="content_editor-img_item" v-for="(item, index) in imgs" :key="index">
					<img :src="item | imageResize(2)" @click="showPreview(index)">
					<div class="remove" @click="removeImg(index)">删除</div>
				</div>
				<div v-if="videoEnable && video.url" class="content_editor-img_item" :key="video.url">
					<img :src="video.thumbnailImage | imageResize(3)" @click="showPreview(imgs.length)">
					<div class="iconfont  icon-play_solid"></div>
					<div class="remove" @click="removeVideo">删除</div>
				</div>
			</transition-group>
			<div class="content_editor-audio" v-if="audio.url">
				<y-audio :src="audio.url" ref="audioInst" :time="audio.audioTime"></y-audio>
				<div class="remove-icon" @click="removeAudio">
					<i class="iconfont icon-fork"></i>
				</div>
			</div>
		</div>
		<div class="content_editor-tool">
			<button class="tool-item-image" :disabled="imgDisable || imgs.length >= imgMaxLength" @click="uploadImage" v-if="imageEnable">
				<i class="iconfont icon-picture"></i>
				<!-- <em>图片</em> -->
			</button>
			<button class="tool-item-video" :disabled="videoDisable" @click="uploadVideo" v-if="videoEnable">
				<i class="iconfont icon-video-a"></i>
				<!-- <em>视频</em> -->
			</button>
			<button class="tool-item-audio" :disabled="audioDisable" @click="uploadAudio" v-if="audioEnable">
				<i class="iconfont icon-voice"></i>
				<!-- <em>音频</em> -->
			</button>
			<span class="tool-item-text-tips" v-if="showHelpText" v-text="EditorToolText"></span>
		</div>
	</div>
</template>
<script>
import YInput from '@/components/input'
import YAudio from '@/components/audio'
import album from '@/components/album'
import ImageResize from '@/filters/imageResize'
export default {
	name: 'y-content-editor',
	components: {
		YInput,
		YAudio
	},
	props: {
		value: String,
		placeholder: String,
		textMaxLength: {
			type: Number,
			default: 1000
		},
		imgMaxLength: Number,
		imageEnable: {
			type: Boolean,
			default: true,
		},
		videoEnable: {
			type: Boolean,
			default: false,
		},
		audioEnable: {
			type: Boolean,
			default: false,
		},
		imgDisable: {
			type: Boolean,
			default: false,
		},
		audioDisable: {
			type: Boolean,
			default: false,
		},
		videoDisable: {
			type: Boolean,
			default: false,
		},
		showHelpText: {
			type: Boolean,
			default: false,
		}
	},
	data() {
		return {
			content: '',
			imgs: [],
			video: {
				thumbnailImage: '',
				url: ''
			},
			audio: {
				url: '',
				audioTime: '',
			},
			contentSource: ''
		}
	},
	watch: {
		'value': function (newVal, oldVal) {
			if (newVal === this.contentSource) return false;
			this.contentSource = this.value;
			this.translateContent();
		},
		'content': function (newVal, oldVal) {
			this.syncData();
		}
	},
	computed: {
		EditorToolText() {
			if (!this.showHelpText)
				return '';
			if (this.imgs.length > 0 || this.video.url || this.audio.url) {
				return '';
			}
			let editText = ''			
			if (this.imageEnable) {
				editText = '图片';
			} else {
				editText =  '视频';
			}
			return `你还可以在宣言中插入${editText}哦！`
		}
	},
	methods: {
		// 将contentSource字符串转换为可用的数据格式
		translateContent() {
			if (!this.value)
				return;
			let content = JSON.parse(this.value);
			content.forEach(item => {
				let type = Object.keys(item)[0];
				if (type === 'text') {
					let text = this.content ? ('\r' + item.text) : item.text;
					this.content += text;
				}
				if (type === 'image') {
					this.imgs.push(item.image)
				}
				if (type === 'video') {
					this.video = item.video;
				}
				if (type === 'audio') {
					this.audio = item.audio;
				}
			})
		},
		uploadImage() {	
			try {
				this.$refs.audioInst &&	this.$refs.audioInst.stopAudio();	
			} catch	(error) {
				console.log(error)
			}
			let picNum = Math.min((this.imgMaxLength - this.imgs.length), 9);
			this.$yryz.uploadPics({ picNum: picNum }).then(data => {
				data.picUrls.forEach(item => {
					this.imgs.push(item);
				});
				this.syncData();
			});
		},
		uploadVideo() {	
			try {
				this.$refs.audioInst &&	this.$refs.audioInst.stopAudio();	
			} catch	(error) {
				console.log(error)
			}		
			this.$yryz.uploadVideo().then(data => {
				this.video = data;
				this.syncData();
			})
		},
		uploadAudio() {			
			try {
				this.$refs.audioInst &&	this.$refs.audioInst.stopAudio();	
			} catch	(error) {
				console.log(error)
			}			
			this.$yryz.uploadAudio().then(data => {
				this.audio = data;
				this.audio.time = data.audioTime;
				this.syncData();
			})
		},
		removeImg(index) {
			this.imgs.splice(index, 1);
			this.syncData();
		},
		removeVideo() {
			this.video = {};
			this.syncData();
		},
		removeAudio() {
			this.audio = {};
			this.syncData();
		},
		// 同步数据
		syncData() {
			let result = [];
			let text = this.content.replace(/\n/gi, "|").replace(/\r/gi, "|");
			let textArray = text.split('|');
			textArray.forEach(item => {
				result.push({ text: item });
			});
			this.imgs.forEach(item => {
				result.push({ image: item });
			});
			if (this.audio.url) {
				result.push({ audio: this.audio });
			}
			if (this.video.url) {
				result.push({ video: this.video });
			}
			this.contentSource = JSON.stringify(result);
			this.$emit('input', this.contentSource);
		},
		getSummaryData() {
			return {
				content: this.content,
				imgUrl: this.imgs.join(','),
				videoUrl: this.video.url,
				videoThumbnailUrl: this.video.thumbnailImage,
				audioUrl: this.audio.url,
				audioTime: this.audio.audioTime
			}
		},
		showPreview(index) {
			let listData = JSON.parse(JSON.stringify(this.imgs));
			if (this.video.url) {
				listData.push(this.video);
			}
			album.init(listData);
			album.show(index);
		}
	},
	mounted() {
		this.contentSource = this.value;
		this.translateContent();
	},
	beforeDestroy() {
		album.hide();
	}
}
</script>
<style>
@import '#/css/var.css';
:root {
	--tool-item {
		/* display: flex;
		justify-content: center;
		align-items: center; */
		width: .7rem;
		height: .7rem;
		line-height: .7rem;
		background-color: #339dff;
		background-repeat: no-repeat;
		background-position: center center;
		border-radius: 0.1rem;
		color: #fff;
		text-align: center;
		&:not(:first-child) {
			margin-left: 0.2rem;
		}
		&[disabled] {
			background: var(--disabled-color);
			pointer-events: none;
		}
	}
}

.content_editor {
	background: #fff;
	& .list-enter,
	& .list-leave-active {
		opacity: 0;
		transform: translateY(1.6rem);
	}
	& .list-leave-active {
		position: absolute;
	}
}
.content_editor-view {
	position: relative;
	margin: 0 0 0.15rem;
	padding: 0 0 0.6rem;
	& .input__length_info {
		position: absolute;
		width: 100%;
		bottom: 0;
	}
	& .input-wrap {
		margin-bottom: 0.16rem;
	}
}
.content_editor-img_list {
	padding: 0 .14rem;
	/* margin: 0 -0.12rem; */
	/*display: flex;
		flex-wrap: wrap;*/
}
.content_editor-img_item {
	display: inline-block;
	transition: all 1s;
	position: relative;
	width: 2.24rem;
	height: 2.24rem;
	margin: .16rem 0.08rem 0;
	border-radius: .12rem;
	overflow: hidden;
	& .remove {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		line-height: 0.46rem;
		background: rgba(0, 0, 0, .5);
		color: #fff;
		text-align: center;
		font-size: .28rem;
	}
	& img {
		width: 100%;
		height: 100%;
	}

	& .icon-play_solid {
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		text-align: center;
		font-size: 0.4rem;
		text-indent: 0.05rem;
		top: 0.6rem;
		left: 0.72rem;
		z-index: 2;
		color: #fff;
		background: rgba(0,0,0,0.6);
		width: 0.8rem;
		height: 0.8rem;
		@apply --round;
	}
}
.content_editor-audio {
	margin-top: 0.2rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 0.3rem;
	& .remove-icon {
		display: flex;
		width: 0.28rem;
		height: 0.28rem;
		line-height: .28rem;
		justify-content: center;
		align-items: center;
		background: #bfbfbf;
		color: #fff;
		border-radius: 100%;
		& i {
			font-size: .2rem;
			transform: scale(0.5);
		}
	}
}
.content_editor-tool {
	display: flex;
	padding: 0.2rem;
	border-top: 1px solid #f4f4f4;
	color: #fff;
	font-size: .48rem;

	/* & em {
		font-size: 0.3rem;
		padding-left: 0.1rem;
	} */
	& .iconfont {
		font-size: .44rem;
	}
	& .tool-item-image {
		@apply --tool-item;
		font-size: .4rem;
	}
	& .tool-item-video {
		@apply --tool-item;
		font-size: .48rem;
	}
	,
	& .tool-item-audio {
		@apply --tool-item;

		& .icon-voice {
			font-size: .44rem;
		}
	}

	& .tool-item-text-tips {
		font-size: 0.26rem;
		color: #aaa;
		line-height: 0.7rem;
		margin-left: 0.22rem;
	}
}


</style>
