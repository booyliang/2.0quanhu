<template>
	<div class="activity_join_wrap">
		<y-nav title="参与活动" :showLeftArrow="inApp">
			<span slot="nav-right" @click="publish">确认发布</span>
		</y-nav>

		<div v-if="configInfo">
			<y-upload-cover :cover="postData.coverPlan" :videoEnabeld="videoEnabeld" @uploadCover="uploadCover"></y-upload-cover>
			<y-input type="textarea" v-if="configInfo.content" v-model="postData.content" :placeholder="configInfo.content.inputPrompt" :maxlength="parseInt(configInfo.content.upperLimit)"></y-input>
			<y-input type="textarea" v-if="configInfo.content1" v-model="postData.content1" :placeholder="configInfo.content1.inputPrompt" :maxlength="parseInt(configInfo.content1.upperLimit)"></y-input>
			<y-input type="textarea" v-if="configInfo.content2" v-model="postData.content2" :placeholder="configInfo.content2.inputPrompt" :maxlength="parseInt(configInfo.content2.upperLimit)"></y-input>

			<transition-group name="list" tag="div" class="content_editor_list" v-if="imgs.length">
				<div class="content_editor_img" v-for="(item, index) in imgs" :key="item">
					<img :src="item | imageResize(2)" @click="showPreview(index)">
					<div class="remove" @click="removeImg(index)">删除</div>
				</div>
			</transition-group>
			<div v-if="videoEnabeld && video.url" class="content_editor_video" :key="video.url">
				<img :src="video.thumbnailImage | imageResize(3)">
				<span class="iconfont icon-play_solid icon_play" @click="playVideo"></span>
				<span class="iconfont icon-close_line remove" @click="removeVideo"></span>
				<span v-if="video.videoTime" v-text="videoTimes" class="video_times"></span>
			</div>

			<div class="placeholder"></div>

			<div class="upload_content_img" v-if="imageEnabeld || videoEnabeld">
				<span class="button_container">
					<button class="tool-item-image iconfont icon-pic_line" :disabled="!imageEnabeld || imgs.length >= imgMaxLength" @click="nativeUploadContentImg" v-if="imageEnabeld"> </button>
					<button class="tool-item-video iconfont icon-video_line" :disabled="!videoEnabeld || video.url" @click="uploadVideo" v-if="videoEnabeld"> </button>
					<input class="select_file" @change="uploadContentImg" accept="image/*" type="file" multiple="multiple" v-if="!inApp && imageEnabeld && !videoEnabeld">
				</span>
				<!-- <span class="upload_tips" v-text="uploadTips"></span> -->
			</div>
		</div>
	</div>
</template>

