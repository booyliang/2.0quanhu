/** * Author: yefan * */
<template>
	<div class="audio-wrap">
		<slot name="icon"></slot>
		<div class="audio" @click.stop="playAudio">
			<div class="lds-spinner" v-if="isLoading">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
			<div class="audio-icon" v-else :class="audioIcon"></div>
			<span class="audio-time">{{ parseInt(time/1000) }}''</span>
		</div>
	</div>
</template>
<script>
	export default {
		props: {
			src: String,
			time: [String, Number],
			play: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				step: 0,
				animationTimer: null,
				clearTimer: null,
				audio: null,
				isLoading: false
			}
		},
		computed: {
			'audioIcon': function () {
				if (this.step === 0) {
					return [''];
				} else {
					return [`animation${this.step}`]
				}
			}
		},
		methods: {
			pageVisibilityChanged() {
				if (this.audio) {
					this.stopAudio();
					this.clearAudio();
				}
			},
			handlePlay() {
				this.isLoading = false;
				this.step = 1;
				this.animationTimer = setInterval(() => {
					if (this.step === 4) {
						this.step = 1
					} else {
						this.step++;
					}
				}, 350);
			},
			handleEnded() {
				this.stopAudio();
			},
			playAudio() {
				if (!this.play) return false;
				if (this.animationTimer) {
					this.stopAudio();
					return false;
				}
				if (this.audio) {
					this.audio.pause();
					this.audio.removeEventListener('canplaythrough', this.handlePlay);
					this.audio.removeEventListener('ended', this.handleEnded);
				}
				this.audio = new Audio();
				this.audio.src = this.src;
				this.audio.addEventListener('canplaythrough', this.handlePlay);
				this.audio.addEventListener('ended', this.handleEnded);
				this.audio.play();
				this.isLoading = true;
			},
			stopAudio() {
				if (!this.audio) return false;
				this.audio.pause();
				clearInterval(this.animationTimer);
				this.step = 0;
				this.animationTimer = null;
			},
			clearAudio() {
				if (!this.audio) return false;
				this.audio.pause();
				this.audio = null;
			}
		},
		deactivated() {
			this.stopAudio();
		},
		mounted() {
			window.addEventListener("visibilitychange", this.pageVisibilityChanged);
		},
		beforeDestroy() {
			this.clearAudio();
			window.removeEventListener("visibilitychange", this.pageVisibilityChanged);
		}
	}
</script>
<style>
	@import '#/css/var.css';
	.audio-wrap {
		display: flex;
		align-items: center;
		& .audio {
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 3.9rem;
			height: 0.8rem;
			padding: 0 0.34rem;
			background: color(var(--theme-color) alpha(.08));
			border-radius: 25% / 125%;
			&:hover {
				background: color(var(--theme-color) alpha(.18));
			}
			& .audio-time {
				color: var(--theme-color);
			}
			& .audio-icon {
				position: relative;
				margin-left: -0.1rem;
				width: .32rem;
				height: .5rem;
				border: 2.5px solid var(--theme-color);
				border-radius: 50%;
				border-color: transparent var(--theme-color) transparent transparent;
				&:before,
				&:after {
					content: '';
					position: absolute;
					top: 50%;
					border: 2.5px solid var(--theme-color);
					transform: translateY(-50%);
					border-color: transparent var(--theme-color) transparent transparent;
				}
				&:before {
					width: 120%;
					height: 86%;
					border-radius: 50%;
					transform: translate(-.09rem, -50%);
				}
				&:after {
					width: .07rem;
					height: .07rem;
					border: none;
					border-radius: 100%;
					background: var(--theme-color);
				}
				&.animation1 {
					opacity: 0;
				}
				&.animation2 {
					&:before,
					& {
						border-right-color: transparent;
					}
				}
				&.animation3 {
					border-right-color: transparent;
				}
			}
		}
	}

	@keyframes lds-spinner {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}

	.lds-spinner {
		position: relative;
	}

	.lds-spinner div {
		left: 1.18rem;
		top: .96rem;
		position: absolute;
		animation: lds-spinner linear 1s infinite;
		background: #0185ff;
		width: .24rem;
		height: .48rem;
		border-radius: 40%;
		transform-origin: .12rem 1.04rem;
	}

	.lds-spinner div:nth-child(1) {
		transform: rotate(0deg);
		animation-delay: -0.916666666666667s;
	}

	.lds-spinner div:nth-child(2) {
		transform: rotate(30deg);
		animation-delay: -0.833333333333333s;
	}

	.lds-spinner div:nth-child(3) {
		transform: rotate(60deg);
		animation-delay: -0.75s;
	}

	.lds-spinner div:nth-child(4) {
		transform: rotate(90deg);
		animation-delay: -0.666666666666667s;
	}

	.lds-spinner div:nth-child(5) {
		transform: rotate(120deg);
		animation-delay: -0.583333333333333s;
	}

	.lds-spinner div:nth-child(6) {
		transform: rotate(150deg);
		animation-delay: -0.5s;
	}

	.lds-spinner div:nth-child(7) {
		transform: rotate(180deg);
		animation-delay: -0.416666666666667s;
	}

	.lds-spinner div:nth-child(8) {
		transform: rotate(210deg);
		animation-delay: -0.333333333333333s;
	}

	.lds-spinner div:nth-child(9) {
		transform: rotate(240deg);
		animation-delay: -0.25s;
	}

	.lds-spinner div:nth-child(10) {
		transform: rotate(270deg);
		animation-delay: -0.166666666666667s;
	}

	.lds-spinner div:nth-child(11) {
		transform: rotate(300deg);
		animation-delay: -0.083333333333333s;
	}

	.lds-spinner div:nth-child(12) {
		transform: rotate(330deg);
		animation-delay: 0s;
	}

	.lds-spinner {
		width: .84rem !important;
		height: .84rem !important;
		transform: translate(-50%, -50%) scale(0.21) translate(50%, 50%);
	}
</style>