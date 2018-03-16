### Avatar 头像

#### 示例

[Example](http://localhost/demo/avatar)

#### Props

| 参数          | 说明            						| 类型    | 可选值    | 默认值         | 是否必填|
|---------------| -------------------------------------- | ------- | --------------- | ------------- |------|
| src | 图片地址 | String | —— | —— | 是 |
| alt | 图片替代文本 | String | —— | ` 用户头像 ` | 否 |
| link | 点击头像跳转链接 | String, Object | ` router-link `的 ` to ` 属性相同规则 | —— | 否 |
| default-avatar | 默认头像 | String | —— | —— | 否 |
| badge | 是否用户标识 | Boolean | true/false  | false | 否 |
| type | 用户类型 (当` badge `为` true `时，此字段有效) | Number | ` 1 `: vip <br> ` 2 `: 达人 | ` 1 ` | 否 |
