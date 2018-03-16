<template>
	<div class="demo-avatar-wrap">
		<div class="demo-item">
			<y-avatar></y-avatar>
		</div>
		<div class="demo-item">
			<y-avatar :badge="true"></y-avatar>
		</div>
		<div class="demo-item">
			<y-avatar :badge="true" :type="2"></y-avatar>
		</div>
	</div>
</template>
<script>
	import YAvatar from '@/components/avatar'
	export default {
		components: {
			YAvatar
		}
	}
</script>
<style>
	.demo-avatar-wrap {
		display: flex;
		justify-content: space-around;
		& .demo-item {
			width: 1.2rem;
		}
	}
</style>
