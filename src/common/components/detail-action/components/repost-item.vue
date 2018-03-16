<template>
	<div class="action-list-item action-repost-item">
		<y-card v-if="data.user" :src="data.user.userImg" :user-id="data.user.userId" :title="data.user.userNickName" :assist="data.createDate | recentTime" :badge="data.user.userRole === 11"></y-card>
		<p class="item-content">{{data.content}}</p>
		<div class="action-list_item-line"></div>
	</div>
</template>
<script>
	import YCard from '@/components/card'
	export default {
		name: "y-repost-item",
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
	.action-list-item{
		background: #fff;
		position: relative;
		& .y_card {
			padding: .2rem .3rem 0;
			& .y_card-title{
				font-size: .28rem;
				color:#666;
			}
		}
		& .item-content{
			margin: .22rem .2rem .22rem 1.18rem;
			color: #000;
			font-size: .3rem;
			line-height: .46rem;
		}
		& .action-list_item-line{
		    position: relative;
			height: 0;
			margin: 0 0 0 1.18rem;
			border-bottom: 1px solid #eee;
		}
	}
</style>