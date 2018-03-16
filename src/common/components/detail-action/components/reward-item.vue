<template>
	<div class="action-list-item action-reward-item">
		<y-card v-if="data.user" :src="data.user.userImg" :user-id="data.createUserId" :title="data.user.userNickName" :assist="data.createDate | recentTime" :badge="data.user.userRole === 11"></y-card>
		<img class="gift-img" :src="data.giftImage" alt="gift">	
		<div class="action-list_item-line"></div>
	</div>
</template>
<script>
	import YCard from '@/components/card'
	export default {
		name: "y-reward-item",
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
	.action-list-item.action-reward-item {
		position: relative;
		& .y_card {
			padding: .2rem .3rem;
		}
		& .gift-img{
			position: absolute;
			top: .2rem;
			right: .3rem;
			width:1rem;
			height:.7rem
		}
	}

</style>