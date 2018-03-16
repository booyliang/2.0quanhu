/**
*	Author: zhulin
*
*/
<template>
	<div class="tab_bar-wrap" ref="tab_bar" :class="$env.specialDeviceName + '_tab_bar'">
		<div class="tab_bar">
			<a v-for="(tabItem,index) in this.tabData" @click.stop="handleClick(tabItem)" :key="index">
				<div class="tab_bar-item" :class="{active:tabItem[idField]==tabId}">
					{{tabItem[textField]}} <span v-if="showCount">{{(tabItem[countField] > 0 ? tabItem[countField] : "") | tabBarCount}}</span>
				</div>
				
			</a>
		</div>
		<slot></slot>
	</div>
</template>
<script>
export default {
	name: 'y-tab-bar',
	props: {
		tabOption: Array,
		value: [String, Number],
		idField: { type: [String, Number], default: 'id' },
		textField: { type: String, default: 'text' },
		countField: { type: [String, Number], default: 'count' },
		routeParamName: { type: String, default: 'tab' },
		enableRouter: {
			type: Boolean,
			default: true
		},
		showCount: {
			type: Boolean,
			default: false
		},
		fixed: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			tabData: [],
			tabId: this.value,
			tabBarTop: 0
		}
	},
	mounted() {
		if (this.fixed) {
			let tabBar = this.$refs['tab_bar'];
			tabBar.style.position = 'fixed';
		} else {
			var supportsSticky = !!this.featureTest('position', 'sticky'); // 判断是否支持sticky定位
			if (!supportsSticky) {
				window.addEventListener('scroll', this.scrollFn);
				this.scrollFn();
			}
		}
		
		if (this.$route.params.tabId) {
			this.$emit('input', this.$route.params.tabId);
		}
		this.getTabData();
	},
	beforeDestroy() {
		window.removeEventListener("scroll", this.scrollFn, false);
	},
	watch: {
		tabOption() {
			this.getTabData();

		},
		value() {
			this.tabId = this.value;
		}
	},
	filters: {
		tabBarCount(count) { // 四舍五入 小数点后保留一位，如果小数点后为0只显示整数部分 如：1.0w 
			let num; 
			if (parseInt(count) > 0) {
				num = count < 10000 ? count : (count / 10000).toFixed(1) + "W";
				if (count < 10000) {
					num = count;
				} else {
					num = (count / 10000).toFixed(1) + "W";
					let numArr = (count / 10000).toFixed(1).split('.')
					if (numArr[1] === '0') {
						num =  numArr[0] + "W";
					}
				}
				
				return num;
			}
		}
	},
	methods: {
		getTabData() {
			let tabData = this.tabOption.map(tab => {
				if (typeof tab !== 'object') {
					return { id: tab, text: tab, count: tab };
				}
				return tab;
			})
			this.tabData = tabData;
			if (!this.value) {
				let tabId = this.$route.params[this.routeParamName + 'Id'] || (this.tabData.length && this.tabData[0][this.idField]);// this.routeParamName + 'Id'会有自定义id，如user里面
				tabId && this.$emit('input', tabId);  // v-model没传值默认拿第一个id
			}
		},
		handleClick(tabItem) {
			let tabId = tabItem[this.idField];
			this.tabId = tabId;
			this.$emit('input', tabId, tabItem);
			this.$emit('click', tabId, tabItem);
			if (!this.enableRouter)
				return;
			let routeParamName = this.routeParamName;
			let paths = this.$route.path.split('/');
			if (paths.length > 2 && paths[paths.length - 2] === routeParamName) {
				if (tabId)
					paths[paths.length - 1] = tabId;
				else {
					paths.splice(-2)

				}

			} else if (tabId) {
				paths.push(routeParamName);
				paths.push(tabId);
			}
			let path = paths.join('/').replace('//', '/');
			let route = { path, query: this.$route.query };
			this.$router.replace(route);

			if (tabItem[this.idField] === this.value) {
				this.$eventBus.$emit('updateTab');
			}
		},
		scrollFn() {
			this.$nextTick(() => {
				let tabBar = this.$refs['tab_bar'];

				// 如果页面未加载完毕，之后的值只可能比前次值更大，所以取 max。
				this.tabBarTop = Math.max(this.tabBarTop, tabBar.offsetTop);

				let tabBarHeight = tabBar.offsetHeight;
				let navigator = document.getElementById('navigator');
				let navHeight = navigator && navigator.clientHeight;
				let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
				if (scrollTop > this.tabBarTop - navHeight) {
					tabBar.style.position = 'fixed';
					tabBar.style.top = navHeight + 'px';

					if (!this.placeholder) {
						this.placeholder = this.insertPlaceholder(tabBar);
					}
				} else {
					if (this.placeholder) {
						this.placeholder.remove();
						delete this.placeholder;
					}
					tabBar.style.position = 'relative';
					tabBar.style.top = 0 + 'px';
				}
			});
		},
		insertPlaceholder(tabBar) {
			const placeholder = document.createElement('div');
			placeholder.style.cssText += `; height: ${tabBar.clientHeight}px`;
			tabBar.insertAdjacentElement('afterend', placeholder);
			return placeholder;
		},
		featureTest(property, value, noPrefixes) {
			var prop = property + ':',
				el = document.createElement('test'),
				mStyle = el.style;
			if (!noPrefixes) {
				mStyle.cssText = prop + ['-webkit-', '-moz-', '-ms-', '-o-', ''].join(value + ';' + prop) + value + ';';
			} else {
				mStyle.cssText = prop + value;
			}
			return mStyle[property];
		}
	}
}
</script>
<style>
@import '#/css/var.css';
.tab_bar-wrap {
	position: -webkit-sticky;
	position: sticky;
	top: 1.26rem;
	z-index: 19;
	width: 100%;
}
.iPhoneX_tab_bar {
	top: 1.5rem;
}

.tab_bar {
	height: .9rem;
	line-height: .9rem;
	text-align: center;
	/*line-height: 1;*/
	font-size: .32rem;
	color: var(--text-secondary-color);
	background-color: #fff;
	overflow-x: scroll;
	left: 0;
	right: 0;
	display: flex;
	justify-content: space-between;
	&::-webkit-scrollbar {
		display: none;
	}
}

.tab_bar a {
	flex: 1 0 auto;
	@apply --border-bottom;
	&:first-child {
		margin-left: 0.1rem;
	}
	&:last-child {
		margin-right: 0.1rem;
	}
}

.tab_bar-item {
	height: .9rem;
	/*padding-top: 15px;*/
	display: inline-block;
	white-space: nowrap;
	margin: 0 0.2rem;
	font-weight: 600;
}

.tab_bar-item.active {
	border-bottom: .04rem solid;
	border-bottom-color: var(--theme-color);
	border-bottom-left-radius: .02rem;
	border-bottom-right-radius: .02rem;
	color: var(--theme-color);
	height: .7rem;
}
</style>
