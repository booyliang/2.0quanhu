<template>
	<div>
		<y-check type="checkbox" name="checkbox" v-model="checkboxChecked">Checkbox</y-check>
		<y-check type="checkbox" name="checkbox" v-model="disabledCheckboxChecked" disabled>Disabled Checkbox</y-check>
		<y-check type="radio" name="radio" v-model="radioChecked">Radio</y-check>
	</div>
</template>

<script type="text/javascript">
	import Check from './';

	export default {
		components: {
			[Check.name]: Check
		},

		data() {
			return {
				checkboxChecked: false,
				disabledCheckboxChecked: true,
				radioChecked: false,
			};
		}
	};
</script>