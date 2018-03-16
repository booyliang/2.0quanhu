此组件继承了 [`Popup`][popup]，请先去[这里][popup]查看相关信息。

## Props


| 名称		| 类型						| 说明																				| 默认值		|
| ---		| ---						| ---																				| ---		|
| *`menu`	| `Array<String / Object>`	| 需要启用的菜单项。参见下方。															| -			|
| `options`	| -							| 基础选项参见 [`Popup`](../popup#options)。覆盖值及特有选项参见 [`options`](#options)。	| -			|
| `select`	| `Boolean`					| 选择模式。	在此模式下，`menu` 需要改变数据结构，参见下方。								| `false`	|

### `menu`

> 选择模式下，菜单项的数据结构需要遵循 [`CheckGroup`](../check-group) 中 `data` 的规定，下述说明失效。

当数组元素类型为 `String` 时，菜单项对应关系如下：

| 名称			| 含义								|
| ---			| ---								|
| `'copy-url'`	| 复制链接。							|
| `'index'`		| 圈子首页。							|
| `'refresh'`	| 刷新。								|
| `'report'`	| 举报。								|
| `'share'`		| 分享（需要调用者传入 `action`）。	|

当类型为 `Object` 时，包含以下属性：

| 名称		| 类型			| 说明																						|
| ---		| ---			| ---																						|
| `action`	| `Function`	| 菜单项执行的动作。注意：组件内部没有进行上下文绑定，如果你需要在函数内使用 `this`，请自行绑定上下文。	|
| `icon`	| `String`		| 菜单项的图标的 `class` （不含 `icon-`）。													|
| `name`	| `String`		| 菜单项的名字。可接受上述预设值，用于覆盖默认表现。												|
| `text`	| `String`		| 菜单项的文本。																				|

### `options`

| 名称				| 默认值		|
| ---				| ---		|
| `transparentMask`	| `true`	|

| 名称		| 类型		| 说明			| 默认值		|
| ---		| ---		| ---			| ---		|
| `fixed`	| `Boolean`	| 固定定位。		| `false`	|
| `static`	| `Boolean`	| 不需要定位。	| `false`	|

## Events

| 名称			| 说明							| 回调参数											|
| ---			| ---							| ---												|
| `selected`	| 选择模式下，选择了某项后触发。	| `item:Object`：当前选择的项，数据结构参见 `menu`。	|

## [Example](http://localhost/demo/menu)

[popup]: ../popup