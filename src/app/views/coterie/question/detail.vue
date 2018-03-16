<template>
	<div class="coterie-question">
		<y-nav title="问答详情">
			<y-button @click.native.stop="onAction" slot="nav-right" type="text" class="iconfont icon-more_line" v-if="showMoreActionToggle"></y-button>
		</y-nav>
		<!-- 问题详情 -->
		<div class="question-info">
			<y-card v-if="questioner.user" :anonymity="questioner.isAnonymity" :user-id="questioner.user.userId" :badge="questioner.user.userRole === 11"
			 :title="questioner.user.userNickName" :src="questioner.user.userImg">
				<span slot="sign" class="sign">提问</span>
			</y-card>
			<div class="info_tag">
				<y-tag type="privacy" v-if="questionData.isOnlyShowMe === 11">私密</y-tag>
				<y-tag type="rejected" v-if="questionData.answerdFlag === 12">已拒绝</y-tag>
				<y-tag type="invalid" v-if="questionData.isValid === 11">已失效</y-tag>
			</div>
			<div class="content" v-text="questionData.content"></div>
			<p class="release-time">{{questionData.createDate | recentTime}}</p>
		</div>
		<!-- 圈粉查看&未回答 -->
		<div class="no_data" v-if="questionData.kid && userStatus === 20 && questionData.answerdFlag !== 11">
			<div class="no_data-img"></div>
			<p>{{message}}</p>
		</div>
		<!-- 圈主查看&未回答 -->
		<div class="button_box" v-if="questionData.kid && userStatus === 10 && questionData.answerdFlag !== 11">
			<y-button @click.native="toAnswer" block :disabled="disabled">{{btnText}}</y-button>
		</div>
		<!-- 回答详情 -->
		<div class="answer-info" v-if="questionData.answerdFlag === 11">
			<y-card v-if="answerData.user" :user-id="answerData.user.userId" :badge="answerData.user.userRole === 11" :title="answerData.user.userNickName"
			 :src="answerData.user.userImg">
				<span slot="sign" class="sign">回答</span>
			</y-card>

			<y-audio v-if="answerData.answerAudio" :src="answerData.answerAudio" :time="answerData.audioLength">
				<span slot="icon" class="iconfont icon-answer_solid"></span>
			</y-audio>

			<y-content-source v-else :content-source="answerData.contentSource">
				<span slot="icon" class="iconfont icon-answer_solid"></span>
			</y-content-source>

			<p class="release-time">{{answerData.createDate | recentTime}}</p>
		</div>
		<y-detail-action :action-option="['comment', 'reward', 'like']" v-if="answerData.kid && questionData.answerdFlag === 11 && questionData.isOnlyShowMe === 10"
		 :resource-data="answerData"></y-detail-action>
	</div>
</template>

