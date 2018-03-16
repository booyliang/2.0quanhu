## 文本编辑器

#### Props

| 参数          | 说明                                    | 类型    | 可选值    | 默认值         |
|---------------| -------------------------------------- | ------- | --------- | ------------- |
| value         | 绑定值(v-model)                         | String  | —           | —           |
| placeholder   | 占位文本，没有内容时显示的内容            | String  | —           | "请输入内容" |
| textMaxLength | 最大文字输入数                           | Number  | —           | 1000        |
| imgMaxLength  | 最大图片数                              | Number  | —           | 10          |
| imageEnable   | 是否开启图片上传                         | boolean | true, false | true        |
| videoEnable   | 是否开启视频上传                         | boolean | true, false | false        |

#### Methods

| 方法名         | 说明                                                                 | 参数 |
|----------------|---------------------------------------------------------------------|------|
| getSummaryData | 返回一个Object,包含content,imgUrl,videoUrl,videoImgUrl等信息 | —    |