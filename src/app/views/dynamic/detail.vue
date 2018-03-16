<template>
	<div class="dynamic_detail">
		<!-- nav begin -->
		<y-nav title="详情">
			<span slot="nav-right">
				<y-button type="text" @click.native.stop="moreActionMixinOpen" class="iconfont icon-more_line"></y-button>
			</span>
		</y-nav>

		<div class="dynamic_content" v-if="dynamicData">
			<!-- 用户头像、昵称 -->
			<y-card v-if="dynamicData.user" :user-id="dynamicData.user.userId" :badge="dynamicData.user.userRole === 11" :src="dynamicData.user.userImg"
			    :title="dynamicData.user.userNickName"></y-card>

			<!-- 转发理由 -->
			<p class="dynamic_reason" v-if="resourceModuleEnum === '1002' && dynamicData.transmitNote">{{dynamicData.transmitNote}}</p>

			<!-- 文章 begin -->
			<div class="article_main" v-if="(dynamicData.transmitType === '1003' && resourceModuleEnum !== '1000') || resourceModuleEnum === '1003'" @click="routerLink">
				<div class="dynamic_source">
					<h3 class="dynamic_title">{{mainData.title}}</h3>

					<div class="dynamic_img" v-if="imgUrl && !mainData.videoUrl">
						<y-flow-item-images :data="imgUrl"></y-flow-item-images>
					</div>

					<div class="content_source" v-if="mainData.content && !imgUrl && !mainData.videoUrl">{{mainData.content}}</div>

					<div class="dynamic_video" v-if="mainData.videoUrl">
						<y-video :src="mainData.videoUrl" :poster="mainData.videoThumbnailUrl | imageResize(6)"></y-video>
					</div>
				</div>
			</div>
			<!-- 文章 end -->

			<!-- 话题 begin -->
			<div class="topic_main" v-if="dynamicData.transmitType === '1004' || resourceModuleEnum === '1004'" @click="toTopicHome">
				<div class="dynamic_source">
					<h3 class="topic_title">#{{mainData.title}}#</h3>

					<div class="topic_img" v-if="mainData.imgUrl">
						<img :src="mainData.imgUrl | imageResize(6)" alt="">
					</div>

					<div class="content_source" v-if="mainData.content && !mainData.imgUrl ">{{mainData.content}}</div>
				</div>
			</div>
			<!-- 话题 end -->

			<!-- 帖子 begin -->
			<div class="post_main" v-if="dynamicData.transmitType === '1005' || resourceModuleEnum === '1005'" @click="routerLink">
				<div class="dynamic_source">
					<div class="post_content" v-if="mainData.content">{{mainData.content}}</div>

					<div class="dynamic_img" v-if="imgUrl && !mainData.videoUrl">
						<y-flow-item-images :data="imgUrl"></y-flow-item-images>
					</div>

					<div class="dynamic_video" v-if="mainData.videoUrl">
						<y-video :src="mainData.videoUrl" :poster="mainData.videoThumbnailUrl | imageResize(6)"></y-video>
					</div>
				</div>
			</div>
			<!-- 帖子 end -->

			<!-- 私圈 begin -->
			<div class="coterie_main" v-if="dynamicData.transmitType === '1000' || resourceModuleEnum === '1000'" @click="toCoterieHome">
				<div class="dynamic_source">
					<div class="coterie_content">
						<img :src="mainData.icon | imageResize('124_124')" class="coterie_img" alt="">
						<div class="coterie_info">
							<h3>{{mainData.name}}</h3>
							<p>{{mainData.intro}}</p>
						</div>
					</div>
				</div>
			</div>
			<!-- 私圈 end -->

			<!-- 创建时间 -->
			<p class="dynamic_date">{{dynamicData.createDate | recentTime}}</p>
		</div>

		<!-- 评论组件 -->
		<y-detail-action :action-option="['comment', 'repost', 'like']" v-if="dynamicData" :resource-data="dynamicData"></y-detail-action>
	</div>
</template>

