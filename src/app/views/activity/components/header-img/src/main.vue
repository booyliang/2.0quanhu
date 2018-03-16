<template>
	<div class="fm_header_wrap">
		<div class="activity-cover">
			<img :src="coverPlan | imageResize(5)" @click="picturePreview">
		</div>
		<!--活动未开始 或 活动进行中-->
		<div class="activity-date">
			<div class="activity-count-down" v-if="status !== 13">
				<span class="head-icon">
					<span class="iconfont icon-clock_line"></span>
					<span v-text="showTipText"></span>
				</span>
				<slot></slot>
			</div>
			<!--活动进行中 活动已结束-->
			<div class="activity-ended" v-else>
				<span class="iconfont icon-clock_line"></span>
				<span>活动已结束</span>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: 'fm-header',
	components: {
	},
	props: {
		status: {
			type: [String, Number],
			default: 12
		},
		coverPlan: {
			type: String,
		}
	},
	data() {
		return {
			inApp: !!this.$yryz.isNative(),
		}
	},
	computed: {
		showTipText() {
			return this.status === 12 ? `距离活动结束还有` : `距离活动开始还有`;
		},
	},
	methods: {
		picturePreview() {
			if (!this.inApp) return;
			let imgs = [this.coverPlan]
			this.$yryz.picturePreview({
				imageUrls: imgs,
				currentIndex: 1
			})
		},
	}
}
</script>
<style>
@import '#/css/var.css';
.fm_header_wrap {
	position: relative;
	& .activity-cover {
		height: 3.36rem;
		overflow: hidden;
		&>img {
			display: block;
			width: 100%;
			height: 100%;
		}
	}
	& .activity-date {
		position: absolute;
		bottom: 0;
		width: 100%;
		color: #fff;
		background: var(--bg-alpha-color);
		padding: .15rem;
		& .activity-count-down {
			display: flex;
			justify-content: space-between;
		}
		& .activity-ended {
			text-align: center;			
		}
		& .iconfont {
				font-size: .3rem;
			}
	}
}
</style>


