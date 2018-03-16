/**
*	Author: aiqingmin
*
*/
<template>
  <div>
	<a class="down_btn" v-if="showDownload" :href="dowloadUrl">
		<img src="/assets/static/quanhu_download@2x.jpg" />
	</a>
	<div v-if="isSharePage" @click="openInApp" class="open_in_app">从APP内打开</div>
	<div v-if="showMask && isSharePage" class="open_app_fail_tips">
		<div class="tips_main"></div>
	</div>
  </div>
</template>
<script type="text/javascript">
	import AppConfig from '@/config/app'
	import nativeSchema from '@/js/tool-native-schema'
	export default {
		name: 'y-control-forward',
		data() {
			return {
				isSharePage: false,
				showDownload: false,
				showMask: false
			};
		},
		props: {},
		computed: {
			dowloadUrl() {
				return AppConfig.DOWNLOAD_APP_URL;
			}
		},
		methods: {
			openInApp() {
				const { schema } = this.$route.meta;
				let path = '';
				if (schema) {
					let allParams = Object.assign({}, this.$route.params);
					path = schema.replace(/(\:\w+)/g, (m) => allParams[m.substr(1)] )
				}
				nativeSchema.loadSchema({
					schema: path,
					failFunction: () => {
						this.showMask = true;
					},
				});
			},
			// fillForwardHtml() {
			// 	let parentDiv = document.getElementById('forward-body-wrap');

			// 	var _bodyHtml = "";
			// 	parentDiv.innerHTML = '';
			// 	let targets = document.getElementsByClassName('flow_detail');

			// 	if (targets && targets.length > 0) {
			// 		let target =  targets[0];
			// 		let html = [];
			// 		let endHtml = [];
			// 		let parentElement = target.parentElement;
			// 		while (parentElement && parentElement.id !== 'app') {
			// 			html.unshift('<div class=' + parentElement.className + '>');
			// 			parentElement = parentElement.parentElement;
			// 			endHtml.push('</div>')
			// 		}
			// 		for (let i = 0; i < targets.length; i++) {
			// 			html.push(targets[i].outerHTML);
			// 		}
			// 		_bodyHtml = html.join('') + endHtml.join('')

			// 	}
			// 	parentDiv.innerHTML = _bodyHtml;
			// 	let linkList = document.querySelectorAll('#forward-body-wrap a');
			// 	for (let link of linkList) {
			// 		link.removeAttribute('href');
			// 	}

			// },
			// observerBody() {
			// 	let targets = document.getElementsByClassName('flow_detail');
			// 	if (targets && targets.length > 0) {
			// 		// 传入目标节点和观察选项
			// 		let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
			// 		let target = targets[0];
			// 		let observer = new MutationObserver(this.fillForwardHtml);
			// 		let config = { attributes: true, childList: true, characterData: true, subtree: true };
			// 		observer.observe(target, config); // DOM 加载完后触发callback fillForwardHtml
			// 		// 本地未监听到DOM变化时
			// 		this.fillForwardHtml();
			// 		return;
			// 	}
			// 	// flow-body 未加载
			// 	setTimeout(function () {
			// 		this.observerBody();
			// 	}.bind(this), 10)
			// }
		},
		mounted() {
			if (this.$route.meta.disableForward) 
				return;
			if (this.$utils.NODE_ENV !== "development" && !this.$yryz.isNative()) {
				this.showDownload = true;
				this.isSharePage = true;
				document.getElementById('app').className = 'hideBtn yryz-download';
				let title 
				if (document.getElementsByClassName('nav-center')[0]) {
					title =  document.getElementsByClassName('nav-center')[0].children[0].innerText;
				} else {
					title = '圈子有了，一切都有了！';
				}
				document.title = '圈乎-' + title;
			}
			// if (this.$route.query.type === 'forward') {
			// 	document.getElementById('app').className = 'yryz-forward';
			// 	var parentDiv = document.createElement('div');
			// 	parentDiv.id = "forward-body-wrap";
			// 	document.body.appendChild(parentDiv);
			// 	this.observerBody();
			// }
			// else if (this.$route.query.type === 'transfer' && this.$route.query.userId) {
			// 	// 打赏之后的转发
			// 	document.getElementById('app').className = 'transfer';
			// 	this.showDownload = !this.$yryz.isNative();
			// 	// this.showDownload =true;
			// 	let entityId = parseInt(this.$route.query.transferId);
			// 	let userId = this.$route.query.userId;

			// 	this.$openApi.post('/api/v3/transfer/getTransferDetail', {id: entityId,	userId})
			// 	.then(res => {
			// 		this.transferData = res.data.data;
			// 	});
			// }
			
		}

	};
</script>
<style>
	@import '#/css/var.css';
	.down_btn {
		display: block;
		position: fixed;
		font-size: 0;
		top: 0;
		left: 0;
		z-index: 999;
		width: 100%;
		height: .71rem;
		overflow: hidden;
		background: #f8f8f8;
		box-shadow: 1px 0 10px #a7a7a7;
		& img {
			max-height: 100%;
		}
	}
	.open_in_app {
		display: block;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 999;
		width: 100%;
		background: var(--theme-color);
		text-align: center;
		font-size: 0.3rem;
		color: #fff;
		line-height: .73rem;
		box-shadow: 0px -2px 10px #a7a7a7;
	}
	.open_app_fail_tips{
		position: fixed;
		left: 0;
		top: 0;
		width: 100vw;
		height: 100vh;
		z-index: 9999;
		background: rgba(0,0,0,.8);
		& .tips_main {
			position: absolute;
			right: 30px;
			top: .1rem;
			width: 5.82rem;
			height: 2.52rem;
			background: url(./open_app_fail_tips.png) 100% 0 no-repeat;
			background-size: cover;
		}
	}
	.yryz-download{
		padding-top: .71rem;
		& .tab_bar-wrap{
			top: .71rem;
		}
	}
</style>
