/**
*	Author: yefan
*
*/
<template>
	<div class="flow_detail">
		<y-card v-if="data.user" :user-id="data.user.userId" :badge="data.user.userRole === 11" :title="data.user.userNickName" :src="data.user.userImg"></y-card>
		<h2 class="flow_detail-title" v-if="data.title">{{ data.title }}</h2>
		<slot name="assist"></slot>
		<y-content-source :content-source="data.contentSource"></y-content-source>
		<p class="flow_detail-time">{{data.createDate | recentTime}}</p>
		<slot name="foot"></slot>
	</div>
</template>
<script>
	import YCard from '@/components/card'
	import YContentSource from '@/components/content-source'
	export default {
		name: 'y-flow-detail',
		components: {
			YCard,
			YContentSource
		},
		props: {
			data: {
				type: Object,
				default: () => { return {}; }
			},
			heats: {
				type: Array,
				default: () => { return []; }
			}
		}
	}
</script>
<style>
	@import '#/css/var.css';
	.flow_detail {
		padding: 0.4rem 0.3rem;
		background: #fff;
		& .content_source {
			margin-top: 0.2rem;
		}

		& .y_avatar {
			width: .5rem;
			height: .5rem;
			flex: 0 0 .5rem;
		}
		
		& .y_card--vertical {
			align-items: flex-start;
			flex-direction: row;

			& .y_avatar {
				margin:0 0.3rem 0 0;
			}
			& .y_card-text {
				text-align: left;
			}
		}

		& .flow_detail-time {
			text-align: right;
			font-size: .24rem;
			color: var(--text-tips-color);
		}
	}
	.flow_detail-title {
		margin-top: 0.2rem;
		line-height: 28px;
		font-size: .44rem;
		color: #000;
		overflow : hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
</style>
