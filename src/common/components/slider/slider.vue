/**
*	Author: wangboning
*
*/
<template>
	<div class="swiper-container" ref="container">
		<div class="swiper-wrapper" @click="handleClick">
			<slot></slot>
		</div>
		<div class="swiper-pagination"></div>
	</div>
</template>

<script type="text/javascript">
	import Swiper from 'swiper';

	let defaultOptions = {
		pagination: '.swiper-pagination',
		speed: 500,
		autoplayDisableOnInteraction: false,
		simulateTouch: false,
		observer: true
	};

	export default {
		name: 'y-slider',

		props: {
			options: Object
		},

		data() {
			return {
				swiper: null
			};
		},

		computed: {
			finalOptions() {
				return Object.assign({}, defaultOptions, this.options);
			},
		},

		methods: {
			handleClick(e) {
				// fix swiper create duplicated slides not fire click event
				if (this.swiper && this.swiper.activeIndex !== this.swiper.realIndex) {					
					this.$slots.default[this.swiper.realIndex].elm.click()				
				}
				
			},
			init() {
				let slides = this.$slots['default'];

				if (!slides) {
					return;
				}

				let modifierOptions = null;

				if (slides.length <= 1) {
					modifierOptions = {
						allowSwipeToNext: false,
						allowSwipeToPrev: false,
						pagination: null,
						loop: false
					};
				}

				[...slides].forEach((vnode) => {
					let element = vnode.elm;

					if (element.nodeType === 1) {
						element.classList.add('swiper-slide');
					}
				});

				if (this.inited) {
					return;
				}

				this.swiper = new Swiper(this.$refs.container, Object.assign({}, this.finalOptions, modifierOptions));
				this.inited = true;
			},

			getInstance() {
				return this.swiper;
			}
		},

		mounted() {
			this.init();
		},

		updated() {
			this.init();
		},
		beforeDestroy() {
			this.swiper && this.swiper.destroy();
		},
	};
</script>

<style type="text/css">
	@import '#/css/var.css';
	@import 'swiper/dist/css/swiper.min.css';

	.swiper-container-horizontal > .swiper-pagination-bullets {
		line-height: 0;
		bottom: 0.1rem;

		& .swiper-pagination-bullet {
			margin: 0 0.08rem;
		}
	}

	.swiper-pagination-bullet {
		width: 8px;
		height: 8px;
		background: white;
		opacity: 0.5;

		&.swiper-pagination-bullet-active {
			background: white;
			opacity: 1;
		}
	}
</style>