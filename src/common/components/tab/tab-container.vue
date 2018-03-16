/**
*	Author: zhulin
*
*/
<template>
	<div class="tab-container">
		<div ref="wrap" class="tab-container-wrap">
			<slot></slot>
		</div>
	</div>
</template>
<script>
export default {
	name: 'y-tab-container',
	

	props: {
		value: {},
		swipeable: Boolean
	},

	data() {
		return {
			currentActive: this.value
		};
	},

	watch: {
		value(val) {
			this.currentActive = val;
		},

		currentActive(val, oldValue) {
			this.$emit('input', val);
		
		}
	}

	// mounted() {
	// 	if (/(Android)/i.test(navigator.userAgent)) {
	// 		window.addEventListener('scroll', this.scrollFn);
	// 	}
	// },
	// beforeDestroy() {
	// 	window.removeEventListener("scroll", this.scrollFn, false);

	// },
	// methods: {
	// 	scrollFn() {
	// 		let tabBar = document.querySelector('.tab-bar');
	// 		let tabBarHeight = tabBar.clientHeight;
	// 		let navHeight = document.getElementById('navigator').clientHeight;
	// 		let contaniner = document.querySelector('.tab-container');
	// 		let contaninerTop = contaniner.getBoundingClientRect().top;
	// 		// alert(contaninerTop)
	// 		if (contaninerTop <= tabBarHeight + navHeight) {

	// 			tabBar.style.position = 'fixed';
	// 			tabBar.style.top = navHeight + 'px';
	// 			contaniner.style.marginTop = 0.74 + 'rem';
	// 		} else {
	// 			tabBar.style.position = 'static';
	// 			contaniner.style.marginTop = 0;

	// 		}
	// 	}
	// }
};
</script>
