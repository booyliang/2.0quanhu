export default {
	data() {
		return {
			moreActionMixinCollectFlag: undefined
		}
	},
	computed: {
		isQuestion() {
			const { moduleEnum } = this.moreActionMixinsResourceData;
			return parseInt(moduleEnum) === 1006;
		},
		moreActionMixinsResourceData() {
			let result = this[this.moreActionDataModelKey];
			return result;
		},
		moreActionMixinParams() {
			const { moduleEnum, kid, title, content, videoThumbnailUrl, imgUrl, answerId, coterieId } = this.moreActionMixinsResourceData;
			const shareImg = videoThumbnailUrl || imgUrl && imgUrl.split(',')[0] || ''
			const paramsConfig = {
				// 转发
				1: {},
				// 置顶
				2: {},
				// 收藏
				3: {
					actionCode: 3,
					actionStatus: this.moreActionMixinCollectFlag ? 1 : 0,
					parameters: {
						coterieId: coterieId ? coterieId : 0,
						moduleEnum: this.isQuestion ? '1007' : moduleEnum,
						resourceId: this.isQuestion ? answerId : kid
					}
				},
				// 删除
				4: {
					actionCode: 4,
					parameters: {
						moduleEnum: moduleEnum,
						resourceId: kid
					}
				},
				// 举报
				5: {
					actionCode: 5,
					parameters: {
						moduleEnum: moduleEnum,
						resourceId: kid
					}
				},
				// 复制链接
				6: {
					actionCode: 6,
					parameters: {
						text: this.$utils.getShareUrl()
					}					
				},
				// 分享
				7: {
					actionCode: 7,
					parameters: {
						pic: shareImg,
						title: title ? title : '',
						content: content ? content : '',
						url: this.$utils.getShareUrl(),
						nativeLink: this.$utils.getNativeLink({ kid, moduleEnum, coterieId }),
						resourceId: kid
					}
				},
			}
			let params = [];
			this.moreActionMenuList.forEach(item => {
				params.push(paramsConfig[item]);
			})
			return params;
		},
		configCollect() {
			return !!this.moreActionMenuList.filter(item => item === 3).length;
		}
	},
	methods: {
		// 收藏操作回调
		moreActionHandleCollect() {
			this.moreActionMixinCollectFlag = this.moreActionMixinCollectFlag ? 0 : 1;
			const { kid, answerId } = this.moreActionMixinsResourceData;
			this.$yryz.update({
				kid: this.isQuestion ? answerId : kid,
				collectionFlag: this.moreActionMixinCollectFlag ? 11 : 10
			})
		},
		// 转发操作回调
		moreActionHandleForward() {
			console.log('转发回调');
		},
		// 删除操作回调
		moreActionHandleDelete() {
			const { kid } = this.moreActionMixinsResourceData;
			this.$yryz.delete({ kid });
			this.$router.back();
		},
		async moreActionMixinOpen() {
			if (this.configCollect) {
				const { answerId, kid } = this.moreActionMixinsResourceData;
				let params = {
					countType: '15',
					kid: this.isQuestion ? answerId : kid,
					userId: this.$env.userId
				}
				if (this.$env.userId && this.moreActionMixinCollectFlag === undefined) {
					let res = await this.$http.get(`/services/app/v2/behavior/getCountFlag`, { params })
					if (res.data.code === '200') {
						this.moreActionMixinCollectFlag = res.data.data.collectionFlag === 11 ? 1 : 0
					}
				}
			}	

			let resData = await this.$yryz.moreAction(this.moreActionMixinParams);
			switch (resData.actionCode) {
				case 1:
					this.moreActionHandleForward();
					break;
				case 3:
					this.moreActionHandleCollect();
					break;
				case 4:
					this.moreActionHandleDelete();
					break;
				default:
					break;
			}
		}
	}
}