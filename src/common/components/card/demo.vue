<template>
	<div class="demo-card-wrap">
		<y-card title="标题" @click-img="handleClickImg" img-size="large" assist="辅助文本" position="horizontal"></y-card>
		<y-card title="标题" assist="辅助文本"></y-card>
	</div>
</template>
<script>
import YCard from '@/components/card'
export default {
	components: {
		YCard
	},
	methods: {
		handleClickImg(data) {
			alert(data);
		}
	}
}
</script>