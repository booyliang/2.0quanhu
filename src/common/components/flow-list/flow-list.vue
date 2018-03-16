/**
*	Author: wangboning
*
*/
<template>
	<y-load-more-remote v-bind="{request, endTip, maxPage, useOpenApi}" @loaded="handleLoaded" @empty="$emit('empty')">
		<y-list class="flow_list">
			<component :is="getItemComponent(item.moduleEnum)" v-for="(item, index) of list" :key="index" v-bind="{heat}" :data="item"></component>
		</y-list>
	</y-load-more-remote>
</template>

<script type="text/javascript">
import LoadMoreRemote from '@/components/load-more-remote';
import List from '@/components/list';
import FlowItem from '@/components/flow-item';

export default {
	name: 'y-flow-list',

	components: {
		[LoadMoreRemote.name]: LoadMoreRemote,
		[List.name]: List,
		[FlowItem.name]: FlowItem,
	},

	props: {
		request: [Object, Function],
		heat: Array,
		item: Object,
		defaultModuleEnum: String,
		showLoadMore: true,
		endTip: {
			type: Boolean,
			default: true
		},
		maxPage: {
			type: Number,
			default: Infinity
		},
		useOpenApi: Boolean,
	},

	data() {
		return {
			list: [],
		};
	},
	watch: {
		request: {
			deep: true,
			handler() {
				// console.log('request', this.request)
				this.list = [];
			}
		}
	},
	methods: {
		handleLoaded(list, res) {
			this.$emit('loaded', list);
			this.list.push(...list);

			if (!this.list.length)
				this.$emit('empty')

		},

		getItemComponent(moduleEnum) {
			if (this.item) {
				return this.item;
			}
			moduleEnum = moduleEnum || this.defaultModuleEnum;
			if (!moduleEnum) {
				console.error('`moduleEnum` doesn\'t exist in response. Will render default FlowItem.');
				return FlowItem;
			}

			let module = this.$utils.getModule(moduleEnum);

			if (!module) {
				console.error(`Config for module ${moduleEnum} not found. will render default FlowItem.`);
				return FlowItem;
			}

			return module.listItem || FlowItem;
		}
	}
};
</script>