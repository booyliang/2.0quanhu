<template>
	<div class="input-demo-wrap">
		<y-input v-model="text1" :show-text-length-info="false" :maxlength="30"></y-input>
		<br>
		<y-input v-model="text1" :maxlength="30"></y-input>
		<br>
		<y-input v-model="text2" type="textarea" :maxlength="100"></y-input>
		<br>
		<y-input v-model="text3" size="large" type="textarea" :maxlength="500"></y-input>
	</div>
</template>
<script>
	import YInput from '@/components/input'
	export default {
		components: {
			YInput
		},
		data() {
			return {
				text1: 'text input',
				text2: 'textarea',
				text3: 'textarea large'
			}
		}
	}
</script>