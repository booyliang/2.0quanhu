<!-- Author: Boring -->

<template>
	<label class="check">
		<input v-bind="{name, type, disabled}" :checked="value" @change="handleChange" class="check-control">
		<span :class="iconClassList"></span><slot></slot>
	</label>
</template>

<script type="text/javascript">
	export default {
		name: 'y-check',

		props: {
			type: {
				type: String,
				required: true
			},
			name: String,
			value: {
				type: Boolean,
				default: false
			},
			disabled: {
				type: Boolean,
				default: false
			}
		},

		computed: {
			iconClassList() {
				return [
					'check-icon',
					'iconfont',
					{
						'icon-check-box': !this.value,
						'icon-sele_solid': !!this.value,
					}
				];
			}
		},

		methods: {
			handleChange(e) {
				this.$emit('input', e.target.checked);
			}
		}
	};
</script>

<style type="text/css">
	@import "#/css/var.css";

	.check {
		font-size: .26rem;
		color: var(--text-assist-color);

		& a {
			color: var(--theme-color);
		}
	}
	.check-control {
		position: absolute;
		left: -9999px;
		opacity: 0;

		&:disabled ~ .check-icon {
			color: #d7d7d7;
		}
	}
	.check-icon {
		color: var(--theme-color);
		margin-right: 0.5em;
	}
</style>