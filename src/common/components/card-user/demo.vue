<template>
	<div class="card_user-demo">
		<y-card-user :data="cardData1"></y-card-user>
	</div>
</template>
<script>
	import YCardUser from '@/components/card-user'
	export default {
		components: {
			YCardUser
		},
		data() {
			return {
				cardData1: {
					"answerCount": 1,
					"answerId": null,
					"appName": "common",
					"commentCount": 0,
					"content": "试试提问功能",
					"contentSource": "[{\"text\":\"试试提问功能\"}]",
					"createDate": "2017-06-05 11:06:10",
					"createUserId": "34",
					"delFlag": 0,
					"favoriteCount": 0,
					"heat": 0,
					"id": 58,
					"imgUrl": "",
					"lastUpdateDate": "2017-06-06 19:11:40",
					"lastUpdateUserId": "",
					"likeCount": 0,
					"likeFlag": 0,
					"moduleEnum": "0011",
					"myAnswerId": null,
					"nickName": "测试用户",
					"questionType": "",
					"recommend": 0,
					"recommendDate": null,
					"revision": 1,
					"roleFlag": 0,
					"shareCount": 0,
					"shelveFlag": 0,
					"targetId": "",
					"targetNickName": "",
					"targetRoleFlag": 0,
					"targetUserImg": "",
					"targetUserName": "",
					"tenantId": "",
					"title": "试试提问功能",
					"type": 2,
					"userImg": "",
					"userName": "",
					"viewCount": 220
				}
			}
		}
	}
</script>
