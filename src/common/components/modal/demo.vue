<template>
	<div>
		<y-button id="trigger">Open by `trigger`</y-button>
		<y-button @click.native="open">Open Manually</y-button>
		<y-modal :options="options" ref="modal">
			<div style="width: 5rem; height: 5rem;"></div>
		</y-modal>
	</div>
</template>

<script type="text/javascript">
import Modal from './';

export default {
	components: {
		[Modal.name]: Modal
	},

	data() {
		return {
			options: {
				trigger: '#trigger'
			}
		};
	},

	methods: {
		open() {
			this.$refs['modal'].open();
		}
	}
};
</script>