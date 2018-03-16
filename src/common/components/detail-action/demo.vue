<template>
	<div>
		<div style=" text-align: center;">
				<div>假如这是详情。。。</div>
				<div>详情内容</div>
				<div>详情内容</div>
				<div>详情内容</div>
				<div>详情内容</div>
				<div>假如这是详情。。。</div>
				
		</div>
		<y-detail-action :action-option = "['comment', 'repost','reward', 'like']" :resource-data = "resourceData"></y-detail-action>

	</div>
</template>
<script>
	import DetailAction from "@/components/detail-action";
	export default {
		components: {
			[DetailAction.name]: DetailAction
		},
		data() {
			return {
				resourceData: {
					moduleEnum: 10015, // 10016,10015
					kid: "10248",
					createUserId: "729869321898680300",
					likeFlag: 1,
					likeCount: 7,
					rewardCount: 17,
					commentCount: 0,
					transmitCount: 15,
					resourceId: "734362957204307968"
				},
				resourceData2: { // 模拟转发
					moduleEnum: 1003, // 10016,10015
					kid: "734362957204307968",
					createUserId: "729869321898680300",
					likeFlag: 0,
					likeCount: 7,
					rewardCount: 17,
					commentCount: 0,
					transmitCount: 15,
				}
			}
		},
		mounted() {
			
		},
		methods: {
			
		}
	}
</script>