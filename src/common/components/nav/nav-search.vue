/**
*	Author: zhulin
*
*/
<template>
	<div class="nav-right--search">
		<i :class="['iconfont icon-search-c']" @click.stop="handleSearch"></i>
		<input id="search" class="nav-right--search_input" v-model="inputValue" type="text" :placeholder="placeholder || $R('search-placeholder')" maxlength="30">
		<span v-if="inputValue" @click="clear" class="iconfont icon-close-circle"></span>
	</div>
</template>
<script>
export default {
	name: 'y-nav-search',
	props: {

		'value': { type: String, default: '' },
		'icon': { type: String, default: '' },
		'placeholder': { type: String },

	},
	data() {
		return {
			inputValue: this.value,
			clearIcon: false
		}
	},
	methods: {
		handleSearch() {
			this.$router.push({ path: '/search' })
		},
		clear() {
			this.inputValue = '';
		},
		// 跳转至搜索页
		handlerSearch() {
			this.$router.push({ path: '/search' })
		},
	},
	watch: {
		inputValue(newVal) {
			if (newVal !== this.value) {
				this.$emit('input', newVal);
			}
		},
		value(newVal) {
			if (newVal !== this.inputValue) {
				this.inputValue = newVal;
			}
		}
	},
}
</script>

<style>
	.nav.nav--background .icon-close-circle {
		color:#bfbfbf;
		background: #fff;
	}
</style>