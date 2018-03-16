<template>
	<div class="demo">
		<y-button>button</y-button>
		<y-button tag="span">button (custom tag)</y-button>
		<y-button disabled>button (disabled)</y-button>
		<y-button block>button (block)</y-button>
		<y-button type="ghost">ghost button</y-button>
		<y-button type="ghost" situation="error">ghost button (error)</y-button>
		<y-button situation="reverse">button (reverse operation)</y-button>
		<y-button type="text">text button</y-button>
		<y-button size="s">button (small)</y-button>
		<y-button size="l">button (large)</y-button>
		<y-button to="/">button with link</y-button>
		<y-button loading="true">loading-button</y-button>
	</div>
</template>

<script type="text/javascript">
	import Button from './button';

	export default {
		components: {
			[Button.name]: Button
		}
	};
</script>

<style type="text/css" >
	@import "#/css/var.css";
.demo {
	.button {
		@apply --margin-bottom;
	}
}
</style>