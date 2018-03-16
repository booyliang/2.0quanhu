/**
*	Author: yefan
*
*/
<template>
	<div class="y_card" :class="{'y_card--vertical': this.position === 'vertical'}">
		<y-avatar v-bind="props" @click-avatar="handleClickUser" :class="imgClassName"></y-avatar>
		<div class="y_card-text" @click.stop.prevent="handleClickUser">
			<div class="y_card-title" v-if="title">
				<span v-text="title"></span><slot name="sign"></slot>
			</div>
			<slot name="assist">
				<p class="y_card-assist" v-text="assist" v-if="assist"></p>
			</slot>
			<!--修改人：胡亮  修改原因：话题详情头像区域需要扩展“讨论”和“浏览”-->
			<slot></slot>
		</div>
	</div>
</template>
<script>
import YAvatar from '@/components/avatar'
export default {
	name: 'y-card',
	components: {
		YAvatar
	},
	props: {
		...YAvatar.props,
		title: String,
		assist: String,
		position: {
			type: String,
			default: 'horizontal'
		},
		userId: {
			type: [String, Number]
		},
		anonymity: {
			type: Number
		}
	},
	computed: {
		'props'() {
			var result = {};
			for (var key in this.$options.props) {
				result[key] = this[key];
			}
			return Object.assign({}, result);
		},
		'imgClassName'() {
			let result = 'y_card-img';
			result = this.imgSize ? result + '__' + this.imgSize : result;
			return result;
		}
	},
	methods: {
		handleClickUser() {
			if (!this.userId) return;
			if (this.anonymity === 10 && this.userId !== this.$env.userId ) return
			this.$yryz.router({link: `quanhu://open/user/home?userId=${this.userId}`})
		}
	}
}
</script>
<style>
@import '#/css/var.css';
.y_card {
	display: flex;
	align-items: center;
	& .y_avatar {
		width: 0.68rem;
		flex: 0 0 0.68rem;
		height: 0.68rem;
		margin-right: .2rem;
		&.y_card-img__large {
			width: 1.2rem;
			height: 1.2rem;
			flex: 0 0 1.2rem;
		}
	}
}

.y_card-text {
	flex: 0 0 auto;
}

.y_card-title {
	line-height: 1;
	font-size: .3rem;
	color: var(--active-color);
	&:not(:last-child) {
		margin-bottom: 0.03rem;
	}

	& .sign {
		margin-left: .2rem;
		font-size: .28rem;
		color: var(--text-tips-color);
	}
}

.y_card-assist {
	font-size: .24rem;
	color: var(--text-tips-color);
}

.y_card--vertical {
	flex-direction: column;
	& .y_avatar {
		margin: 0 auto 0.1rem;
	}
	& .y_card-text {
		text-align: center;
		line-height: var(--default-line-height);
	}
}
</style>
