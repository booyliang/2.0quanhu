<!-- Author: Boring -->

<template>
	<section :class="classList">
		<div v-if="icon" class="message-icon" :style="iconStyle"></div>
		<h1 class="message-title" v-text="title"></h1>
		<slot></slot>
	</section>
</template>

<script type="text/javascript">
	export default {
		name: 'y-message',

		props: {
			icon: String,
			title: String,
			fullscreen: {
				type: Boolean,
				default: false
			}
		},

		computed: {
			classList() {
				return [
					'message',
					{
						'message--fullscreen': this.fullscreen
					}
				];
			},

			iconStyle() {
				return {
					backgroundImage: `url(${this.icon})`
				};
			}
		}
	};
</script>

<style type="text/css">
	@import "#/css/var.css";

	.message {
		@apply --layout;
		text-align: center;
		padding-top: 1.2rem;
		padding-bottom: 0.6rem;
		color: var(--text-assist-color);
	}
	.message-icon {
		width: 3.08rem;
		height: 2.8rem;
		background: no-repeat;
		background-size: contain;
		margin: 0 auto 0.4rem;
	}
	.message-title {
		font-size: .28rem;
		& + * {
			margin-top: 0.4rem;
		}
	}

	.message--fullscreen {
		padding-top: 2.5rem;
		padding-bottom: 2.5rem;

		& .message-icon {
			margin-bottom: 0.6rem;
		}
		& .message-title {
			font-size: .32rem;
		}
	}
</style>