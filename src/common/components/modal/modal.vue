/**
*	Author: wangboning
*
*/
<template>
	<y-popup v-show="opened" :options="finalOptions" class="modal" :style="modalStyle" :class="{'is-ios': isIOS}">
		<div class="modal-content">
			<slot ref="contentSlot"></slot>
		</div>
	</y-popup>
</template>

<script type="text/javascript">
	import popupMixin from '@/components/popup/mixin';
	const ContentViewHeight = 50;
	const WindowHeight = window.screen.height;
	export default {
		name: 'y-modal',

		mixins: [
			popupMixin
		],
		props: {
			hasInput: {  // 是否有文本输入
				type: Boolean,
				default: false,
			}
		},
		data() {
			return {
				modalPaddingTop: 0,
				modalHeight: 0,
				
			}
		},
		watch: {
			opened(newVal, oldVal) {
				if (newVal && this.isIOS) {
					this.$nextTick(() => {
						let contentOffsetTop = 0;
						const bodyPositionObj = document.body.getBoundingClientRect();
						const contentPositionObj = this.getContentRect();
						if (contentPositionObj.height > WindowHeight) {
							contentOffsetTop = 40;
						} else {
							contentOffsetTop = (WindowHeight - contentPositionObj.height) / 2;
						}
						this.modalHeight = bodyPositionObj.height;
						this.modalPaddingTop = Math.abs(bodyPositionObj.top) + contentOffsetTop;
						window.addEventListener('scroll', this.handleScrool);
					})
				}
				if (!newVal && this.isIOS) {
					window.removeEventListener('scroll', this.handleScrool);
				}
			}
		},
		computed: {
			isIOS() {
				if (!this.hasInput) return false;
				if (this.$yryz.isNative()) {
					return this.$yryz.isIOS();
				}
				var u = navigator.userAgent, app = navigator.appVersion;
				return u.indexOf('iPhone') > -1 || !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) || u.indexOf('iPad') > -1;
			},
			modalStyle() {
				if (!this.isIOS) return {};
				return {
					paddingTop: this.modalPaddingTop + 'px',
					height: `${this.modalHeight}px`
				}
			},
		},
		methods: {
			getContentRect() {
				let result = {};
				let slots = this.$slots.default;
				result = slots[0].elm.getBoundingClientRect();
				return result;
			},
			handleScrool(e) {
				const { height, top } = this.getContentRect();
				const bodyPositionObj = document.body.getBoundingClientRect();
				let contentOffsetTop = Math.abs(top) - (height - ContentViewHeight);
				if (top < 0 && contentOffsetTop > 0) {
					this.modalPaddingTop = Math.abs(bodyPositionObj.top) - (height - ContentViewHeight);
				}
				if (top > WindowHeight) {
					this.modalPaddingTop = Math.abs(bodyPositionObj.top) + WindowHeight - ContentViewHeight;
				}
			}
		}
	};
</script>

<style type="text/css">
	@import '#/css/var.css';

	.modal.is-ios {
		display: block;
		position: absolute;
		& .modal-content {
			margin: 0 auto;
		}
		& .mask {
			position: fixed; 
		}
	}

	.modal-content {
		@apply --scrolling;
		max-width: 90%;
		max-height: 90%;
		width: 6rem;
		background: white;
		border-radius: .2rem;
	}

	.popup-enter-active,
	.popup-leave-active {
		&.modal {
			transition-timing-function: ease-in-out;
		}
		& .modal-content {
			transition: inherit;
			transition-property: transform;
		}
	}
	.popup-enter,
	.popup-leave-to {
		& .modal-content {
			transform: translate(0, 0.2rem);
		}
	}
</style>