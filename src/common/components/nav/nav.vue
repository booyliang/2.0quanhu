/** * Author: zhulin * */
<template>
	<div class="navigator-wrap" :class="$env.specialDeviceName" v-if="!isSharePage">
		<div id="navigator" :class="['nav',{'nav--background':!transparent ,'nav-background-fix':backgroundFix}]">
			<span v-text="leftText" @click.stop.prevent="handleBack" :class="showLeftArrow ? 'nav-left iconfont icon-leftarrow_line':'nav-left' "></span>
			<!--添加nav-left为默认样式，为了使没有左返回键，只有文字描述的，可以正常显示在左边   wangmingqin 2017-5-27 13:45-->
			<div class="nav-center">
				<slot name="nav-center">
					<span v-text="navTitle"></span>
				</slot>
			</div>
			<div class="nav-right">
				<slot name="nav-right">
					<y-button v-if="menuData && menuData.length > 0" type="text" ref="nav_menu" class="iconfont icon-more_line"></y-button>
					<y-button @click.native="track" v-if="showMember" type="text" to="/member" class="iconfont icon-man_solid"></y-button>
					<y-button @click.native="track" v-if="showSearch" type="text" to="/search" class="iconfont icon-search_line"></y-button>
					<y-menu v-if="menuOptions" :menu="menuData" :options="menuOptions"></y-menu>
				</slot>
			</div>
		</div>

		<div class="pdTop"></div>
	</div>
</template>
<script>
import YMenu from '../menu'
let entryComponents = [];

export default {
	components: {
		YMenu
	},
	name: 'y-nav',
	props: {
		showLeftArrow: {
			type: Boolean,
			default: true
		},
		title: String,
		leftText: String,
		beforeBack: Function,
		transparent: Boolean,
		showSearch: Boolean,
		showMember: Boolean,
		menuData: Array
	},
	data() {
		return {
			backgroundFix: false,
			navTitle: this.title,
			menuOptions: null,
			backClicked: false,
		}
	},
	watch: {
		title() {
			this.navTitle = this.title;
			// this.navTitle = this.title.length > 10 ?  this.title.substring(0, 10) + '...' : this.title
		},
		// 监听menuData数据变化，当数据length为0时，隐藏相关按钮  => by yefan
		menuData(newVal) {
			if (newVal && newVal.length > 0) {
				this.menuOptions = {
					trigger: this.$refs.nav_menu,
					fixed: true
				}
			} else {
				this.menuOptions = false;
			}
		}
	},
	computed: {
		isSharePage() {
			return !this.$route.meta.disableForward && !this.$yryz.isNative() && this.$utils.NODE_ENV !== "development"
		},
		devType() { // 机型
			let devType = this.$env.devType;
			if (devType === 0) {
				return 'Andriod';
			} else if (devType === 1) {
				return 'iOS ';
			} else {
				return 'PC';
			}

		}
	},
	methods: {
		goNative() {
			if (!this.$yryz.isIOS()) {
				this.$localStore.set('goNative', true);
				this.$router.back();
			} else {
				this.$yryz.back();
			}
		},
		resetEntry() {
			entryComponents = [];
		},
		resetEntryIsEntry() {
			if (entryComponents.length === 0)
				return;
			if (entryComponents[entryComponents.length - 1] === this.$route.matched[entryComponents.length - 1].components.default)
				entryComponents = [];
		},

		// 埋点
		track() {

		},

		handleBack() {
			if (!this.showLeftArrow) return;
			// console.log(entryComponents[entryComponents.length - 1], this.$route.matched[entryComponents.length - 1])	

			if (this.beforeBack && this.beforeBack() === false) {
				return;
			}
			if (!entryComponents.length) {
				this.goNative();
			} else if (entryComponents.length === this.$route.matched.length &&
				entryComponents[entryComponents.length - 1] === this.$route.matched[entryComponents.length - 1].components.default
			) {
				this.goNative();
			} else {
				this.$nextTick(() => {
					this.$router.back();
				})

			}

		},
		changeStatusBar() {
			if (!this.$yryz.isNative()) return;
			let dark = !this.transparent;
			if (!this.$yryz.isIOS()) {
				dark = !dark;
			}
			this.$yryz.statusBar({
				dark
			});
		},

		handleScroll() {
			var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			if (scrollTop >= 50) {
				this.backgroundFix = true;
				this.navTitle = this.title || this.$circle.circleName
			} else {
				this.backgroundFix = false;
				this.navTitle = this.title
			}
		},

		setEntryEmpty() {
			entryComponents = [];
		}
	},
	mounted() {
		this.$yryz.on('nativeBack', this.handleBack);
		this.changeStatusBar();
		this.transparent && window.addEventListener('scroll', this.handleScroll);
		if (this.menuData)
			this.menuOptions = {
				trigger: this.$refs.nav_menu,
				fixed: true
			}
		this.$eventBus.$on('goBack', this.handleBack)
	},
	activated() {
		this.$yryz.on('nativeBack', this.handleBack);
		this.backClicked = false;
		this.changeStatusBar();
	},
	deactivated() {
		this.$yryz.off('nativeBack', this.handleBack);
		this.$eventBus.$off('goBack', this.handleBack);
	},
	beforeDestroy() {
		this.$yryz.off('nativeBack', this.handleBack);
		this.$eventBus.$off('goBack', this.handleBack);
		this.transparent && window.removeEventListener('scroll', this.handleScroll);
	},
	created() {
		if (!entryComponents.length && this.$route.matched.length && this.$route.matched.path !== '/empty') {
			for (let matched of this.$route.matched) {
				entryComponents.push(matched.components.default);
			}
		}
	}
}
</script>
<style>
@import '#/css/var.css';
.pdTop {
	padding-top: 1.28rem;
}

