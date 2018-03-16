此组件继承了 [`Popup`][popup]，请先去[这里][popup]查看相关信息。

## Methods

### `Actionsheet(actions, options)`

弹出一个 actionsheet。

#### Alias

- `Vue.actionsheet`
- `Vue#$actionsheet`

#### Arguments

- `actions {Array<Object>}`

	`action` 对象组成的数组。每个对象有如下属性：

	| 名称		| 类型			| 说明						|
	| ---		| ---			| ---						|
	| `handler`	| `Function`	| 处理函数（无 `this` 绑定）。	|
	| `text`	| `String`		| 文本。						|

- `options {Object}`

	> 参见 [`Popup`](../popup#options)。

[popup]: ../popup/

## [Example](http://localhost/demo/actionsheet)