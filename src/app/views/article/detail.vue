<template>
	<div class="article-detail">
		<y-nav :title="title" :class="{'hideUnderline': hideUnderline}">
			<y-button @click.native.stop="moreActionMixinOpen" slot="nav-right" type="text" class="iconfont icon-more_line"></y-button>
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
		<y-detail-action :action-option="['comment', 'repost', 'reward', 'like']" v-if="articleData.kid" :resource-data="articleData"></y-detail-action>
	</div>
</template>

<script>
	import Card from '@/components/card'
	import YContentSource from '@/components/content-source'
	import DetailAction from "@/components/detail-action"
	import moreActionMixin from '@app/mixins/more-action'
	export default {
		name: 'article-detail',
		mixins: [moreActionMixin],
		components: {
			[Card.name]: Card,
			YContentSource,
			[DetailAction.name]: DetailAction
		},
		data() {
			return {
				hideUnderline: true,
				title: '',
				articleData: {},
				moreActionDataModelKey: 'articleData',
				moreActionMenuList: [7, 3]
			}
		},

		methods: {
			async initData() {
				this.$indicator.open()
				let res = null
				try {
					res = await this.$http.get(`/services/app/v2/release/info/detail?kid=${this.$route.params.articleId}`)
				} catch (error) {
					this.$indicator.close()
				}
				this.$indicator.close()
				if (res.data.code === '200') {
					this.articleData = res.data.data || {}
					if (this.$env.userId === this.articleData.user.userId) {
						this.moreActionMenuList.push(4);
					} else {
						this.moreActionMenuList.push(5);
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
			}
		},

		created() {
			const { coterieId } = this.$route.query;
			if (coterieId && coterieId !== '0') {
				this.$router.replace(`/coterie/${coterieId}/article/detail/${this.$route.params.articleId}`)
			} else {
				this.initData()
			}

			window.addEventListener('scroll', this.handleScroll)
		},

		beforeDestroy() {
			window.removeEventListener('scroll', this.handleScroll)
		}
	}
</script>

<style>
	@import '#/css/var.css';
	.article-detail {
		min-height: 100vh;
		& .hideUnderline {
			& .nav--background {
				border: none;
			}
		}

		& .article-info {
			width: 100%;
			padding: .1rem .3rem .5rem;
			background: #fff;
			& .title {
				line-height: 1.3;
				font-size: .44rem;
			}
			& .y_card {
				margin: .3rem 0 .5rem 0;
				& .y_avatar {
					width: .5rem;
					height: .5rem;
					flex: 0 0 .5rem;
					& .y_avatar-badge {
						width: .24rem;
						height: .24rem;
					}
				}
			}
			& .time {
				text-align: right;
				font-size: .24rem;
				color: var(--text-tips-color);
			}

		}
	}
</style>