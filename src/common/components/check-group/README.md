### check-group单选多选项

#### 示例

[http://localhost/demo/check-group](http://localhost/demo/check-group)

#### Props

| 参数          | 说明            						| 类型    | 可选值    | 默认值         | 是否必填|
|---------------| -------------------------------------- | ------- | --------- | ------------- |------|
| type          | 类型                                    | String  | radio/checkbox          | 无        |  是|
| value			|绑定值(v-model)							|Array/String/Number|—|—			|否
| data         | 单选复选键值对数组                      	| Array| —           | —           | 是|
| maxSelectedCount         | 最多可选    					| Number| —        | —          | 否 |
| idField      | 选项值                               		| String  | —           | id |	否 |
| textField          | 选项文本(当slot存在时，失效)                         	| String  | —           | text |	否 |
| checkedField      | 是否已选                       		| String  | —           | checked |	否	|
| iconAfterText     | 图标是否在行末尾                       | Boolean  | true/false         | false |	否	|
| v-model     | 绑定已选值(radio返回选中的id, checkbox返回选中的id数组)        | String/Array  |          | false |	否	|

#### 事件

| 事件名称          | 说明                                    | 参数         |
|---------------| -------------------------------------- | ------- |
| clickItem             | 点击选项触发                  | 当前选项`currItem`  |	
| clickToast    |达到多选值触发事件
#### 方法

| 方法名称          | 说明                                    | 回调参数         |
|---------------| -------------------------------------- | ------- |
| getSelectedIds             | 获取已选选项的值 (Array)                  |   |
| getSelectedTexts            | 获取已选选项的文本   (Array)                |  |
| getSelectedItems				| 获取已选选项  (Array)                 |  |

#### Slots
| 名称		| 说明				|
| ---		| ---				|
| `default`	| 选项的内容。	|