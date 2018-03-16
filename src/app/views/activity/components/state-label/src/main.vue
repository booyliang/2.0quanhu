<template>
	<div class="label-wrap">
		<span class="label-status" v-text="sort" :style="bgStyle"></span>
		<span class="triangle triangle_down" :style="{'border-top': borderStyle}"></span>
	</div>
</template>

<script>
export default {
	name: 'state-label',
	components: {

	},
	props: {
		sort: {
			type: Number,
			required: true,
			default: 1,
		}
	},
	data() {
		return {
			label: '',
			textColor: '',
			bgColor: '',
			borderColor: '',
		}
	},

	computed: {
		borderStyle() {
			return `.1rem solid ${this.borderColor}`;
		},
		bgStyle() {
			return {
				'color': this.textColor,
				'background-color': this.bgColor
			};
		}
	},
	mounted() {
		if (this.sort === 1) {
			this.textColor = '#FFF';
			this.bgColor = '#FB4545';
			this.borderColor = '#A51E1E'
		} else {
			this.textColor = '#8D640D';
			this.bgColor = '#FFE455';
			this.borderColor = '#BC8E13'
		}
	}
}
</script>

<style>
.label-wrap {
	position: absolute;
	top: .5rem;
	left: .2rem;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	& .label-status {
		width: .9rem;
		height: .4rem;
		line-height: .4rem;
		text-align: center;
		border-top-right-radius: .1rem;
		border-bottom-right-radius: .1rem;
		color: #fff;
	}
	& .triangle {
		width: .1rem;
		border-left: .1rem solid transparent;
	}
}
</style>

