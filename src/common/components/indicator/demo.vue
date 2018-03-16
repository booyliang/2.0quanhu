<template>
	<div class="indicator_demo">
		<y-button @click.native="open">打开</y-button>
	</div>
</template>
<script>
	import Indicator from '@/components/indicator'
	export default {
		components: {
			Indicator
		},
		methods: {
			open() {
				Indicator.open();
			}
		}
	}
</script>
