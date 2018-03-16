## Props

| 名称			| 类型		| 说明					| 取值	| 默认值		|
| ---			| ---		| ---					| ---	| ---		|
| `clickable`	| `Boolean`	| 表示可点击。			| 		| `false`	|
| `placeholder`	| `String`	| 占位提示。				| 		| 			|
| `split`		| `Boolean`	| 与之后的列表项分隔开。	| 		| `false`	|
| `subtitle`	| `String`	| 副标题。				| 		| 			|
| `title`		| `String`	| 标题。					| 		| 			|
| `value`		| `String`	| 列表项的值。			| 		| 			|
| `vertical`	| `Boolean`	| 垂直排列。				| 		| `false`	|

> 可传入 [`<router-link>` 相关 props](http://router.vuejs.org/zh-cn/api/router-link.html)。

## Slots

| 名称		| 说明					|
| ---		| ---					|
| `default`	| 替换整个列表项的内容。	|
| `addon`	| 附加内容。				|
| `foot`	| 替换尾部的内容。		|
| `head`	| 替换头部的内容。		|

## Events

| 名称		| 说明																										|
| ---		| ---																										|
| `click`	| 点击时触发。<br>注意：这是一个自定义事件，触发区域不包括 `addon` 部分。如果需要监听整个组件，请加 `.native` 修饰符。	|

## [Example](http://localhost/demo/item)