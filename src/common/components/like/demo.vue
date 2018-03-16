<template>
		<div>
			<y-like :like-data = "likeData"></y-like>
			<y-like :like-data = "likeData2"></y-like>
		</div>
	</template>
	<script>
		import Like from "@/components/like"
		export default {
			components: {
				[Like.name]: Like,
			},
			data() {
				return {
					likeData: {
						moduleEnum: "10016",
						kid: 10248,
						createUserId: "729894078090174500",
						likeFlag: 0,
						likeCount: 3,
						rewardCount: 17,
						commentCount: 0,
						transmitCount: 15,
					},
					likeData2: {
						moduleEnum: "10015",
						kid: 10249,
						createUserId: "729894078090174500",
						likeFlag: 1,
						likeCount: 14,
						rewardCount: 17,
						commentCount: 0,
						transmitCount: 15,
					}
				}
			},
			methods: {
				
	
			}
		}
	</script>