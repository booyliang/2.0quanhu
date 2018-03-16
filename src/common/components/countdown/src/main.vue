/**
*	Author: yefan
*
*/
<template>
	<span class="countdown">{{ currentTime }}</span>
</template>
<script>
	export default {
		name: 'y-countdown',
		props: {
			value: Number,
			start: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				currentTime: 0,
				timer: null
			}
		},
		watch: {
			value(newVal) {
				this.currentTime = newVal;
			},
			currentTime(newVal) {
				if (newVal !== this.value) {
					this.$emit('input', newVal)
				}
			},
			start(newVal, oldVal) {
				if (newVal === true && oldVal === false && this.currentTime > 0) {
					this.timing();
				}
				if (newVal === false && oldVal === true) {
					this.stop();
				}
			}
		},
		methods: {
			timing() {
				if (this.currentTime <= 0) return;
				this.timer = setInterval(() => {
					if (this.currentTime > 0) {
						this.currentTime--;
					} else {
						this.stop();
						this.$emit('finish')
					}
				}, 1000)
			},
			stop() {
				clearInterval(this.timer);
				this.timer = null;
			}
		},
		mounted() {
			this.currentTime = this.value || 0;
			if (this.start) {
				this.timing();
			}
		}
	}
</script>
