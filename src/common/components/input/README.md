### Input输入框

#### 示例

[http://localhost/demo/input](http://localhost/demo/input)

#### Props

| 参数          | 说明            						| 类型    | 可选值    | 默认值         | 是否必填|
|---------------| -------------------------------------- | ------- | --------- | ------------- |------|
| type          | 类型                                    | String  | text/textarea/date/number          | text        |  是|
| value         | 绑定值(v-model)                         | String/Number| —           | —           | 是|
| showTextLengthInfo         | 是否显示字符长度限制信息    | Boolean| true/false         | true          | 否 |
| maxlength     | 最大输入长度                            | Number   | —    | —         |		否	|
| minlength     | 最大输入长度                            | Number   | —    | —         |		否	|
| placeholder   | 输入框占位文本                          | String  | —           | — |	否	|
| disabled      | 禁用                                   | Boolean  | true/false           | false |	否 |
| name          | 原生属性                          	| String  | —           | — |	否 |
| readonly      | 原生属性,是否只读                       | Boolean  | true/false           | false |	否	|
| autofocus     | 原生属性,自动获取焦点                       | Boolean  | true/false         | false |	否	|


#### Events

| 事件名称          | 说明                                    | 回调参数         |
|---------------| -------------------------------------- | ------- |
| blur             | 在 Input 失去焦点时触发                   | ` value `: 当前输入值  |
| focus            | 在 Input 获得焦点时触发                   | ` value `: 当前输入值  |