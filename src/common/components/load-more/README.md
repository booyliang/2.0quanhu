## Props

| 名称			| 类型		| 说明																| 取值																																		| 默认值			|
| ---			| ---		| ---																| ---																																		| ---			|
| `endTip`		| `Boolean`	| 显示加载结束后的提示。												| -																																			| `true`		|
| `offset`		| `Number`	| 距离滚动边界的偏移量，以 px 为单位，到达该位置时触发 `can-load` 事件。	| -																																			| `0`			|
| `state`		| `String`	| 组件的状态。														| `'end'`：加载结束；<br>`'loading'`：正在加载；<br>`'prepared'`：可以进行下次加载。<br>当值为 `'loading'` 或 `'end'` 时会锁定行为，不监听滚动状态。	| `'prepared'`	|

## Events

| 名称			| 说明											|
| ---			| ---											|
| `can-load`	| 在可以加载下一页数据的时候（目前是滚动触底时）触发。	|

## [Example](http://localhost/demo/load-more)