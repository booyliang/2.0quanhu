<template>
	<div>
		<y-flow-list :request="request"></y-flow-list>
	</div>
</template>

<script type="text/javascript">
	import FlowList from '@/components/flow-list';

	export default {
		components: {
			[FlowList.name]: FlowList
		},

		data() {
			return {
				request: {
					url: '/services/app/v1/topic/list',
				},
			};
		}
	};
</script>