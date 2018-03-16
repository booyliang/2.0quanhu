<template>
	<div class="share_page_panel">
		<div class="share_page_panel-cover">
			<slot name="cover"></slot>
		</div>
		<div class="share_page_panel-body">
			<slot></slot>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'share-page-panel',
		props: {
			coverUrl: String,

		}
	}
</script>
<style>
	.share_page_panel {
		background: #fff;
		min-height: 12rem;
	}
	.share_page_panel-cover {
		height: 4rem;
		overflow: hidden;
		& img {
			width: 100%;
		}
	}
	.share_page_panel-body {
		position: relative;
		z-index: 2;
		width: 6.8rem;
		margin: -.95rem auto 0;
		padding: 0 .4rem;
		background-color: #fff;
		border-top-left-radius: .25rem;
		border-top-right-radius: .25rem;
		overflow: hidden;
	}
</style>