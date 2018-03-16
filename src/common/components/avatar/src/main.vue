/**
*	Author: yefan
*
*/
<template>
	<div class="y_avatar" @click.stop.prevent="onClickAvatar">
		<img class="y_avatar-img" :class="{'y_avatar-default': !src}" :alt="alt" :src="(src || defaultAvatar) | imageResize(4)">
		<sub v-if="badge" class="y_avatar-badge"></sub>
	</div>
</template>
<script>
export default {
	name: 'y-avatar',
	props: {
		src: String,
		alt: {
			default: '用户头像'
		},
		defaultAvatar: {
			default: '/assets/static/default-avatar@2x.png'
		},
		badge: Boolean,
		type: {
			type: Number,
			default: 1,
		},
		imgSize: String
	},
	methods: {
		onClickAvatar() {
			if (!this.to) {
				this.$emit('click-avatar', this.src)
			}
		}
	},
}
</script>
<style>
.y_avatar {
	position: relative;
	width: 100%;
	height: 100%;
	min-width: .44rem;
	min-height: .44rem;
}

.y_avatar-img {
	width: 100%;
	height: 100%;
	border-radius: 100%;
}

.y_avatar-badge {
	position: absolute;
	bottom: 0;
	right: 0;
	width: .32rem;
	height: .32rem;
	border-radius: 100%;
	background-image: url('./images/star@2x.png');
	background-size: cover;
}
</style>