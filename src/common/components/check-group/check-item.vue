/**
*	Author: aiqingmin
*
*/
<template>
	<div class="check_item" :class="[{'iconAfter': iconAfterText}, {'checked': data.checked}, {'disabled': data.disabled}]">
		<i :class="[' iconfont ','icon-check-b']"></i>
		<div class="check_item-content">
			<slot>
				<span>{{data.text}}</span>
			</slot>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'y-check-item',
		props: {
			iconAfterText: {
				default: false,
				type: Boolean
			},
			type: {
				type: String,
				required: true
			},
			data: Object,

		},
		mounted() {
			// console.log('YCheckItem', this)
		}

	}
</script>