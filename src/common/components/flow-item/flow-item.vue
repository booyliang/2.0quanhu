/**
*	Author: wangboning
*
*/
<template>
	<y-item :class="classList" :to="link">
		flow-item
	</y-item>
</template>

<script type="text/javascript">
	import Item from '@/components/item';
	import CardUser from '@/components/card-user';
	import Video from '@/components/video';
	import FlowItemImages from './flow-item-images';
	import ImageResize from '@/filters/imageResize'

	export default {
		name: 'y-flow-item',

		components: {
			[Item.name]: Item,
			[CardUser.name]: CardUser,
			[Video.name]: Video,
			[FlowItemImages.name]: FlowItemImages,
		},

		props: {
			data: {
				type: Object,
				required: true
			},
			horizontal: Boolean,
			heat: {
				type: Array,
				default() {
					return [
						'comment',
						'like',
					];
				}
			},
			remove: {
				type: Array,
				default() {
					return [];
				}
			}
		},

		computed: {
			link() {
				let {
						moduleEnum,
					id
					} = this.data;
				return `/redirect/${moduleEnum}/${id}`;
			},

			images() {
				let urls = this.data.imgUrl;
				return urls ? urls.split(',').slice(0, 3) : null;
			},

			classList() {
				return [
					'flow_item',
					{
						'unshelved': this.data.shelveFlag === 1
					}
				];
			},

			content() {
				return this.data.description || this.data.content;
			},

			mediaLevel() {
				if (this.data.coverPlanUrl) {
					return 'cover';
				}

				if (this.data.videoUrl) {
					return 'video';
				}

				if (this.data.audioUrl) {
					return 'audio';
				}

				if (this.data.imgUrl) {
					return 'image';
				}
			},

			hasTitle() {
				return !!this.data.title;
			}
		}
	};
</script>