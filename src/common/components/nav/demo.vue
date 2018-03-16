<template>
	<div class="demo nav-demo">

		<!-- 导航有背景 有标题 左箭头 右更多 S-->
		<y-nav title="demo" :showSearch="true" :showMember="true">

		</y-nav>

		<!-- 导航有背景 有标题 左箭头 右搜索&更多 S-->
		<!-- class="nav-demo-a" 此样式只在此demo用 -->
		<y-nav class="nav-demo-a">
			<span slot="nav-center">
				<y-nav-search icon="icon"></y-nav-search>
			</span>
			<span slot="nav-right">
				<y-button type="text">搜索</y-button>
			</span>
		</y-nav>

		<!-- 导航有背景 左箭头 右搜索&更多 S-->
		<y-nav title="demo" class="nav-demo-b" :showSearch="true" :menuData="menuData">

		</y-nav>

		<!-- 导航有背景 左箭头 右文字 S-->
		<y-nav title="demo" class="nav-demo-c" leftText="取消" :showLeftArrow="false">
			<span slot="nav-right">
				<ybutton type="text">发布</ybutton>
			</span>
		</y-nav>
	</div>
</template>

<script type="text/javascript">
import YNav from './nav';
import YNavSearch from './nav-search';
import YNavToggle from './nav-toggle';
import YButton from '@/components/button';

export default {
	components: {
		YNav, YNavToggle, YNavSearch, YButton
	},
	data() {
		return {
			menuData: [
				'index'
			]
		}
	},
};
</script>

<style>
.nav-demo-a .nav {
	top: 1.5rem;
}

.nav-demo-b .nav {
	top: 3rem;
}

.nav-demo-c .nav {
	top: 4.5rem;
}
</style>