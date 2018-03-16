<template>
	<div class="coterie-index">
		<y-nav class="nav-demo-c" title="私圈首页"></y-nav>
		<header class="header-wrapper" v-if="coterieInfo">
			<div class="header-cover" >
				<div class="header-cover_bg">
					<div class="filter-brightness" :style = "headerCoverBg"></div>
				</div>
				<div class="header-cover_content">
					<img :src="coterieInfo.icon" class="header-thumb" @click="showAlbum" alt="">
					<div class="header-title">{{coterieInfo.name}}</div>
					<div class="btn-pill">{{coterieInfo.memberNum}}人加入</div>
					<div class="coterie-owner" >圈主: {{coterieInfo.ownerName}}</div>
					<y-card :src="coterieInfo.user && coterieInfo.user.headImg ? coterieInfo.user.headImg : coterieInfo.custIcon" :badge=true></y-card>
				</div>
			</div>
			<div class="coterie_info">
				<h3>私圈简介：</h3>
				<y-expand-text v-if="coterieInfo.intro" :lineNum=3 :btnIcons="['icon-double_up_line', 'icon-double_down_line']">
					{{coterieInfo.intro}}
				</y-expand-text>
			</div>
		</header>
		<div class="coterie-dynamic">
			<y-load-more-remote :request="coterieDynamicListRequest" @loaded="handleLoaded"　@empty="empty" :endTip="endTip">
				<div　class="coterie-dynamic-list">
					<y-coterie-dynamic-item  v-for="(item, index) of list" :key="index" :data = "item"></y-coterie-dynamic-item>
				</div>
			</y-load-more-remote>
			<y-message v-if="list.length === 0 && isLoaded" :icon="noDataIcon" title="请稍后，圈主正在准备精彩内容~"></y-message>
		</div>
		

	</div>
</template>
<script>
	import noDataIcon from '@/assets/no_data@2x.png';
	import Button from '@/components/button';
	import album from '@/components/album'
	import YCard from '@/components/card';
	import Mask from '@/components/mask';
	import YExpandText from '@/components/expand-text'
	import YLoadMoreRemote from '@/components/load-more-remote'
	import YMessage from '@/components/message';
	import CoterieDynamicItem from './coterie-dynamic-item';
	
	export default {
		name: 'coterie',
		components: {
			[Button.name]: Button,
			YCard,
			[Mask.name]: Mask,
			[YExpandText.name]: YExpandText,
			[YLoadMoreRemote.name]: YLoadMoreRemote,
			[YMessage.name]: YMessage,
			[CoterieDynamicItem.name]: CoterieDynamicItem,
		
		},
		data() {
			return {
				noDataIcon,
				coterieInfo: null,
				endTip: true,
				isLoaded: false,
				list: [], // 动态列表
				bgSrc: '',
				coterieDynamicListRequest: {
					url: '/services/app/v2/resource/coterieRecommend',
					params: {
						currentPage: 1,
						pageSize: 10, 
						coterieId: this.$route.params.coterieId,
					}	
				}
			}
		},
		mounted() {
			
		},
		created() {
			this.getInit();
		},
		computed: {
			headerCoverBg: function () {
				return {
					'-webkit-background': 'url(' + this.bgSrc + ') no-repeat top -10px center / cover',
					background: 'url(' + this.bgSrc + ') no-repeat top -10px center / cover'
				}
			},
		},
		methods: {
			async getInit() {
				let res = await this.$http.get(`/services/app/v2/coterieInfo/single?coterieId=${this.$route.params.coterieId}`)
				if (res.data.code === "200") {
					this.coterieInfo = res.data.data || {};
					this.bgSrc = res.data.data.icon;
				}
			},
			showAlbum() {
				// 头像预览icon
				album.init([this.coterieInfo.icon]);
				album.show();
			},
			empty() {
				this.isLoaded = true;
				this.endTip = false;
			},
			handleLoaded(list, item) {
				this.list.push(...list);
			},
		}

	}
</script>
<style>
	@import '#/css/var.css';
	.coterie-index{
		min-height: 100vh;
		background: #f7f7f7;
		& .header-wrapper {
			background-color: white;
			margin-bottom: .2rem;
		}
		& .header-cover {
			position: relative;
			padding: var(--layout-space);
			min-height: 2.2rem;
			height: 2.2rem;
			color: #fff;
			& .header-cover_bg {
				position: absolute;
				height: 100%;
				width: 100%;
				top: 0;
				left: 0;
				z-index: 0;
				overflow: hidden;
			}
			& .filter-brightness {
				position: absolute;
				height: 100%;
   				width: 100%;
				/* filter: url("https://12.miiditest.com/img/TaskDetails/blur.svg#blur"); */
				filter: blur(1px) brightness(.7);
				transform: scale(2);
				
			}
			& .header-cover_content{
				position: absolute;
				z-index: 1;
				width: 100%;
				height: 100%;
				top: 0;
				left: 0;
				padding: 0.2rem .3rem;
				& .y_card{
					position: absolute;
					bottom: -.45rem;
					right: .3rem;
				& .y_avatar{
					width: 0.9rem;
					height: 0.9rem;
					min-width: 0.9rem;
					min-height: 0.9rem;
					flex: 0 0 0.9rem;
					margin-right: 0.15rem;
					& .y_avatar-badge {
						width: 0.32rem;
						height: 0.32rem;
					}
				}
			}
				& .header-thumb {
					float: left;
					margin-right: var(--layout-space);
					background-color: var(--bg-color);
					display: flex;
					width: 1.6rem;
					height: 1.6rem;
				}
				& .header-title {
					@apply --text-cut;
					margin-bottom: .13rem;
					font-size: .38rem;
					line-height: 1.2;
					color: #fff;
				}
				& .btn-pill{
					display: inline-block;
					margin-bottom: .12rem;
					color: #000;
					background: #ECD500;
					font-size: .26rem;
					padding: .05rem .2rem;
					border-radius: 20px;


				}
				& .coterie-owner{
					font-size: .28rem;
				}
				& .header-assist {
					color: var(--text-assist-color);
					font-size: .26rem;
				}
			}
			
		}
		& .coterie_info{
			padding: .3rem;
			& h3 {
				font-size: .26rem;
				font-weight: 700;
				color: #000;
				margin-bottom: .2rem;
			}
			& .expand-box{
				font-size: .26rem;
				color: #666;
				line-height: .4rem;
				& .expand-btn span{
					font-size: .1rem;
				}
			}
		}
		& .message{
			background: #fff;
		}
	}

</style>