<template>
	<div>
		<y-button id="trigger">Open Menu</y-button>
		<y-menu :menu="menu" :options="options"></y-menu>
		<y-button id="select-trigger">Open Select Menu</y-button>
		<y-menu select :menu="selectMenu" :options="selectOptions" @selected="handleSelected"></y-menu>
	</div>
</template>

<script type="text/javascript">
	import Menu from '@/components/menu';
	import Button from '@/components/button';

	export default {
		components: {
			[Button.name]: Button,
			[Menu.name]: Menu,
		},

		data() {
			return {
				menu: [
					'copy-url',
					'refresh',
					'index',
					'report',
					{
						name: 'share',

						action() {
							alert('需要外部自定义 action。');
						}
					},
					{
						text: 'Custom Item',

						action: () => {
							alert('I am a custom item.');
						}
					}
				],
				options: {
					trigger: '#trigger',
				},
				selectMenu: [
					{
						id: 'time',
						text: '时间排序',
						checked: true
					},
					{
						id: 'heat',
						text: '热度排序'
					},
				],
				selectOptions: {
					trigger: '#select-trigger',
				},
			};
		},

		methods: {
			handleSelected(item) {
				alert(`${item.text} selected.`);
			}
		}
	};
</script>