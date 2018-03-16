export default {
	filters: {
		commentItemMixinReplaceEnter(value) {
			let result = value;
			if (value) {
				result = value.replace(/\n/g, " ").replace(/\r\n/g, " ") 
			}
			return result;
		}
	},
	methods: {
		async commentItemMixinDelete(data) {
			console.log('delete comment', data)
			// this.$indicator.open();
			let params = {
				createUserId: data.createUserId,
				kid: data.kid,
				resourceId: data.resourceId,
				topId: data.topId
			}
		
			let res = await this.$http.post('/services/app/v2/comment/clean', params);
			// this.$indicator.close();
			let resData = res.data;
			if (resData.code === '200') {
				this.$eventBus.$emit('comment-item-delete', data);
			} else {
				this.$toast('删除失败');
			}
		}
	}
}