此组件继承了 [`Popup`][popup]，请先去[这里][popup]查看相关信息。

## Alias

- `Vue.Dialog`
- `Vue#$dialog`

## Methods

### `Dialog.alert(content, options)`

弹出一个对话框，类似 `window.alert`。

#### Parameters

- `content {String / Object}`

	弹出的内容。

	类型为 `Object` 时：有如下属性：

	| 名称		| 类型		| 说明			|
	| ---		| ---		| ---			|
	| `message`	| `String`	| 对话框的消息。	|
	| `title`	| `String`	| 对话框的标题。	|

	类型为 `String` 时，等同于 `message`。

- `options {Object}`

	> 基础选项参见 [`Popup`](../popup#options)。

	| 名称			| 默认值		|
	| ---			| ---		|
	| `blankClose`	| `false`	|

	| 名称			| 类型		| 说明				| 默认值		|
	| ---			| ---		| ---				| ---		|
	| `okText`		| `String`	| 确定按钮的文本。	| `'确定'`	|

#### Return

| 类型		| 说明					|
| ---		| ---					|
| `Promise`	| 确定时执行 	`resolve`。	|

### `Dialog.confirm(content, options)`

弹出一个对话框，类似 `window.confirm`。

#### Parameters

- `content {String / Object}`

	参见 `Dialog.alert`。

- `options {Object}`

	参见 `Dialog.alert`。

	| 名称			| 类型		| 说明				| 默认值		|
	| ---			| ---		| ---				| ---		|
	| `cancelText`	| `String`	| 取消按钮的文本。	| `'取消'`	|

#### Return

| 类型		| 说明										|
| ---		| ---										|
| `Promise`	| 确定时执行 	`resolve`，取消时执行 `reject`。	|

[popup]: ../popup

## [Example](http://localhost/demo/dialog)