/**
*	Author: wangboning
*/
<template>
	<component :is="tagName" v-bind="routerLinkProps" :class="classList">
		<div class="item-wrap" @click="handleClickWrap">
			<slot>
				<div class="item-head">
					<slot name="head">
						<span class="item-titles">
							<span v-if="title" class="item-title" v-text="title"></span>
							<span v-if="subtitle" class="item-subtitle" v-text="subtitle"></span>
						</span>
					</slot>
					<span v-if="vertical && finalClickable" class="iconfont icon-arrow-right item-arrow"></span>
				</div>
				<div class="item-body">
					<slot name="body"></slot>
				</div>
				<div class="item-foot">
					<slot name="foot">
						<span v-if="value" class="item-value" v-text="value"></span>
						<span v-else-if="placeholder" class="item-placeholder" v-text="placeholder"></span>
					</slot>
					<span v-if="!vertical && finalClickable" class="iconfont icon-arrow-right item-arrow"></span>
				</div>
			</slot>
		</div>
		<div class="item-addon">
			<slot name="addon"></slot>
		</div>
	</component>
</template>

<script type="text/javascript">
import routerLinkMixin from '@/mixins/router-link';

export default {
	name: 'y-item',

	mixins: [routerLinkMixin],

	props: {
		title: String,
		subtitle: String,
		placeholder: String,
		value: [
			String,
			Number,
		],
		split: Boolean,
		clickable: Boolean,
		vertical: Boolean
	},

	computed: {
		finalClickable() {
			return this.to || this.clickable;
		},

		classList() {
			return [
				'item',
				{
					'item--clickable': this.finalClickable,
					'item--split': this.split,
					'item--vertical': this.vertical
				}
			];
		},

		tagName() {
			return this.to ? 'router-link' : 'div';
		}
	},

	methods: {
		handleClickWrap() {
			this.$emit('click');
		}
	}
};
</script>

<style scoped type="text/css">
@import '#/css/var.css';

.item {
	display: block;
	min-height: 0.88rem;
	background: white;
	padding: 0 0.3rem;

	&:not(.item--clickable) {
		& .item-wrap {
			@apply --no-tap-highlight;
		}
		& .item-arrow {
			display: none;
		}
	}
}

.item-wrap {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0.2rem calc(var(--layout-space) - 0.14rem);

	@nest .item:not(:first-child) & {
			@apply --border-top;
		}
}

.item-arrow {
	color: var(--font-common-color);
}

.item-head {
	flex-shrink: 0;
	font-size: .32rem;
}

.item-subtitle,
.item-placeholder {
	color: var(--text-assist-color);
}

.item-body {
	flex: 1;
}

.item-foot {
	display: flex;
	align-items: center;
}

.item-value {
	color: var(--text-secondary-color);
}

.item-addon {
	padding: 0 calc(var(--layout-space) - 0.14rem);
}

.item--split {
	@apply --margin-bottom;

	&+.item .item-wrap {
		border-top: none;
	}
}

.item--vertical {
	& .item-wrap {
		flex-direction: column;
		align-items: stretch;
	}
	& .item-foot:not(:empty) {
		margin-left: 0;
		margin-top: 0.1rem;
	}

	&.item--clickable {
		& .item-head {
			@apply --display-flex;
			justify-content: space-between;
		}
	}
}
</style>