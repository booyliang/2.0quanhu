<template>
	<div class="demo ">
		<y-button block @click.native="alert">Alert</y-button>
		<y-button block @click.native="customAlert">Custom Alert</y-button>
		<y-button block @click.native="confirm">Confirm</y-button>
		<y-button block @click.native="customConfirm">Custom Confirm</y-button>
	</div>
</template>

<script type="text/javascript">
	import Dialog from '@/components/dialog';
	import Button from '@/components/button';

	export default {
		components: {
			[Button.name]: Button,
		},

		methods: {
			alert() {
				Dialog.alert('I am an alert.')
				.then(() => {
					console.log('Alert closed.');
				});
			},

			customAlert() {
				Dialog.alert({
					title: 'Title',
					message: 'I am message.',
				}, {
					okText: 'OK'
				});
			},

			confirm() {
				Dialog.confirm('I am a confirm.')
				.then(() => {
					console.log('Confirm OK.');
				})
				.catch(() => {
					console.log('Confirm canceled.');
				});
			},

			customConfirm() {
				Dialog.confirm({
					title: 'Title',
					message: 'I am message.',
				}, {
					okText: 'OK',
					cancelText: 'Cancel'
				});
			},
		}
	};
</script>

<style type="text/css" >
	@import "#/css/var.css";
.demo {
	& .button {
		@apply --margin-bottom;
	}
}
</style>