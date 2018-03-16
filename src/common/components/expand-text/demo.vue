<template>
	<div class="demo-expand">
		<y-expand-text>
			这是默认的显示 样式自己写
		</y-expand-text>
		<y-expand-text>
			这是默认的显示 样式自己写这是默认的显示 样式自己写这是默认的显示 样式自己写这是默认的显示 样式自己写这是默认的显示 样式自己写
		</y-expand-text>
		
		<y-expand-text :lineNum = "3">
			最多只显示3行哦 超出部分自动收起，并出现咋和你开收起按钮 最多只显示3行哦 超出部分自动收起，并出现咋和你开收起按钮
			最多只显示3行哦 超出部分自动收起，并出现咋和你开收起按钮
		</y-expand-text>
		
		<y-expand-text :lineNum = "4" icon-up = "icon-gift" icon-down = "icon-article" icon-down-text="展开查看全文哦" icon-up-text="自定义收起按钮文字" >
				最多只显示4行哦 自定义展开收起按钮的文字与图标 最多只显示4行哦 自定义展开收起按钮的文字与图标
				最多只显示4行哦 自定义展开收起按钮的文字与图标 最多只显示4行哦 自定义展开收起按钮的文字与图标
				最多只显示4行哦 自定义展开收起按钮的文字与图标 最多只显示4行哦 自定义展开收起按钮的文字与图标
				最多只显示4行哦 自定义展开收起按钮的文字与图标 最多只显示4行哦 自定义展开收起按钮的文字与图标
			</y-expand-text>	
	</div>
</template>
<script>
	import YExpandText from '@/components/expand-text';
	export default {
		components: {
			[YExpandText.name]: YExpandText
		},
		data() {
			return {
				
			}
		}
	}
</script>
<style>
	.demo-expand .fold-box{
		margin-bottom: 20px;
	}
	
</style>

