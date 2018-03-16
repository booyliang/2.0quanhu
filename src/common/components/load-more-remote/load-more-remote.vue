<!-- Author: Boring -->

<template>
	<y-load-more v-bind="{endTip}" v-if="finalRequest && finalRequest.url" :state="state" :offset="1000" @can-load="handleCanLoad" :class="classList">
		<slot></slot>
	</y-load-more>
</template>

<script type="text/javascript">
import LoadMore from '@/components/load-more';

export default {
	name: 'y-load-more-remote',

	components: {
		[LoadMore.name]: LoadMore
	},

	props: {
		request: {
			type: [Object, Function],
			required: true
		},
		maxPage: {
			type: Number,
			default: Infinity
		},
		endTip: {
			type: Boolean,
			default: true
		},
	},
	data() {
		return {
			state: undefined,
			currentPage: this.request.params && this.request.params.currentPage || 1,
			pageSize: this.request.params && this.request.params.pageSize || 10,
			empty: false,

		}
	},
	watch: {
		request: {
			deep: true,
			handler() {
				this.currentPage = 1;
				this.reload()


			}
		}
	},
	computed: {
		finalRequest() {
			if (typeof this.request === 'function') {
				return this.request(this.currentPage);
			} else {
				let request = Object.assign({}, this.request);
				if (!request.url) return null;
				let params = Object.assign({}, request.params);
				let currentPage = this.currentPage;
				let pageSize = this.pageSize;

				request.url += `?currentPage=${currentPage}&pageSize=${pageSize}`;

				delete params.currentPage;
				delete params.pageSize;

				return Object.assign(request, {
					params
				});
			}
		},

		classList() {
			return {
				'empty': this.empty
			};
		}
	},

	methods: {
		handleCanLoad() {
			this.load();

		},
		reload() {
			this.showLoadMore = false;
			this.requestTime = null;
			this.$nextTick(() => {
				this.showLoadMore = true;
				this.load();
			})
		},
		async load() {
			this.empty = false;
			let finalRequest = this.finalRequest;
			if (!finalRequest || !finalRequest.url) return;
			// 防止改变request后，仍然往list里添加数据
			let requestTime = this.requestTime = new Date().getTime()
			this.state = 'loading';
			let res = null;
			res = await this.$http(finalRequest);
			if (res.data.code !== '200') {
				console.error(res.data.errorMsg);
				return
			}
			if (this.requestTime !== requestTime) return;
			let list = (res.data.data && res.data.data.entities) || [];
			let listLength = list.length;

			if (listLength) {
				this.$emit('loaded', list, res);

				// 不足一页的数量
				if (listLength < this.pageSize) {
					this.state = 'end';
				} else {
					if (this.currentPage >= this.maxPage) {
						this.state = 'end';
					} else {
						this.currentPage++;
						this.state = 'prepared';
					}
				}
			} else {
				this.state = 'end';

				// 第一页无数据
				if (parseInt(this.currentPage) === 1) {
					this.empty = true;
					this.$emit('empty')
				}
			}
		}
	},

	mounted() {
		this.load();
	}
};
</script>