<script>
	import YNav from '@/components/nav/nav';
	import YCard from '@/components/card';
	import YflowItem from '@/components/flow-item';
	import YFlowItemImages from '@/components/flow-item/flow-item-images';
	import YVideo from '@/components/video';
	import YDetailAction from '@/components/detail-action';
	import moreActionMixin from '@app/mixins/more-action';

	export default {
		components: {
			YNav,
			YCard,
			YFlowItemImages,
			YVideo,
			YDetailAction
		},
		mixins: [moreActionMixin],
		data() {
			return {
				dynamicData: null,
				mainData: null,
				// 已登录-动态发布者本人：删除
				// 已登录-非动态发布者本人：举报
				// 非登录：举报
				moreActionDataModelKey: 'dynamicData',
				moreActionMenuList: [],
				resourceModuleEnum: ''
			}
		},
		mounted() {
			this.$indicator.open()
			this.$http.get(`/services/app/v2/dymaic/getDymaic?kid=${this.$route.params.dynamicId}`).then(res => {
				this.$indicator.close();
				if (res.data.code === '200') {
					this.dynamicData = res.data.data || {};
					this.resourceModuleEnum = this.dynamicData.moduleEnum;
					this.dynamicData.moduleEnum = '1010'
					this.mainData = JSON.parse(res.data.data.extJson);
					if (this.$env.userId === this.dynamicData.user.userId) {
						this.moreActionMenuList.push(4);
					} else {
						this.moreActionMenuList.push(5);
					}
				}
			})
		},
		methods: {
			toCoterieHome() {
				this.$yryz.router({
					link: `quanhu://open/coterie/home?coterieId=${this.mainData.coterieId}`
				})
			},
			toTopicHome() {
				this.$yryz.router({
					link: `quanhu://open/topic/home?topicId=${this.mainData.kid}`
				})
			},
			routerLink() {
				const {
					kid,
					coterieId,
					moduleEnum
				} = this.mainData;
				let url = `/redirect/${moduleEnum}/${kid}`;
				if (coterieId) {
					url += `?coterieId=${coterieId}`
				}
				this.$router.push(url);
			}
		},
		computed: {
			imgUrl() {
				let urls = this.mainData.imgUrl;
				if (urls) {
					let imgArr = urls.split(',')
					if (imgArr.length < 3) {
						return imgArr.slice(0, 1)
					} else {
						return imgArr.slice(0, 3)
					}
				} else {
					return null
				}
			}
		}
	}
</script>

<style>
	@import "#/css/var.css";
	.dynamic_detail {
		& .dynamic_content {
			background: #fff;
			padding: .3rem 0;

			& .y_card {
				margin-bottom: .2rem;
				padding: 0 .3rem;

				& .y_avatar {
					width: .8rem;
					height: .8rem;
					flex: 0 0 0.8rem;
				}

				& .y_card-title {
					font-size: .28rem;
				}
			}

			& .dynamic_reason {
				font-size: .32rem;
				color: var(--text-primary-color);
				line-height: .44rem;
				padding: 0 .3rem;
			}

			& .dynamic_source {
				padding: .24rem 0.3rem;
				background: #f7f7f7;
				margin-top: .2rem;

				& .dynamic_title,
				& .content_source,
				& .post_content,
				& .topic_title {
					color: var(--text-assist-color);
					line-height: .4rem;
					font-size: var(--default-font-size);
				}

				& .dynamic_title {
					@apply --text-cut-multi-line;
					-webkit-line-clamp: 2;
					margin-bottom: .2rem;
					color: var(--text-primary-color);
				}

				& .topic_title {
					margin-bottom: .2rem;
				}

				& .content_source {
					@apply --text-cut-multi-line;
					-webkit-line-clamp: 3;
					font-size: .28rem;
				}

				& .post_content {
					@apply --text-cut-multi-line;
					-webkit-line-clamp: 4;
					margin-bottom: .2rem;
				}

				& .flow_item-images {
					margin-top: 0;

					& .image--responsive {
						padding-bottom: 0;
						text-align: center;

						& img {
							width: 100%;
							height: 2.24rem;
						}

						&:only-child {
							float: none;
							width: 100%;

							& img {
								width: 100%;
								height: 3.24rem;
							}
						}
					}
				}

				& .topic_img {
					text-align: center;
					& img {
						width: 100%;
						height: 3.24rem;
					}
				}
				& .coterie_content {
					display: flex;
					align-items: center;

					& .coterie_img {
						width: 1.24rem;
						height: 1.24rem;
					}

					& .coterie_info {
						margin-left: .2rem;
						flex: 1;

						& h3 {
							margin-bottom: .1rem;
							font-size: var(--default-font-size);
						}

						& p {
							font-size: .26rem;
							color: var(--text-assist-color);
							@apply --text-cut-multi-line;
							-webkit-line-clamp: 1;
						}
					}
				}
			}
			& .article_main {
				& .dynamic_title {
					margin-bottom: .1rem;
				}

				& .dynamic_img {
					margin-top: .2rem;
				}

				& .dynamic_video {
					margin-top: .2rem;
				}
			}
			& .dynamic_date {
				margin-top: .2rem;
				padding: 0 .3rem;
				font-size: .22rem;
				color: var(--text-tips-color);
			}
		}

		& .comment-wrap {
			margin-top: .2rem;
			background: #fff;
		}

		& .detail-action-wrap {
			margin-top: .2rem;
		}
	}
</style>