/**
*	Author: wangboning
*
*/
<template>
	<component :is="tagName" v-bind="routerLinkProps" :disabled="disabled" :class="classList">
		<slot></slot>
		<span class="iconfont icon-star-circle" v-if="loading"></span>
	</component>
</template>

<script type="text/javascript">
import routerLinkMixin from '@/mixins/router-link';

export default {
	name: 'y-button',

	mixins: [routerLinkMixin],

	props: {
		tag: {
			type: String,
			default: 'button'
		},
		block: Boolean,
		type: String,
		size: String,
		situation: String,
		disabled: Boolean,
		loading: {
			type: Boolean,
			default: false
		}
	},

	computed: {
		tagName() {
			return this.to ? 'router-link' : this.tag;
		},

		classList() {
			return [
				'button',
				{
					'button--block': this.block,
					'disabled': this.disabled,
					[`button--${this.type}`]: this.type,
					[`button--${this.size}`]: this.size,
					[`button--${this.situation}`]: this.situation,
					'button--loading': this.loading,
				}
			];
		}
	},
};
</script>

<style type="text/css">
@import "#/css/var.css";

.button {
	@apply --no-tap-highlight;
	display: inline-block;
	vertical-align: middle;
	font-size: .3rem;
	line-height: var(--default-line-height);
	text-align: center;
	color: white;
	padding: 0.45em 1em;
	border: 1px solid transparent;
	background: var(--theme-color);
	border-radius: 0.4em;
	transition: 0.15s;
	user-select: none;

	&.button--error {
		background: var(--error-color);
	}

	&:active {
		background: var(--active-color);
		transition: none;
	}

	&:--disabled {
		background: var(--disabled-color);
		pointer-events: none;
	}
}

.button--s {
	font-size: .24rem;
}

.button--l {
	font-size: .34rem;
}

.button--ghost {
	color: var(--theme-color);
	border-color: currentColor;
	background: none;

	&.button--error {
		color: var(--error-color);
		background: none;
	}

	&:active {
		background: #f4f4f4;
	}
}

.button--text {
	color: var(--theme-color);
	background: none;

	&:active {
		background: #f4f4f4;
	}

	&:--disabled {
		background: none;
	}
}

.button--reverse {
	color: var(--text-secondary-color);
	background: #e5e5e5;

	&:active {
		background: color(#e5e5e5 b(+10%));
	}
}

.button--block {
	display: block;
	width: 100%;
	max-width: 5.2rem;
	margin: auto;
}
.button--loading span.iconfont{
	display: inline-block;
	animation: run 2s linear infinite;
	transform-origin:50% 50%;
}
@keyframes run{
	0%{
		transform: rotateZ(0deg);
	}
	100%{
		transform: rotateZ(360deg);
	}
}
   


</style>