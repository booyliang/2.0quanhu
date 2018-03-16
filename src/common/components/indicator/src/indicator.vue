<template>
	<y-popup v-if="opened" :options="finalOptions" class="y_indicator">
		<div class="y_indicator-wrapper">
			<div class="y_indicator-icon">
				<div></div>
			</div>
			<span class="y_indicator-text">{{ message || $R("loading") }}</span>
		</div>
	</y-popup>
</template>
<script>
	import popupMixin from '@/components/popup/mixin';
	export default {
		name: 'y-loading',
		mixins: [popupMixin],
		props: {
			message: {
				type: String
			},
			
		},
		data() {
			return {
				opened: false,
				defaultOptions: {
					transparentMask: true,
					autoClose: false,
					blankClose: false
				}
			};
		},
	}
</script>

<style>
	@import '#/css/var.css';

    .y_indicator-wrapper {
        @apply --bg-alpha;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 2.6rem;
		height: 1.9rem;
		border-radius: .1rem;
    }
	.y_indicator-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: .8rem;
		height: .8rem;
		transform: translate(-100px, -100px) scale(1) translate(100px, 100px);
	}
	.y_indicator-text {
		margin-top: .2rem;
		line-height: 1;
		font-size: .32rem;
	}
	@keyframes lds-dual-ring {
		0% {
			transform: rotate(0);
		}
		100% {
			transform: rotate(360deg);
		}
	}
	.y_indicator-icon div {
		width: 80%;
		height: 80%;
		border-radius: 50%;
		border: .05rem solid #000;
		border-color: #ffffff transparent #ffffff transparent;
		animation: lds-dual-ring 1s linear infinite;
	}
</style>