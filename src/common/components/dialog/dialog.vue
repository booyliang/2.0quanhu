/**
*	Author: wangboning
*
*/
<template>
	<y-popup v-if="opened" :options="finalOptions" @open="open" @close="close" class="dialog">
		<section class="dialog-content">
			<div class="dialog-body">
				<h1 v-if="title" class="dialog-title" v-text="title"></h1>
				<div class="dialog-message">
					<slot name="message">
						{{message}}
					</slot>
				</div>
			</div>
			<footer class="dialog-foot">
				<y-button v-if="type === 'confirm'" v-text="finalOptions.cancelText" @click.native="handleCancel"></y-button>
				<y-button v-text="finalOptions.okText" @click.native="handleOk"></y-button>
			</footer>
		</section>
	</y-popup>
</template>

<script type="text/javascript">
	import Button from '@/components/button';
	import popupMixin from '@/components/popup/mixin';

	export default {
		name: 'y-dialog',

		mixins: [popupMixin],

		components: {
			[Button.name]: Button,
		},

		props: {
			type: String,
			title: String,
			message: String,
		},

		data() {
			return {
				resolve: null,
				reject: null,
				defaultOptions: {
					blankClose: false,
					okText: this.$R("dialog-ok"),
					cancelText: this.$R("dialog-cancel"),
				}
			};
		},

		methods: {
			handleCancel() {
				this.close();

				if (this.reject) {
					this.reject();
				}
			},

			handleOk() {
				this.close();

				if (this.resolve) {
					this.resolve();
				}
			},
		},
	};
</script>

<style type="text/css">
	@import '#/css/var.css';

	.dialog {
		&.popup-enter-active,
		&.popup-leave-active {
			& .dialog-content {
				transition: inherit;
				transition-property: transform;
			}
		}
		&.popup-enter .dialog-content {
			transform: scale(1.1);
		}
	}

	.dialog-content {
		width: 6rem;
		background: white;
		border-radius: 0.2rem;
	}

	.dialog-body {
		position: relative;
		min-height: 2.56rem;
		text-align: center;
		padding-top: 0.36rem;
	}

	.dialog-foot {
		display: flex;
		border-radius: inherit;

		& .button {
			flex: 1;
			height: 2.8em;
			color: var(--text-secondary-color);
			background: var(--bg-color);
			border-radius: 0;
			font-size: .32rem;

			&:first-child {
				border-bottom-left-radius: inherit;
			}

			&:last-child {
				border-bottom-right-radius: inherit;
			}

			&:not(:first-child) {
				position: relative;

				&:before {
					content: "";
					position: absolute;
					left: 0;
					top: 0;
					bottom: 0;
					margin: auto;
					height: 0.5rem;
					border-left: 1px solid #e4e4e4;
				}
			}

			&:active {
				background: color(var(--bg-color) b(10%))
			}
		}
	}

	.dialog-title {
		font-size: .38rem;
		color: var(--secondary-color);
		/* margin-bottom: 0.35rem; */
	}

	.dialog-message {
		color: var(--text-secondary-color);
		padding: .35rem .3rem .4rem;
		&:only-child {
			@apply --full;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: .38rem;
			line-height: .5rem;
		}
	}
</style>