## Props

| 名称			| 类型				| 说明										| 默认值		|
| ---			| ---				| ---										| ---		|
| *`data`		| `Object`			| 信息流对象，由服务器端返回。					| -			|
| `heat`		| -					| 参见 [`Heat`](../heat)。					| -			|
| `horizontal`	| `Boolean`			| 内容区是否水平排列。							| `false`	|
| `remove`		| `Array<String>`	| 需要移除的部分。参见 [`remove`](#remove)。	| `[]`		|

### `remove`

一个由字符串组成的数组，每个元素对应组件的一部分，对应关系如下：

| 名称			| 含义	|
| ---			| ---	|
| `'content'`	| 正文。	|

> 需要移除更多部分，请联系组件作者。

## Slots

| 名称			| 说明						| 作用域 [^1]					|
| ---			| ---						| ---							|
| `left-bottom`	| 左下角区域。				| `data`：参见 [Props](#props)。	|
| `media`		| 媒体区域（图片、视频等）。	| `data`：参见 [Props](#props)。	|
| `right-top`	| 右上角区域。				| `data`：参见 [Props](#props)。	|

## [Example](http://localhost/demo/flow-item)

[^1]: 作用域插槽参见[官方文档](http://cn.vuejs.org/v2/guide/components.html#作用域插槽)。