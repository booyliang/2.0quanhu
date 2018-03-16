<template>
	<div class="demo-countdown">
		<div>
			<y-countdown v-model="demo1" :start="demo1Start"></y-countdown>
			<y-button @click.native="demo1Start = !demo1Start">{{ demo1Start ? '暂停计时' : '开始计时' }}</y-button>
		</div>
		<div>
			<y-countdown v-model="demo2" :start="demo2Start"></y-countdown>
			<y-button @click.native="demo2Start = !demo2Start">{{ demo2Start ? '暂停计时' : '开始计时' }}</y-button>
		</div>
	</div>
</template>
<script>
	import YCountdown from '@/components/countdown'
	import YButton from '@/components/button'
	export default {
		components: {
			YCountdown,
			YButton
		},
		data() {
			return {
				demo1: 60,
				demo1Start: true,
				demo2: 60,
				demo2Start: false
			}
		}
	}
</script>