.nav {
	display: flex;
	height: 1.28rem;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	font-size: .36rem;
	color: #fff;
	z-index: 20;
	line-height: .88rem;
	padding: .4rem .2rem 0;
	& .iconfont {
		width: .6rem;
		color: #fff;

		&.button {
			width: .6rem;
		}
	}

	& .button {
		height: .88rem;
		line-height: .88rem;
		padding: 0;
		border-radius: 0;
		float: right;

		&:active {
			background: none;
		}

		&:first-child {
			margin-left: 0.2rem;
		}
	}

	& .menu-item {
		font-size: .28rem;

		& .iconfont {
			width: 0.3rem;
		}
	}

	& .icon-share {
		font-size: var(--default-font-size);
	}
}

.nav--background {
	background: #fff;
	color: var(--text-secondary-color);
	border-bottom: 1px solid #e3e3e3;
}

.nav-left,
.nav-right {
	flex: 0 0 auto;
}

.nav-left {
	text-align: left;
	font-size: var(--default-font-size);
}

.nav-right {
	text-align: right;
	min-width: .6rem;
}

.nav-center {
	@apply --text-cut;
	text-align: center;
	flex: 1;
	color: var(--text-secondary-color);
}

.nav.nav--background .iconfont {
	color: var(--text-secondary-color);
}

.nav .menu-item .iconfont {
	color: #fff;
}

.nav .nav-right--search {
	height: 0.54rem;
	line-height: 0.5rem;
	position: relative;
	border-radius: 0.3rem;
	border: .02rem solid #f4f4f4;
	background: var(--bg-color);
	position: relative;
	margin-left: -.3rem;

	& .icon-search-c {
		font-size: var(--default-font-size)!important;
		color: #bfbfbf;
		position: absolute;
		left: 0.1rem;
		top: 0.02rem;
	}

	& .nav-right--search_input {
		width: 100%;
		padding: 0 1rem 0 0.7rem;
		font-size: .28rem;
		color: var(--text-assist-color);
		position: relative;
		top: -.02rem;

		&::placeholder {
			color: var(--text-tips-color);
		}
	}

	&>span {
		width: 0.32rem;
		height: 0.32rem;
		display: block;
		text-align: center;
		line-height: 0.32rem;
		border-radius: 32rem;
		position: absolute;
		top: 0.1rem;
		right: 0.2rem;
		background: #bfbfbf;
		&.icon-close {
			font-size: 6px;
			color: #fff;
		}
	}
}

.nav-background-fix {
	background: var(--theme-color);
	&.nav--background {
		color: #fff;
	}
	& .iconfont {
		color: #fff;
	}
}

.nav .iconfont {
	display: inline-block;

	&.icon-arrow-left {
		font-size: .32rem;
	}

	&.icon-more_line {
		font-size: .4rem;
		color: var(--text-secondary-color);
	}

	&.icon-search-c {
		font-size: .36rem;
	}

	&.icon-users-o-m {
		font-size: .46rem;
		position: relative;
	}
}

.nav-right .nav-right {
	float: right;
}

.nav-left .button.button--text {
	color: var(--text-secondary-color);
	font-size: var(--default-font-size);
}

.navigator-wrap {
	&.iPhoneX {
		& .nav {
			height: 1.68rem;
			padding-top: .8rem;
		}
		& .pdTop {
			padding-top: 1.68rem;
		}
	}
}
</style>