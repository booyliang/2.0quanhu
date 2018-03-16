<template>
	<div class="demo">
		<y-button @click.native="open">Open</y-button>
	</div>
</template>

<script type="text/javascript">
	import Button from '@/components/button';

	export default {
		components: {
			[Button.name]: Button,
		},

		methods: {
			open() {
				this.$actionsheet([
					{
						text: 'Hello',

						handler: () => {
							this.$toast('Hi.');
						}
					},
					{
						text: 'Shit',

						handler: () => {
							this.$toast('Damn!');
						}
					},
				]);
			}
		}
	};
</script>