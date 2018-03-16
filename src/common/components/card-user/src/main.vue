/**
*	Author: yefan
*
*/
<template>
	<y-card @click-img="handleClickAvatar" :src="userData.userImg" :to="userData.to" :assist="userData.createDate | recentTime"
	:badge="userData.roleFlag" :title="userData.userNickName" :position="position" :img-size="imgSize"></y-card>
</template>
<script>
	import YCard from '@/components/card'
	export default {
		name: 'y-card-user',
		components: {
			YCard
		},
		props: {
			data: {
				type: Object
			},
			position: {
				type: String,
				default: 'horizontal'
			},
			imgSize: String,
			disabledRouter: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				userData: {}
			}
		},
		methods: {
			handleClickAvatar(data) {
				this.$emit('click-avatar', data)
			},
			setValue() {				
				let toLink = !!this.$utils.getModule('0021').link; // 如果user没有配置点击头像不跳转
				this.userData.to = this.data.disabledCard ||  this.disabledRouter || !toLink ? '' : `/user/${this.userData.createUserId}`;
				this.userData.roleFlag = Boolean(this.userData.roleFlag);
				if (this.userData.anonymity) {
					this.userData.nickName = this.$R('anonymous');
					this.userData.roleFlag = false;
					this.userData.to = '';
					this.userData.userImg = '';
				}
			}
		},
		watch: {
			data(newVal, oldVal) {
				if (newVal === oldVal) return;
				// this.setValue();
			}
		},
		mounted() {
			this.userData = Object.assign({}, this.data);
			// this.setValue();
		}
	}
</script>
