<template>
	<div class="audio-demo">
		<h3>可播放</h3>
		<y-audio src="http://www.w3school.com.cn/i/song.mp3" time="8000"></y-audio>
		<h3>不可播放</h3>
		<y-audio :play="false" src="http://www.w3school.com.cn/i/song.mp3" time="8000"></y-audio>
	</div>
</template>
<script>
	import YAudio from '@/components/audio'
	export default {
		components: {
			YAudio
		}
	}
</script>