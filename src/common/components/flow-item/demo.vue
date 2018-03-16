<template>
	<div>
		<y-flow-item :data="data" :heat="['view']"></y-flow-item>
		<y-flow-item :data="data" :heat="['view']" horizontal></y-flow-item>
		<y-flow-item :data="data" :heat="['view']">
			<template slot="media" slot-scope="scope">
				<div>This is custom media:</div>
				<img :src="scope.data.imgUrl">
			</template>
		</y-flow-item>
	</div>
</template>

<script type="text/javascript">
	import FlowItem from './';

	export default {
		components: {
			[FlowItem.name]: FlowItem
		},

		data() {
			return {
				data: {
					"appName": "cyq",
					"columnCode": "100-1010",
					"content": "在这个资讯发达的互联网时代，为什么还是会出现那么多创业失败的例子？？",
					"contentSource": "",
					"createDate": "2017-05-18 11:00:36",
					"createUserId": "1",
					"heat": 9999999,
					"id": 14,
					"imgThumbnailUrl": "https://cdn.yryz.com/pic/issue/5E540D3C-194E-4882-B7E6-F6EE809122BC_iOS.jpg",
					"imgUrl": "https://cdn.yryz.com/pic/issue/5E540D3C-194E-4882-B7E6-F6EE809122BC_iOS.jpg",
					"lastUpdateDate": "2017-05-18 11:00:36",
					"lastUpdateUserId": "",
					"nickName": "zhangshan",
					"recommend": 1,
					"replyCount": 10,
					"revision": 1,
					"shelveFlag": 0,
					"sort": 1,
					"title": "十个创业九个死？！",
					"userImg": "https://cdn.yryz.com/pic/issue/8663B748-FE4D-46F2-8544-9BDD4FCF68F3_iOS.jpg",
					"viewCount": 174
				},
			};
		}
	};
</script>