import Dialog from "@/components/dialog";
export default {
	data() {
		return {
			userStatus: null
		}
	},

	computed: {
		resourceData() {
			let result = this[this.moreActionDataModelKey];
			return result;
		}
	},

	methods: {
		// 收藏
		async handleCollect() {
			const { coterieId, moduleEnum, kid } = this.resourceData
			let params = {
				coterieId: coterieId,
				moduleEnum: moduleEnum,
				resourceId: kid
			}
			let res = await this.$http.post("/services/app/v2/collection/single", params)
			if (res.data.code === "200") {
				this.hasCollected = true;
				this.$toast("已收藏", {autoClose: 1000});
			}
		},

		// 取消收藏
		async handleUncollect() {
			const { moduleEnum, kid } = this.resourceData
			let params = {
				moduleEnum: moduleEnum,
				resourceId: kid
			}
			let res = await this.$http.post("/services/app/v2/collection/del", params)
			if (res.data.code === "200") {
				this.hasCollected = false;
				this.$toast("取消收藏成功", {autoClose: 1000});
			} 
		},

		// 拒绝回答
		async rejectAnswer() {
			const { kid } = this.resourceData
			let res = await this.$http.post("/services/app/v2/coterie/question/reject", { kid })
			if (res.data.code === '200') {
				this.$yryz.delete({kid: kid})
				this.disabled = true,
				this.btnText = '已拒绝回答'
				this.$toast('已拒绝', {autoClose: 1000}).then(() => {
					this.$router.back();
				})
			}
		},

		// 举报
		handleReport() {
			const { moduleEnum, kid } = this.resourceData
			this.$yryz.report({
				moduleEnum: moduleEnum,
				resourceId: kid
			})
		},

		// 删除提问
		async deleteQuetion() {
			const { kid } = this.resourceData
			let res = await this.$http.post("/services/app/v2/coterie/question/delete", { kid })	
			if (res.data.code === '200') {
				this.$yryz.delete({kid: kid})
				this.$toast('删除成功', {autoClose: 1000}).then(() => {
					this.$router.back();
				})
			}
		},

		// 获取用户与私圈的权限关系
		async getUserInfoByCoterie(coterieId) {
			let res = await this.$http.get(`/services/app/v2/coterie/member/permission?coterieId=${coterieId}`)
			if (res.data.code === '200') {
				this.userStatus = res.data.data.permission
			}
		}
	}
}