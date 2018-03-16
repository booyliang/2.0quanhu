<template>
	<div class="demo">
	<y-slider :options="options">
		<div class="slide">1</div>
		<div class="slide">2</div>
		<div class="slide">3</div>
	</y-slider>
	</div>
</template>

<script type="text/javascript">
	import Slider from './';

	export default {
		components: {
			[Slider.name]: Slider
		},

		data() {
			return {
				options: {
					autoplay: 2000
				}
			};
		}
	};
</script>

<style type="text/css" >
.demo{
	& .slide {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 200px;
		color: white;
		background: deepskyblue;
	}
}

</style>