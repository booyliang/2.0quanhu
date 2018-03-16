<template>
	<div class="expand-box">
		<div class="expand-text" ref="textNode" :style="textStyle">
			<slot></slot>
		</div>
		<div class="expand-btn" @click="handleExpand" v-if="showMoreBtn">
			<span :class="IconClassList"></span> {{buttonText}}
		</div>
	</div>
</template>
<script>

export default {
	name: "y-expand-text",
	props: {
		lineNum: {
			type: Number,
			default: 2,
			required: true,
			validator: function (value) {
				return value >= 0;
			}
		},
		btnIcons: {
			type: Array,
			default() {
				return ['icon-arrow-u', 'icon-arrow-d'];
			}
		},
		btnText: {
			type: Array,
			default() {
				return ['展开', '收起'];
			}
		}
	},
	data() {
		return {
			showMoreBtn: false,
			showMoreContent: false,
			clamp: this.lineNum,
			boxHeight: 0
		}
	},
	mounted() {
		this.$nextTick(() => {
			this.expendBtnSet();
		})
	},
	computed: {
		IconClassList() {
			return ['iconfont', this.showMoreContent ? this.btnIcons[0] : this.btnIcons[1]];
		},
		buttonText() {
			return this.showMoreContent ? this.btnText[1] : this.btnText[0];
		},
		textStyle() {
			if (this.clamp)
				return {'-webkit-line-clamp': this.clamp}
		},
	},
	methods: {
		expendBtnSet() {
			this.showMoreBtn = this.hasClap();
		},
		hasClap() { 
			let textNode = this.$refs.textNode;
			if (!textNode)
				return false;
			console.log( textNode.getBoundingClientRect().height, textNode.scrollHeight )
			return textNode.getBoundingClientRect().height < textNode.scrollHeight;	
		},
		handleExpand() {
			this.showMoreContent = !this.showMoreContent;
			this.clamp = this.showMoreContent ? 0 : this.lineNum;
		}
	}
}
</script>
<style>
	@import '#/css/var.css';
	
	.expand-box{
		display: flex;
		flex-direction: column;
		& .expand-text {
			@apply --text-cut-multi-line;
		}
		& .expand-btn {
			align-self: center;
			padding-top: .15rem;
		}
	}
</style>
