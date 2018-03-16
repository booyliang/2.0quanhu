<template>
	<div class="upload_cover_wrap">
		<div class="cover_img_container" v-if="coverImg">
			<div class="cover_img">
				<img :src="coverImg | imageResize('250_250')" @click="nativeUploadCoverImg">
				<input class="select_file" @change="uploadCover" accept="image/*" type="file" v-if="!inApp">
			</div>
			<div class="upload_right">
				<p class="text_tips">封面图用于参与本活动的形象展示，请选择清晰的美图。</p>
				<div class="img_tips">
					<div v-text="$R('change-fm-img')" @click="nativeUploadCoverImg"></div>
					<input class="select_file" @change="uploadCover" accept="image/*" type="file" v-if="!inApp">
				</div>
			</div>
		</div>
		<div class="containerWrap" v-else>
			<div class="container">
				<div class="select_file" @click="nativeUploadCoverImg" v-if="inApp"></div>
				<input class="select_file" v-else @change="uploadCover" accept="image/*" type="file">
				<div class="iconfont icon-add_line"></div>
				<p>添加封面图</p>
			</div>
			<div class="upload_right">
				<p class="text_tips">封面图用于参与本活动的形象展示， 请选择清晰的美图。</p>
				<div class="img_tips" v-text="$R('change-fm-img')"></div>
			</div>
		</div>
	</div>
</template>
<script>
import Mixin from '../../../mixins'
export default {
	name: 'y-upload-cover',
	mixins: [Mixin],
	props: {
		coverPlan: {
			type: String,
			default: '',
		},
		videoEnabeld: {
			type: Boolean,
			default: false,
		}
	},
	data() {
		return {
			inApp: this.$yryz.isNative(),
			coverImg: this.coverPlan,
		}
	},
	methods: {
		nativeUploadCoverImg() {
			// this.$toast('yryz uploadPics');
			this.$yryz.uploadPics({ picNum: 1, isCrop: true, scaleY: 1 }).then(data => {
				this.coverImg = data.picUrls[0];
				this.$emit('uploadCover', this.coverImg);			
			})
		},
		async uploadCover(e) {
			if (this.videoEnabeld) {
				this.$toast('请下载圈乎APP参加活动')
				return;
			}
			let file = this.getFile(e);
			this.coverImg = await this.uploadFile(file);
			this.$emit('uploadCover', this.coverImg);				
		},
	}
}
</script>

<style>
@import '#css/var.css';
.upload_cover_wrap {
	background: #F8F8F8;
	padding: 0.3rem;

	& .containerWrap {
		display: flex;
		align-items: top;
	}

	& .upload_right {
		display: inline-block;
		width: 4.92rem;
		margin-left: 0.2rem;
	}

	& .container {
		position: relative;
		border: 1px solid #BFBFBF;
		background: #fff;
		width: 1.66rem;
		height: 1.66rem;
		border-radius: 0.1rem;
		text-align: center;
		overflow: hidden;
		& .icon-add_line {
			font-size: .6rem;
			color: #BFBFBF;
			margin-top: .1rem;
		}

		& p {
			font-size: .22rem;
			color: #666;
		}
	}

	& .img_tips {
		position: relative;
		display: inline-block;
		height: 0.58rem;
		line-height: 0.58rem;
		color: #fff;
		background: #ccc;
		border-radius: .1rem;
		padding: 0 0.2rem;
		font-size: .28rem;
	}

	& .text_tips {
		font-size: 0.26rem;
		color: var(--text-tips-color);
		margin-bottom: 0.3rem;
		text-align: justify;
	}

	& .cover_img_container {
		display: flex;
		align-items: top;

		& .cover_img {
			position: relative;
			width: 1.66rem;
			height: 1.66rem;
			border-radius: 0.1rem;
			overflow: hidden;
		}

		& img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		& .img_tips {
			background: #66b6ff;
		}
	}
	& .select_file {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
	}
}
</style>

