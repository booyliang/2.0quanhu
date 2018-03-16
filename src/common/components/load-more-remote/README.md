## Props

| 名称			| 类型		| 说明																																																										| 默认值			|
| ---			| ---		| ---																																																										| ---			|
| `endTip`		| -			| 参见 [`LoadMore`][load-more]。																																																				| -				|
| `maxPage`		| `Number`	| 最大请求页数。																																																								| `Infinify`	|
| *`request`	| `Object`	| 请求对象。数据结构参见 [Axios](https://www.npmjs.com/package/axios#request-config)。<br>注意：`url` 需要把 `/:pageNo/:pageSize` 部分去掉，组件会按照需求传入默认值。如果你需要自定义，请将这两个参数传入 `params`，组件会自动生成符合服务器端要求的 URL。	| -				|

## Events

| 名称			| 说明							| 回调参数																	|
| ---			| ---							| ---																		|
| `loaded`		| 服务器端响应且有数据的情况下触发。	| `list:Array`：服务器端返回的列表。<br>`res:Object`：服务器端返回的响应对象。	|

## [Example](http://localhost/demo/load-more-remote)

> 当你觉得此组件无法满足需求时，可以联系作者提出修改意见，或直接使用 [`LoadMore`][load-more]。

[load-more]: ../load-more