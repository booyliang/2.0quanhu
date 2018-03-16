<template>
	<div class="share_wrap">
		<div class="share-content">
			<div v-for="(action, index) in shareActions" :key="index" @click="doAction(action)" class="iconfont share-item icon-share" :style="{'background-image': `url(${action.icon})`}">
				<span v-text="action.text"></span>
			</div>
		</div>
	</div>
</template>

 <script type="text/javascript">
export default {
	name: 'share',
	props: {
		handle: String,
		data: Object,
	},
	data() {
		return {
			shareActions: [],
			shareParmas: {},
			defaultActions: [
				{
					plat: 'YRIM',
					text: this.$R("share-YRIM"),
					icon: require('@/assets/share_icon_talk@2x.png'),
				},
				{
					plat: 'WeChat',
					text: this.$R("share-WeChat"),
					icon: require('@/assets/share_icon_wechat@2x.png'),
				},
				{
					plat: 'WeChatLine',
					text: this.$R("share-WeChatLine"),
					icon: require('@/assets/share_icon_timeline@2x.png'),
				},
				{
					plat: 'QQ',
					text: this.$R("share-QQ"),
					icon: require('@/assets/share_icon_qq@2x.png'),
				},
				{
					plat: 'QQZone',
					text: this.$R("share-QQZone"),
					icon: require('@/assets/share_icon_qzone@2x.png'),
				},
				{
					plat: 'Sina',
					text: this.$R("share-Sina"),
					icon: require('@/assets/share_icon_sina@2x.png'),
				}
			]
		};
	},
	methods: {
		getShareData(data, plat) {
			let pic = data.coverPlanUrl || '';
			let content = data.content || '';
			let title = data.title || content;
			let url = data.url || this.$utils.getShareUrl();
			let nativeLink = this.$utils.getNativeLink({
				kid: data.kid,
				moduleEnum: data.moduleEnum,
				coterieId: 0
			})
			let shareData = {
				plat,
				title,
				content,
				pic,
				url,
				nativeLink,
			};

			// if (data.moduleEnum) {
			// 	let Module = this.$utils.getModule(data.moduleEnum);
			// 	if (Module.share) {
			// 		shareData = Object.assign(shareData, Module.share.call(this, data, plat));
			// 	}
			// }

			return shareData;
		},
		async doAction(action) {
			if (action.plat === 'YRIM') await this.$user.login();
			let data = this.data || this.shareParmas;
			let shareData = this.getShareData(data, action.plat);			
			// console.log(shareData);
			try {
				// this.$toast(this.$yryz.shareToOtherPlat(shareData));
				await this.$yryz.shareToOtherPlat(shareData)
				this.$toast('分享成功！');
			} catch (err) {
				if (err.errMsg === 'shareToOtherPlat:cancel') {
					this.$toast('分享已取消');
				} else {
					this.$toast('分享失败！');
				}
			}
		}
	},

	async mounted() {
		// 显示用户已安装的app
		this.shareActions = []
		if (!this.$yryz.isIOS()) {
			this.shareActions = this.defaultActions;
			return;
		}
		this.shareActions.push(this.defaultActions[0])
		let plats = await this.$yryz.getInstallSharePlatform();
		if (plats.WeChat) {
			this.shareActions.push(this.defaultActions[1])
			this.shareActions.push(this.defaultActions[2])
		}
		if (plats.QQ) {
			this.shareActions.push(this.defaultActions[3])
			this.shareActions.push(this.defaultActions[4])
		}
		if (plats.Sina) {
			this.shareActions.push(this.defaultActions[5])
		}
	}
};
</script>

<style type="text/css">
@import '#/css/var.css';
.share_wrap {
	& .icon-share {
		width: 0.8rem;
		height: 1.4rem;
		background-repeat: no-repeat;
		background-position: center top;
		background-size: 0.8rem;
	}

	& .share-content {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		border: none;
		padding: 0.1rem .4rem;
		text-align: -webkit-center;
		align-content: space-between;
	}

	& .share-item {
		width: 33.3%;
		padding-top: 0.96rem;

		&+.share-item {
			margin-bottom: 0.2rem;
		}
	}
}
</style>
