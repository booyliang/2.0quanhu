<!-- Author: Boring -->

<template>
	<y-popup v-if="opened" :options="finalOptions" class="actionsheet">
		<div class="actionsheet-content">
			<div class="actionsheet-list">
				<y-button v-for="(action, index) of actions" :key="index" class="actionsheet-item actionsheet-action" @click.native="doAction(action.handler)">{{action.text}}</y-button>
			</div>
			<div class="actionsheet-list">
				<y-button class="actionsheet-item actionsheet-cancel" @click.native="close">取 消</y-button>
			</div>
		</div>
	</y-popup>
</template>

<script type="text/javascript">
	import Button from '@/components/button';
	import popupMixin from '@/components/popup/mixin';

	export default {
		name: 'y-actionsheet',

		mixins: [
			popupMixin
		],

		components: {
			[Button.name]: Button,
		},

		props: {
			actions: {
				type: Array,
				required: true
			}
		},

		methods: {
			doAction(handler) {
				handler();
				this.close();
			}
		},
	};
</script>

<style type="text/css">
	@import '#/css/var.css';

	.actionsheet {
		align-items: flex-end;

		&.popup-enter-active,
		&.popup-leave-active {
			visibility: visible;
			transition: 0.3s;

			& .mask,
			& .actionsheet-content {
				transition: inherit;
			}
		}
		&.popup-enter,
		&.popup-leave-active {
			visibility: hidden;
			opacity: 1;

			& .mask {
				opacity: 0;
			}
			& .actionsheet-content {
				transform: translate(0, 100%);
			}
		}
	}
	.actionsheet-content {
		@apply --layout;
		flex: auto;
		padding-bottom: 0.2rem;
	}
	.actionsheet-list {
		border-radius: 0.5em;
		overflow: hidden;
		background: #fff;

		&:nth-child(n+2) {
			margin-top: 0.1rem;
		}
	}
	.button {
		&.actionsheet-item {
			width: 100%;
			font-size: 0.32rem;
			color: var(--theme-color);
			padding-top: 0.8em;
			padding-bottom: 0.8em;
			background: white;
			border-radius: 0;

			&:nth-child(n+2) {
				@apply --border-top;
			}
			&:active {
				background: white;
				opacity: 0.8;
			}
		}
		&.actionsheet-cancel {
			color: var(--text-secondary-color);
		}
	}
</style>