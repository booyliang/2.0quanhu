<template>
	<y-load-more :state="state" @can-load="onCanLoad">
		<ul>
			<li v-for="(item, index) of list" :key="index" v-text="item"></li>
		</ul>
		<div slot="aa">aaaaaaaaaaaaaaa</div>
	</y-load-more>
</template>

<script type="text/javascript">
	import LoadMore from '@/components/load-more';

	export default {
		components: {
			[LoadMore.name]: LoadMore
		},

		data() {
			return {
				all: Object.keys([...Array(100)]),
				pageNo: 1,
				pageSize: 40,
				list: [],
				state: undefined
			};
		},

		methods: {
			onCanLoad() {
				this.load();
			},

			load() {
				this.state = 'loading';
				let startIndex = (this.pageNo - 1) * this.pageSize;
				let newItems = this.all.slice(startIndex, startIndex + this.pageSize);

				setTimeout(() => {
					this.list.push(...newItems);

					if (newItems.length < this.pageSize) {
						this.state = 'end';
					} else {
						this.pageNo++;
						this.state = 'prepared';
					}
				}, 1000);
			},
		},

		created() {
			this.load();
		}
	};
</script>