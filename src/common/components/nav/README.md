#Nav
顶部导航栏
## Props

| 名称			| 类型		| 说明			| 取值																				| 默认值		|
| ---			| ---		| ---			| ---																				| ---			|
| showLeftArrow		| `Boolean`	| 是否显示返回图标。	| 																		| `false`		|
| `transparent`	| `Boolean`	| 是否透明背景	| 																				| `false`		|
| `title`	| `String`	| 	导航标题	| 			| 				|
| `leftText`		| `String`	| 导航左侧文本		| 													| 				|
| `beforeBack`			| `Function`	| 点击返回按钮的回调函数，返回false将不会跳转路由	| 																					| `'button'`	|
| `type`		| `String`	| 类型。		| `'ghost'`：幽灵按钮（无填充，有边框）；<br>`'text'`：文本式按钮（纯文本样式）。	| 				|
| showSearch		| `Boolean`	| 是否显示搜索图标	| 																		| `false`		|
| showMember		| `Boolean`	| 是否显示成员图标	| 																		| `false`		|
| menuData		| `Array`	| 导航菜单	| index,copy-url,share,report 																		| `false`		|

## [Example](http://localhost/demo/nav)

#NavSearch

#NavToggle
导航右侧菜单

| 名称			| 类型		| 说明			| 取值																				| 默认值		|
| ---			| ---		| ---			| ---																				| ---			|
| menu		| `Array`		| 下拉菜单		| 		copy-url,share,homepage,send-to-desktop,report,refresh						| `false`		|

