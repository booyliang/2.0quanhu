<template>
	<div class="demo-content_editor">
		<y-editor v-model="content" :video-enable="true" :audio-enable="true" :text-max-length="200"></y-editor>
	</div>
</template>
<script>
	import YEditor from '@/components/content-editor'
	export default {
		components: {
			YEditor
		},
		data() {
			return {
				content: '[{"text": "测试\\r文\\n本"}]'
			}
		}
	}
</script>
