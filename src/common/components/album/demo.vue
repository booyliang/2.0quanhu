<template>
	<div class="album-demo-wrap">
		<y-button @click.native="showAlbum">调用</y-button>
	</div>
</template>
<script>
	import YButton from '@/components/button'
	import album from '@/components/album'
	export default {
		components: {
			YButton
		},
		methods: {
			showAlbum() {
				album.show();
			}
		},
		mounted() {
			album.init(['https://cdn.yryz.com/pic/mcq/6de916e70aa4fdb7f80502783a158694.jpg', 'https://cdn.yryz.com/pic/mcq/d2b511c9b48b0fe4c0baf4cd3f74cbff.jpg']);
		},
		beforeDestroy() {
			album.hide();
		}
	}
</script>

