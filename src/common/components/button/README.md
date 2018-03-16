## Props

| 名称			| 类型		| 说明		| 取值																		| 默认值			|
| ---			| ---		| ---		| ---																		| ---			|
| `block`		| `Boolean`	| 是否块级。	| -																			| `false`		|
| `disabled`	| `Boolean`	| 是否禁用。	| -																			| `false`		|
| `situation`	| `String`	| 情境。		| `'error'`：错误；<br>`'reverse'`：反操作（e.g. 取消关注等）。					| -				|
| `size`		| `String`	| 尺寸。		| `'l'`：大；<br>`'s'`：小。													| -				|
| `tag`			| `String`	| 标签名。	| -																			| `'button'`	|
| `type`		| `String`	| 类型。		| `'ghost'`：幽灵按钮（无填充，有边框）；<br>`'text'`：文本式按钮（纯文本样式）。	| -				|

> 可传入 [`<router-link>` 相关 props](http://router.vuejs.org/zh-cn/api/router-link.html)，但此时 `tag` 默认值仍为 `'button'`。

## Slots

| 名称		| 说明	|
| ---		| ---	|
| `default`	| 文本。	|

## [Example](http://localhost/demo/button)