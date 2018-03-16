<template>
	<div class="action-list-item action-like-item">
		<y-card v-if="data.user" :src="data.user.userImg" :user-id="data.user.userId" :title="data.user.userNickName" :badge="data.user.userRole === 11"></y-card>
		<div class="action-list_item-line"></div>
	</div>
</template>
<script>
	import YCard from '@/components/card'
	export default {
		name: "y-like-item",
		components: {
			YCard, 
		},
		props: {
			data: {
				type: Object
			}
		}
	}
</script>
<style>
	@import "#/css/var.css";
	.action-list-item.action-like-item{
		& .action-list_item-line{
			margin-top:.1rem;
		}
	}
</style>