<script>
	import Card from '@/components/card'
	import YTag from './components/tag'
	import YAudio from '@/components/audio'
	import YContentSource from '@/components/content-source'
	import DetailAction from "@/components/detail-action"
	import moreActionMixin from '@app/mixins/more-action'
	import coterieMoreActionMixin from '../mixins/coterie-more-action'
	export default {
		name: 'coterie-question',
		mixins: [moreActionMixin, coterieMoreActionMixin],
		components: {
			[Card.name]: Card,
			YTag,
			YAudio,
			YContentSource,
			[DetailAction.name]: DetailAction
		},

		data() {
			return {
				coterieId: this.$route.params.coterieId,
				inApp: this.$yryz.isNative(),
				questioner: {},
				message: '不要心急，圈主还在构思答案~',
				btnText: '去回答',
				disabled: false,
				questionData: {},
				answerData: {},
				moreActionDataModelKey: 'questionData',
				moreActionMenuList: [7, 3],
				enterPageTime: new Date().getTime(),
			}
		},
		computed: {
			showMoreActionToggle() {
				return !(this.userStatus === 10 && this.questionData.answerdFlag === 11 && this.questionData.isOnlyShowMe === 11)
			},
			menuData() {
				let menu = [
					{ text: '拒绝回答', handler: () => this.rejectAnswer() },
					{ text: '举报', handler: () => this.handleReport() },
					{ text: '删除', handler: () => this.deleteQuetion() }
				]
				let newMenu = [];
				if (this.userStatus === 10) {
					if (this.questionData.answerdFlag !== 11) {
						newMenu.push(menu[0], menu[1])
					}
				} else {
					if (this.questionData.answerdFlag !== 11) {
						newMenu.push(menu[2])
					} else if (this.questionData.isOnlyShowMe === 11) {
						newMenu.push(menu[2])
					}
				}
				return newMenu
			}
		},

		created() {
			this.getUserInfoByCoterie(this.coterieId)
			this.initData()
		},
		methods: {
			validFailure() {
				const { serviceCurrentDate, failureDate } = this.questionData;
				let currentTime = new Date().getTime();
				return (currentTime - this.enterPageTime) >= (failureDate - serviceCurrentDate);
			},
			async initData() {
				this.$indicator.open()
				try {
					let questionRes = null
					if (!this.inApp) {
						questionRes = await this.$http.get(`/services/app/v2/coterie/question/singlePublic?kid=${this.$route.params.questionId}`)
					} else {
						questionRes = await this.$http.get(`/services/app/v2/coterie/question/single?kid=${this.$route.params.questionId}`)
					}
					if (questionRes.data.code === '200') {
						this.questionData = questionRes.data.data;
						this.setValue(this.questionData)
						if (this.questionData.answerdFlag === 11) {
							let answerRes = null
							if (!this.inApp) {
								answerRes = await this.$http.get(`/services/app/v2/coterie/answer/singlePublic?kid=${this.questionData.kid}`)
							} else {
								answerRes = await this.$http.get(`/services/app/v2/coterie/answer/single?kid=${this.questionData.kid}`)
							}
							if (answerRes.data.code === '200') {
								this.answerData = answerRes.data.data
								this.questionData.answerId = this.answerData.kid
							}
							// more-action添加配置参数
							if (this.userStatus === 10) {
								if (this.questionData.isOnlyShowMe === 10) {
									this.moreActionMenuList.push(5);
								}
							} else {
								if (this.questionData.isOnlyShowMe === 10) {
									if (this.$env.userId === this.questionData.user.userId) {
										this.moreActionMenuList.push(4);
									} else {
										this.moreActionMenuList.push(5);
									}
								}
							}
						}
					}
				} catch (error) {
					this.$indicator.close()
				}
				this.$indicator.close()
			},

			async toAnswer() {
				// 校验：1.圈主是否被平台禁言 2.该问题是否下线 3.若该问题为付费需校验是否在48小时内
				let shutupRes = await this.$http.get(`/services/app/v2/user/getPermission?userId=${this.$env.userId}`)
				if (shutupRes.data.code === '200') {
					if (shutupRes.data.data.disTalk) {
						this.$toast('您已被禁言！', { autoClose: 1000 })
					} else {
						const { moduleEnum, kid, coterieId, chargeAmount, serviceCurrentDate, failureDate } = this.questionData;
						this.$http({
							method: 'get',
							url: '/services/app/v2/resource/state',
							params: {
								moduleEnum: moduleEnum,
								resourceId: kid
							}
						}).then(res => {
							let resData = res.data;
							if (resData.code === '200') {
								let { resourceState } = resData.data;
								let toastMsg = "";
								if (resourceState === 11) {
									toastMsg = '该问题已被删除';
								} else if (chargeAmount && this.validFailure()) {
									toastMsg = '问题已失效'
								} else {
									this.$yryz.publish({
										moduleEnum: "1007",
										parameters: {
											questionId: kid,
											coterieId: coterieId
										}
									}).then(() => {
										this.$utils.refresh()
									})
									return;
								}
								this.$yryz.delete({kid: kid})
								this.$toast(toastMsg, { autoClose: 1000 }).then(() => {
									this.$router.back();
								})
							}
						})
					}
				}
			},

			setValue(data) {
				this.questioner = Object.assign({}, data)
				if (this.questioner.isAnonymity === 10) {
					this.questioner.user.userNickName = '匿名用户'
					this.questioner.user.userImg = ''
				}
				if (data.answerdFlag === 12) {
					this.message = '圈主已拒绝回答'
					this.disabled = true
					this.btnText = '已拒绝回答'
				}
				if (data.isValid === 11) {
					this.message = '已失效'
				}
			},

			onAction() {
				if (this.questionData.answerdFlag === 11) {
					if (this.userStatus === 10) {
						this.moreActionMixinOpen()
					} else {
						if (this.questionData.isOnlyShowMe === 10) {
							this.moreActionMixinOpen()
						} else {
							this.$actionsheet(this.menuData);
						}
					}
				} else {
					this.$actionsheet(this.menuData);
				}
			}
		}
	}
</script>

<style>
	@import '#/css/var.css';
	.coterie-question {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		& .question-info {
			position: relative;
			padding: .3rem .3rem .18rem;
			background: #fff;
			& .y_avatar {
				width: .5rem;
				height: .5rem;
				flex: 0 0 .5rem;
			}

			& .y_avatar-badge {
				width: .24rem;
				height: .24rem;
			}

			& .content {
				margin: .2rem 0;
				font-size: .32rem;
			}

		}

		& .info_tag {
			position: absolute;
			top: .3rem;
			right: .3rem;
		}

		& .no_data {
			flex: auto;
			padding: .9rem 0;
			& .no_data-img {
				width: 2.64rem;
				height: 2.4rem;
				margin: 0 auto .34rem auto;
				background-image: url(../../../../common/assets/no_data@2x.png);
				background-size: 2.64rem 2.4rem;
			}
			& p {
				text-align: center;
				font-size: .28rem;
				color: var(--text-assist-color);
			}
		}

		& .button_box {
			background: #fff;
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			height: 1.06rem;
			display: flex;
			align-items: center;
			padding: 0 1.15rem;
			box-shadow: 0 -2px 10px #ededed;
			/* & .button {
				background: #0085ff;
			} */
		}

		& .answer-info {
			padding: .4rem .3rem .3rem;
			background: #fff;
			border-top: 1px solid #dddddd;
			& .y_card {
				margin-bottom: .3rem;
			}

			& .y_avatar {
				width: .8rem;
				height: .8rem;
				flex: 0 0 .8rem;
			}

			& .y_avatar-badge {
				width: .32rem;
				height: .32rem;
			}

			& .release-time {
				margin-top: .3rem;
			}

			& .icon-answer_solid {
				margin-right: .1rem;
				font-size: .35rem;
				color: #5db1ff;
			}
		}

		& .release-time {
			text-align: right;
			font-size: .24rem;
			color: var(--text-tips-color);
		}
	}
</style>