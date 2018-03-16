<template>
	<y-nav :beforeBack="backHandle" ref="nav"></y-nav>
</template>
<script>
	export default {
		methods: {
			backHandle() {
				this.$yryz.back();
			}
		},
		mounted() {
			this.$refs.nav.setEntryEmpty();
			let goNative = this.$localStore.get('goNative');
			if (goNative) {
				this.$localStore.remove('goNative');
				this.$yryz.back();
			}
		}
	}
</script>
