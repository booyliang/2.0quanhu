<!-- Author: Boring -->

<template>
	<div :class="classList">
		<slot></slot>
		<div v-if="!(state === 'end' && !endTip)" class="load_more-tip" v-text="states[state].text"></div>
	</div>
</template>

<script type="text/javascript">
import EdgeDetector from '@/utils/edge-detector';

export default {
	name: 'y-load-more',

	props: {
		offset: {
			type: Number,
			default: 0
		},
		state: {
			type: String,
			default: 'prepared'
		},
		endTip: {
			type: Boolean,
			default: true
		}
	},

	data() {
		return {
			edgeDetector: null,
			states: {
				'prepared': {
					text: this.$R('loading'), // 正在加载…
				},
				'loading': {
					text: this.$R('loading'), // 正在加载…
				},
				'end': {
					text: this.$R('no-more-content') // 没有更多了
				}
			}
		};
	},

	computed: {
		classList() {
			return [
				'load_more',
				`load_more--${this.state}`
			];
		},

		locked() {
			return [
				'loading',
				'end',
			].includes(this.state);
		}
	},

	watch: {
		locked(newValue) {
			if (newValue) {
				this.edgeDetector.lock();
			} else {
				this.edgeDetector.unlock();
			}
		}
	},

	methods: {
		onBottom() {
			this.$emit('can-load');
		},
	},

	mounted() {
		this.edgeDetector = new EdgeDetector({
			target: this.$slots.default[0].elm,
			offset: this.offset,
			callback: this.onBottom
		});
	},
	beforeDestroy() {
		this.edgeDetector && this.edgeDetector.unlistenScroll();
	}
};
</script>

<style type="text/css">
@import '#/css/var.css';

.load_more-tip {
	font-size: .24rem;
	text-align: center;
	color: var(--text-assist-color);
	padding: 0.5rem 0;
}

.load_more--end {
	& .load_more-tip {
		/* &:--before-after {
			content: "";
			display: inline-block;
			vertical-align: middle;
			width: 1.5rem;
			height: 1px;
			background: linear-gradient(to right, transparent, #f0f0f0);
		}
		&::before {
			margin-right: 0.8em;
		}
		&::after {
			margin-left: 0.8em;
			transform: rotate(0.5turn);
		} */
	}
}
</style>