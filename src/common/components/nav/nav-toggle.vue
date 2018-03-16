/**
*	Author: zhulin
*
*/
<template>
  <div class="nav-right" id="nav-right">
	<i :class="['iconfont icon-more']"></i>
	  <!--<y-menu v-if="menu" :menu="menu" fixed handle="#nav-right"></y-menu>-->
  </div>
</template>

<script>
	import YMenu from '../menu'
	export default{
		components: {YMenu},
		name: 'y-nav-toggle',
		props: {
			menu: Array
		}
	}
</script>
