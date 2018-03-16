<template>
		<div>
			<y-reward :data = "rewardData"></y-reward>
		</div>
	</template>
	<script>
		import Reward from "@/components/reward"
		export default {
			components: {
				[Reward.name]: Reward,
			},
			data() {
				return {
					rewardData: {
						moduleEnum: "1005",
						kid: "732479940461404160",
						rewardCount: 17,
						user: {
							userId: "729894078090174500",
						}
					}
				}
			},
			methods: {
				
	
			}
		}
	</script>