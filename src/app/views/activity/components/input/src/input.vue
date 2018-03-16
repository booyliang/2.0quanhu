/**
*	Author: yefan
*
*/
<template>
	<div class="y-input-wrap" :class="[type === 'textarea' ? 'y-textarea' : 'y-input', size ? 'y-input__' + size : '']">
		<textarea ref="input" @input="validTextLength" v-if="type == 'textarea'" v-model="text" v-bind="props" @blur="$emit('blur')" @focus="$emit('focus')"></textarea>
		<input ref="input" v-else v-model="text" v-bind="props" @blur="$emit('blur')" @focus="$emit('focus')">
		<div class="text-length-info" v-if="maxlength && (type == 'textarea' || type == 'text') && showTextLengthInfo">
			<span class="current-text-length">{{ text.length }}</span>
			<span class="text-max-length">/{{ maxlength }}</span>
		</div>
		<div class="y-input__append" v-if="$slots.append">
			<slot name="append"></slot>
		</div>
	</div>
</template>
<script>
export default {
	name: 'y-input',
	props: {
		value: {
			type: [String, Number],
			default: ''
		},
		showTextLengthInfo: {
			type: Boolean,
			default: true
		},
		placeholder: String,
		size: String,
		readonly: Boolean,
		autofocus: Boolean,
		disabled: Boolean,
		type: {
			type: String,
			default: 'text'
		},
		name: String,
		autosize: {
			type: [Boolean, Object],
			default: false
		},
		maxlength: Number,
		minlength: Number,
		max: {},
		min: {},
	},
	data() {
		return {
			text: '',
			textareaLength: 0
		}
	},
	methods: {
		validTextLength() {
			// this.text = this.text.replace(/\s/g, "&nbsp;");
			// console.log(this.text);
			if (this.text.length > this.maxlength) {
				this.text = this.text.substring(0, this.maxlength);
			}
		}
	},
	computed: {
		'props': function () {
			var result = {};
			for (var key in this.$options.props) {
				if (!(this.type === 'textarea' && (key === 'maxlength' || key === 'minlength'))) {
					result[key] = this[key];
				}
			}
			return result;
		}
	},
	watch: {
		'text': function (newVal, oldVal) {
			if (newVal === oldVal || newVal === this.value) return false;
			this.$emit('input', newVal);
		},
		'value': function (newVal, oldVal) {
			if (newVal === oldVal) return false;
			this.text = this.value;
		}
	},
	mounted() {
		this.text = this.value;
		// 原生输入框offset问题，先注掉
		if (this.autofocus) {
			this.$refs.input.focus();
		}
	}
}
</script>
<style scoped>
@import '#/css/var.css';
.y-input-wrap {
	width: 100%;
	display: flex;
	background: #fff;
	& input,
	& textarea {
		flex: 1 1 100%;
		width: 100%;
		padding: 0.2rem 0;
		font-size: .32rem; 
		min-height: 0;
		&::placeholder {
			color: var(--text-assist-light);
		}
	}
	& input {
		text-align: right;
	}
	& .text-length-info {
		flex: 1 0 auto;
		display: flex;
		align-items: center;
		padding-right: 0.3rem;
		color: var(--text-assist-light);
		font-size: .26rem;
		& .current-text-length {
			color: var(--text-assist-color);
		}
	}
	&.y-textarea {
		flex-flow: column;
		& textarea {
			min-height: .8rem;
			resize: none;
			font-size: .32rem;
		}
		& .text-length-info {
			justify-content: flex-end;
		}
	}
	&.y-input__large {
		& textarea {
			min-height: 6rem;
		}
	}
	& .y-input__append {
		display: flex;
		align-items: cneter;
		flex: 0 0 auto;	
	}
}
</style>