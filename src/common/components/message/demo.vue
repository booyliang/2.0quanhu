<template>
	<div>
		<y-message :icon="icon" title="This is a sad message."></y-message>
		<y-message :icon="icon" title="This is a sad fullscreen message." fullscreen></y-message>
		<y-message :icon="icon" title="This is a sad fullscreen message." fullscreen>
			<y-button block>Click Me</y-button>
		</y-message>
	</div>
</template>

<script type="text/javascript">
	import Button from '@/components/button';
	import Message from './';

	import icon from '@/assets/no_data@2x.png';

	export default {
		components: {
			[Button.name]: Button,
			[Message.name]: Message,
		},

		data() {
			return {
				icon
			};
		}
	};
</script>