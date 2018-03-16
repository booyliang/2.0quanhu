<template>
	<div class="article-detail">
		<div :class="{'blur-wrapper': showBuyModal}">
			<y-nav :title="title" :class="{'hideUnderline': hideUnderline}">
				<y-button @click.native.stop="onAction" slot="nav-right" type="text" class="iconfont icon-more_line"></y-button>
			</y-nav>
			<div class="article-info">
				<div class="title" v-text="articleData.title"></div>
				<y-card v-if="articleData.user" :user-id="articleData.user.userId" :badge="articleData.user.userRole === 11" :title="articleData.user.userNickName"
				 :src="articleData.user.userImg">
				</y-card>
				<y-content-source :content-source="articleData.contentSource">
					<p class="time">{{articleData.createDate | recentTime}}</p>
				</y-content-source>
			</div>
			<y-detail-action :action-option="['comment', 'reward', 'like']" v-if="articleData.kid" :resource-data="articleData"></y-detail-action>
		</div>
		<!-- 付费模态框 -->
		<div class="buy_modal-wrapper" v-if="showBuyModal">
			<div class="buy_modal-container">
				<span @click="closeBuyModal" class="iconfont icon-close1"></span>
				<div class="buy_modal-body">
					<h2>该资源详情付费可读，请先完成支付</h2>
					<h3>
						<span>待支付总额</span>
						<br>
						<span class="price">{{ contentPrice | priceUnit(2)}}</span>
						<span class="unit">悠然币</span>
					</h3>
				</div>
				<div class="buy_modal-footer">
					<div>
						<y-button block @click.native="toPay" :disabled="disabled">支付</y-button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Card from '@/components/card'
	import YContentSource from '@/components/content-source'
	import DetailAction from "@/components/detail-action"
	import moreActionMixin from '@app/mixins/more-action'
	import coterieMoreActionMixin from '../mixins/coterie-more-action'
	export default {
		name: 'article-detail',
		mixins: [moreActionMixin, coterieMoreActionMixin],
		components: {
			[Card.name]: Card,
			YContentSource,
			[DetailAction.name]: DetailAction
		},
		data() {
			return {
				hideUnderline: true,
				title: '',
				coterieId: this.$route.params.coterieId,
				inApp: this.$yryz.isNative(),
				articleData: {},
				moreActionDataModelKey: 'articleData',
				moreActionMenuList: [7, 3],
				contentPrice: 0,
				disabled: false,
				hasCollected: false
			}
		},
		computed: {
			showBuyModal() {
				return this.userStatus !== 10 && this.contentPrice && this.articleData.canReadFlag === 10
			},
			menuData() {
				let menu = [
					{ text: '收藏', handler: () => this.handleCollect() },
					{ text: '取消收藏', handler: () => this.handleUncollect() },
					{ text: '举报', handler: () => this.handleReport() }
				]
				let newMenu = []
				if (this.contentPrice) {
					if (this.userStatus === 10) {
						if (this.hasCollected) {
							newMenu.push(menu[1])
						} else {
							newMenu.push(menu[0])
						}
					} else {
						if (this.hasCollected) {
							newMenu.push(menu[1], menu[2])
						} else {
							newMenu.push(menu[0], menu[2])
						}
					}
				}
				return newMenu
			}
		},

		methods: {
			async initData() {
				this.$indicator.open()
				let res = null
				try {
					res = await this.$http.get(`/services/app/v2/coterie/release/info/detail?kid=${this.$route.params.articleId}`)
				} catch (error) {
					this.$indicator.close()
				}
				this.$indicator.close()
				if (res.data.code === '200') {
					this.articleData = res.data.data
					this.contentPrice = this.articleData.contentPrice
					this.getCollectFlag(this.articleData.kid)
					// more-action添加配置参数
					if (!this.contentPrice) {
						if (this.userStatus === 10) {
							this.moreActionMenuList.push(4);
						} else {
							this.moreActionMenuList.push(5);
						}
					}
				}
			},

			handleScroll() {
				var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
				if (scrollTop >= 50) {
					this.title = '详情'
					this.hideUnderline = false
				} else {
					this.title = ''
					this.hideUnderline = true
				}
			},

			onAction() {
				if (this.contentPrice) {
					this.$actionsheet(this.menuData)
				} else {
					this.moreActionMixinOpen()
				}
			},

			closeBuyModal() {
				this.$router.back();
			},

			async toPay() {
				this.disabled = true
				try {
					let orderRes = await this.$http.get(`/services/app/v2/coterie/release/info/order?kid=${this.articleData.kid}`);
					let orderId = orderRes.data.data.orderId.toString();
					await this.$yryz.pay({
						payMoney: this.articleData.contentPrice,
						orderId: orderId
					});
					let orderInfoRes = await this.$http.get(`/services/app/v2/pay/getOrderInfo?orderId=${orderId}`);
					if (orderInfoRes.data.data.orderState === 1) {
						this.$utils.refresh()
					}
				} catch (error) {
					this.disabled = false;
					this.$toast(error.data, { autoClose: 1000 });
				}
			},
			// 查询收藏状态
			async getCollectFlag(id) {
				let params = {
					countType: '15',
					kid: id,
					userId: this.$env.userId
				}
				let res = await this.$http.get(`/services/app/v2/behavior/getCountFlag`, { params })
				if (res.data.code === '200') {
					this.hasCollected = res.data.data.collectionFlag === 11 ? true : false
				}
			}
		},

		created() {
			this.getUserInfoByCoterie(this.coterieId)
			this.initData()
			window.addEventListener('scroll', this.handleScroll)
		},
		
		beforeDestroy() {
			window.removeEventListener('scroll', this.handleScroll)
		}
	}
</script>

<style>
	@import '#/css/var.css';
	.blur-wrapper {
		filter: blur(3px);
	}

	.buy_modal-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 100;
		background-color: rgba(0, 0, 0, .5);
		& .buy_modal-container {
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			background-color: white;
			& .icon-close1 {
				position: absolute;
				top: -.8rem;
				right: .2rem;
				color: white;
				font-size: .66rem;
			}
			& .buy_modal-body {
				text-align: center;
				padding: .5rem .3rem .4rem;
				& h2 {
					padding-bottom: .2rem;
					font-size: .36rem;
					color: var(--text-secondary-color);
				}
				& h3 {
					padding-top: .3rem;
					color: var(--text-assist-color);
					& .price {
						padding-left: .1rem;
						padding-right: .1rem;
						font-size: .72rem;
						color: #ffba00;
					}
					& .unit {
						font-size: .24rem;
						color: #000;
					}
				}
			}
			& .buy_modal-footer {
				padding: .2rem;
				text-align: center;
				@apply --border-top;
			}
		}
	}
</style>