<template>
	<div>
		<y-hot-list :show-text = "false" :heats="['repost','comment','like']" :data = "hotData"></y-hot-list>
		<y-hot-list :heats="['repost','comment','like']" :data = "hotData"></y-hot-list>
		
	</div>
</template>
<script>
	import HotList from "@/components/hot-list"
	export default {
		components: {
			[HotList.name]: HotList,
		},
		data() {
			return {
				hotData: {
					kid: "287773787439759360",
					moduleEnum: "10015",
					createUserId: "726904523150958600",
					likeCount: 1,
					commentCount: 13,
					repostCount: 21,
					forwardCount: 1024,
					likeFlag: 1,
				}

			}
		}
	}
</script>