<script>
import YInput from '@/components/input'
import YEditor from '@/components/content-editor'
// import { YPublishButton, PublishMixin } from "@/components/content-publish"
import album from '@/components/album'
import YUploadCover from '../components/upload-cover'
import Mixin from '../mixins'
export default {
	mixins: [Mixin],
	components: {
		YInput, YEditor, YUploadCover,
	},
	computed: {
		imageEnabeld() {
			return this.configInfo.imgUrl !== undefined;
		},
		videoEnabeld() {
			return this.configInfo.videoUrl !== undefined;
		},
		imgMaxLength() {
			return this.configInfo.imgUrl ? parseInt(this.configInfo.imgUrl.upperLimit) : 0;
		},
		uploadTips() {
			if (this.configInfo.imgUrl) return '上传图片';
			if (this.configInfo.videoUrl) return '上传视频';
			return '';
		},
		videoTimes() {
			let ms = this.video.videoTime;
			let h, m, s, str = '';
			h = parseInt((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			m = parseInt((ms % (1000 * 60 * 60)) / (1000 * 60));
			s = parseInt((ms % (1000 * 60)) / 1000);
			if (h > 0) str = (h < 10 ? '0' + h : h) + ':'
			str += (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
			return str;
		}
	},
	data() {
		return {
			inApp: !!this.$yryz.isNative(),
			postData: {
				activityInfoId: this.$route.params.activityId,
				coverPlan: '',
				imgUrl: '',
				content: '',
				content1: '',
				content2: '',
				videoThumbnailUrl: '',
				videoUrl: '',
				// moduleEnum: '1008',
			},
			imgs: [],
			video: {
				// thumbnailImage: 'https://cdn-qa.yryz.com/pic/hwq/0562d29bbe12bc129e1698404dc303f2.png',
				// url: 'https://cdn-qa.yryz.com/video/hwq/1988821500e87d4cd744108dd8829610.mp4',
				// videoTime: 72000,
				// size: 6520,
			},
			configInfo: null,
		}
	},

	async mounted() {
		if (!this.$env.userId) {
			this.$router.replace({ name: 'voteHome' });
			return;
		}
		if (!this.inApp) document.title = '参与活动';
		let params = { activityInfoId: this.$route.params.activityId }
		let res = await this.$http.get(`/services/app/v2/activity/candidate/config`, { params })
		let resData = res.data;
		if (resData.code === '200')
			this.configInfo = JSON.parse(res.data.data.configSources);
		// else if (resData.code === '1001' || resData.code === '1002' || resData.code === '1003' || resData.code === '1004')
			// this.$eventBus.$emit('login');
	},
	beforeDestroy() {
		album.hide();
	},

	methods: {
		uploadCover(url) {
			this.postData.coverPlan = url;
		},
		nativeUploadContentImg() {
			this.$yryz.uploadPics({ picNum: this.imgMaxLength - this.imgs.length }).then(data => {
				this.imgs.push(...data.picUrls);
			})
		},
		uploadVideo() {
			if (!this.inApp) {
				this.$toast('请下载圈乎APP参加活动')
				return;
			}
			this.$yryz.uploadVideo().then(data => { this.video = data; })
		},
		removeImg(index) {
			this.imgs.splice(index, 1);
		},
		removeVideo() {
			this.video = {};
		},
		playVideo() {
			if (this.inApp) this.$yryz.playVideo({ videoUrl: this.video.url });
		},

		async uploadContentImg(e) {
			let files = e.target.files;
			let diff = this.imgMaxLength - this.imgs.length;
			let len = files.length > diff ? diff : files.length;
			for (let i = 0; i < len; i++) {
				let url = await this.uploadFile(files[i]);
				this.imgs.push(url);
			}
			e.target.value = '';
		},

		showPreview(index) {
			let listData = JSON.parse(JSON.stringify(this.imgs));
			// if (this.video.url) {
			// 	listData.push(this.video);
			// }
			album.init(listData);
			album.show(index);
		},

		/**
		 * 发布内容效验
		 */
		validate() {
			if (!this.postData.coverPlan) {
				this.$toast('请上传封面图');
				return false;
			}
			if (this.configInfo.content && this.configInfo.content.required === '1' && (this.postData.content.length < this.configInfo.content.lowerLimit || this.postData.content.length > this.configInfo.content.upperLimit)) {
				this.$toast(this.configInfo.content.errorPrompt);
				return false;
			}
			if (this.configInfo.content1 && this.configInfo.content1.required === '1' && (this.postData.content1.length < this.configInfo.content1.lowerLimit || this.postData.content1.length > this.configInfo.content1.upperLimit)) {
				this.$toast(this.configInfo.content1.errorPrompt);
				return false;
			}
			if (this.configInfo.content2 && this.configInfo.content2.required === '1' && (this.postData.content2.length < this.configInfo.content2.lowerLimit || this.postData.content2.length > this.configInfo.content2.upperLimit)) {
				this.$toast(this.configInfo.content2.errorPrompt);
				return false;
			}
			if (this.configInfo.imgUrl && this.configInfo.imgUrl.required === '1' && !this.imgs.length) {
				this.$toast(this.configInfo.imgUrl.errorPrompt);
				return false;
			}
			if (this.configInfo.videoUrl && this.configInfo.videoUrl.required === '1' && !this.video.url) {
				this.$toast(this.configInfo.videoUrl.errorPrompt);
				return false;
			}
			return true;
		},

		/**
		 * 活动发布
		 */
		async publish() {
			if (!this.validate()) return;
			this.postData.imgUrl = this.imgs.join(',');
			this.postData.videoThumbnailUrl = this.video.thumbnailImage;
			this.postData.videoUrl = this.video.url;
			this.$indicator.open('发布中...');
			let res = await this.$http.post(`/services/app/v2/activity/candidate/join`, this.postData)
			this.$indicator.close();
			let resData = res.data;
			if (resData.code === '200') {
				this.$toast('发布成功').then(res => {
					sessionStorage.setItem('publishSuccess', 'publishSuccess');
					this.$router.replace({ name: `worksJoinShare`, params: { id: resData.data.kid } });
				})
			}
		}
	}
}
</script>

<style>
@import '#css/var.css';
.activity_join_wrap {
	& .nav-left {
		width: 1.28rem;
	}
	& .nav-right>span {
		font-size: .32rem;
		color: var(--theme-color);
	}

	& .select_file {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
	}

	& .y-input-wrap {
		padding: 0 .3rem .2rem;
		& textarea {
			padding: 0;
			padding-top: .2rem;
		}
	}
	& .y-input-wrap+.y-input-wrap {
		& textarea {
			@apply --border-top;
		}
	}

	& .content_editor_list {
		padding: .2rem .14rem;
		background-color: #ffffff;
		border-top: 1px solid #e7e7e7;
		& .content_editor_img {
			display: inline-block;
			transition: all 1s;
			position: relative;
			width: 2.24rem;
			height: 2.24rem;
			margin: .08rem 0.08rem 0;
			overflow: hidden;
		}
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

		& .list-enter,
		& .list-leave-active {
			opacity: 0;
			transform: translateY(1.6rem);
		}

		& .list-leave-active {
			position: absolute;
		}
	}
	& .content_editor_video {
		position: relative;
		width: 6.9rem;
		height: 3.1rem;
		overflow: hidden;
		margin: .3rem auto .5rem;
		& .icon_play {
			@apply --round;
			display: flex;
			justify-content: center;
			align-items: center;
			position: absolute;
			top: 50%;
			left: 50%;
			width: 0.86rem;
			height: 0.86rem;
			margin-top: -.43rem;
			margin-left: -.43rem;
			font-size: 0.36rem;
			text-indent: 0.05rem;
			color: #fff;
			background: rgba(0, 0, 0, 0.5);
			z-index: 2;
		}
		& .remove {
			display: flex;
			justify-content: center;
			align-items: center;
			position: absolute;
			top: 0;
			right: 0;
			width: .48rem;
			height: .48rem;
			font-size: .28rem;
			background: rgba(0, 0, 0, .2); 
			color: #fff;
			border-bottom-left-radius: .15rem;
		}
		& .video_times {
			position: absolute;
			right: .1rem;
			bottom: .1rem;
			color: #fff;
			background-color: rgba(0,0,0,.5);
			border-radius: 1rem;
			padding: 0 .1rem;
		}
	}

	& .placeholder {
		height: 1.1rem;
	}

	& .upload_content_img {
		@apply --border-top;
		position: fixed;
		bottom: 0;
		padding: .2rem .4rem;
		width: 100%;
		background-color: #FFF;
		display: flex;
		align-items: center;
		z-index: 3;
		& .button_container {
			position: relative;
			display: inline-block;
		}
		& .tool-item-image,
		& .tool-item-video {
			color: #3ba1ff;
			font-size: .6rem;

			&[disabled] {
				color: var(--disabled-color);
				/* background: var(--disabled-color); */
				pointer-events: none;
			}
		}
		& .upload_tips {
			font-size: 0.28rem;
			color: #aaa;
			margin-left: 0.2rem;
		}
	}
}
</style>


