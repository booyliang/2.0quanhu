## Card 

### Props

| 参数          | 说明            						| 类型    | 可选值    | 默认值         | 是否必填|
|---------------| -------------------------------------- | ------- | --------------- | ------------- |------|
| src | 图片地址 | String | —— | —— | 是 |
| alt | 图片替代文本 | String | —— | ` 用户头像 ` | 否 |
| default-avatar | 默认图片 | String | —— | —— | 否 |
| badge | 是否显示用户标识 | Boolean | true/false  | false | 否 |
| type | 用户类型 (当` badge `为` true `时，此字段有效) | Number | ` 1 `: vip <br> ` 2 `: 达人 | ` 1 ` | 否 |
| to | 点击title跳转链接 | String, Object | ` router-link `的 ` to ` 属性相同规则 | —— | 否 |
| title | 标题 | String | —— |  —— | 否 |
| assist | 辅助文本 | String | —— |  —— | 否 |
| position | 显示位置 | String | ` horizontal `: 水平排列 <br>` vertical `: 垂直排列 |  ` horizontal ` | 否 |
| img-size | 图片大小 | String | ` large `: 大图	| —— | 否 |

> 可传入 [`<router-link>` 相关 props](http://router.vuejs.org/zh-cn/api/router-link.html)，包含` to `以外的值与属性
### Events

|	事件名		|	说明	|	参数		|
|-------------|---------|--------------|
| click-img		| 点击图片 | ` data `: 图片地址 |


### Slots

|	名称		|	说明	|	备注	|
|-------------|--------|----------|
|	` assist `	|	辅助文本区域，设置了此处，Props 中 ` assite ` 将失效|	——	|