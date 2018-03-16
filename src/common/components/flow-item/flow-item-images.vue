/**
*	Author: wangboning
*
*/
<template>
	<ul class="flow_item-images">
		<li v-for="(item, index) of data" :key="index" class="image--responsive">
			<img :src="item | imageResize(data.length > 1 ? 2 : 3)" alt="">
		</li>
	</ul>
</template>


<script type="text/javascript">
import ImageResize from '@/filters/imageResize'
export default {
	name: 'y-flow-item-images',

	props: {
		data: {
			type: Array,
			required: true
		}
	}
};
</script>

<style type="text/css">
@import "#/css/var.css";

.flow_item-images {
	margin-top: 0.3rem;
}

.flow_item-images {
	@apply --clearfix;

	&>.image--responsive {
		float: left;
		width: 32.2%;
		padding-bottom: 32.2%;

		&:nth-child(n+2) {
			margin-left: 1.7%;
		}
		&:only-child {
			float: none;
			width: 100%;
			padding-bottom: 56.25%;
		}
	}
}
</style>