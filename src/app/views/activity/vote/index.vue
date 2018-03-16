<template>
	<div class="activity_index_wrap">
		<div v-if="tabId === 0" class="header_bg" :class="$env.specialDeviceName + '_head_bg'"></div>
		<!--头部导航 S-->
		<y-nav :title="activityData.title" :class="transparentBG" :showLeftArrow="inApp">
			<span slot="nav-right" v-if="inApp">
				<y-button type="text" class="iconfont icon-more_line" @click.native="moreActionMixinOpen"></y-button>
			</span>
		</y-nav>
		<!--头部导航 E-->
		<y-tab-bar v-model="tabId" :tabOption="tabOption" @click="changeTab" :enable-router="false" :class="transparentBG" :fixed="true">
			<span v-if="!isRead" class="dot"></span>
		</y-tab-bar>
		<router-view :activityData="activityData"></router-view>
	</div>
</template>

<script>
import { YNav, YNavSearch, YNavToggle } from '@/components/nav';
import YTabbar from '@/components/tab';
import YButton from '@/components/button';
import moreActionMixin from '../../../mixins/more-action'

export default {
	components: {
		YNav,
		YNavToggle,
		YNavSearch,
		YButton,
		[YTabbar.name]: YTabbar,
	},
	mixins: [moreActionMixin],
	props: {
		activityData: {
			type: Object,
			default: {}
		}
	},
	data() {
		return {
			inApp: !!this.$yryz.isNative(),
			tabId: 0,
			tabOption: [
				{ id: 0, text: '首页', name: 'voteHome' },
				{ id: 1, text: '活动介绍', name: 'voteIntroduce' },
				{ id: 2, text: '投票排名', name: 'voteRank' },
				{ id: 3, text: '中奖公告', name: 'voteNotice' },
			],
			fromSelf: false,
			isRead: true,
			kids: [],
			shareData: {},
			moreActionDataModelKey: 'shareData',
			moreActionMenuList: [7, 6],
		}
	},
	watch: {
		'$route': 'selectTab',
		activityData(val) {
			if (!val) return false;
			this.kids = JSON.parse(localStorage.getItem(`kids`)) || [];
			if (val.prizesSources)
				this.isRead = !!this.kids.filter(kid => kid === this.activityData.kid).length;

			// console.log(val);
			this.shareData = {
				kid: val.kid,
				title: val.title,
				content: val.content,
				imgUrl: val.coverPlan,
			}
		}
	},
	computed: {
		transparentBG() {
			return { 'transparent_bg': this.tabId === 0, }
		}
	},
	methods: {
		changeTab(tabId, tabItem) {
			// console.log('tabItem', tabItem)
			if (tabId === 3 && !this.isRead && this.activityData.prizesSources) {
				this.kids.unshift(this.activityData.kid);
				if (this.kids.length > 100) this.kids.pop();
				localStorage.setItem(`kids`, JSON.stringify(this.kids));
				this.isRead = true;
			}
			// 自首页的跳转以push开始，其他的为replace
			let routerAction = this.fromSelf ? 'push' : 'replace';
			this.$router[routerAction]({ name: tabItem.name });
		},
		selectTab(to, from) {
			// 判断当前入口是否为首页，从首页开始的tab切换为push，非首页的为replace
			this.fromSelf = (!to || to.name === 'voteIndex');
			this.tabOption.forEach(item => {
				if (item.name === this.$route.name) {
					this.tabId = item.id;
				}
			})
		}
	},
	mounted() {
		this.selectTab();
	}
}
</script>

<style>
@import '#/css/var.css';

.activity_index_wrap {
	& .header_bg {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 2.16rem;
		background-image: url('../../../assets/plat_activity/header_bg@2x.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-position: top center;
		z-index: 9;
	}
	& .iPhoneX_head_bg {
		height: 2.4rem;
	}
	& .dot {
		@apply --circle;
		position: absolute;
		top: .16rem;
		right: .4rem;
		width: .2rem;
		height: .2rem;
		background-color: #F00;
		border: 1px solid #FFF;
		z-index: 20;
	}
	& .nav--background {
		border-bottom: none;
	}
	/* & .tab_bar-wrap {
		position: fixed; 
	} */
	& .tab_bar {
		border-bottom: 1px solid #e7e7e7;
		& a {
			border: none;
		}
	}
	& .transparent_bg {
		& .nav--background {
			background: transparent;
			color: #FFF;
			& .nav-center {
				color: #FFF;
			}
		}
		& .nav.nav--background .iconfont {
			color: #FFF;
		}
		& .tab_bar {
			background-color: transparent;
			border-bottom: none;
			& a {
				border: none;
				color: #FFF;
				font-size: .3rem;

				&:first-child {
					margin-left: 0.05rem;
				}
				&:last-child {
					margin-right: 0.05rem;
				}
			}
			& .active {
				color: #FFF;
				border-bottom-color: #FFF
			}
		}
	}
}
/* .iPhoneX {
	background: red;
  &.tab_bar-wrap {
    top: 2rem;
   
  }
  &.transparent_bg .tab_bar a {
	  color: blue;
  }
} */
</style>
