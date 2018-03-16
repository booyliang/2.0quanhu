<template>
	<y-load-more-remote :request="request" @loaded="handleLoaded">
		<ul>
			<li v-for="(item, index) of list" :key="index" v-text="item"></li>
		</ul>
	</y-load-more-remote>
</template>

<script type="text/javascript">
	import LoadMoreRemote from './';

	let list = Array(30).fill(0);

	export default {
		components: {
			[LoadMoreRemote.name]: LoadMoreRemote
		},

		data() {
			return {
				request: {
					url: '/services/app/v1/question/list/1',
				},
				list: list
			};
		},

		methods: {
			handleLoaded(list, res) {
				this.list.push(...this.list);
			}
		}
	};
</script>