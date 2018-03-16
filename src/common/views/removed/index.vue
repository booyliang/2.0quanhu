<template>
	<div class="removed-wrap">
		<y-nav :title="title"></y-nav>
		<div class="remove-content">
			<div class="removed-img"></div>
			<p>你访问的内容已被删除</p>
		</div>
	</div>
</template>

<script>
export default {
	name: 'y-removed',
	props: {
		title: {
			type: String,
			default: '圈乎'
		},
	}
	// mounted() {
	// 	var appDom = document.getElementById('app')
	// 	if (appDom) appDom.className = '';
	// 	if (this.$route.query.type === "forward") {
	// 		this.$yryz.infoRemove();
	// 	}
	// }
}
</script>

<style>
.removed-wrap {
	min-height: 100vh;
	background-color: #fff;
	& .remove-content {
		padding-top: 3rem;
		text-align: center;
		& .removed-img {
			background-image: url(../../assets/no_data@2x.png);
			background-size: cover;
			width: 3.08rem!important;
			height: 2.8rem!important;
			margin: 0 auto;
		}
		& p {
			font-size: .28rem;
			margin-top: .3rem;
			color: #666;
		}
	}
}
</style>