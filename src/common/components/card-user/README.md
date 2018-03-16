## Card 

### Props

| 参数          | 说明            						| 类型    | 可选值    | 默认值         | 是否必填|
|---------------| -------------------------------------- | ------- | --------------- | ------------- |------|
| data | 服务端返回列表数据 | Object | —— | —— | 是 |
| router | 是否链接跳转 | Boolean | true/false	| true | 否 |
| position | 显示位置 | String | ` horizontal `: 水平排列 <br>` vertical `: 垂直排列 |  ` horizontal ` | 否 |
| img-size | 图片大小 | String | ` large `: 大图	| —— | 否 |

> 可传入 [`<router-link>` 相关 props](http://router.vuejs.org/zh-cn/api/router-link.html)，包含` to `以外的值与属性
### Events

|	事件名		|	说明	|	参数		|
|-------------|---------|--------------|
| click-avatar		| 点击头像 | ` data `: 头像地址 |