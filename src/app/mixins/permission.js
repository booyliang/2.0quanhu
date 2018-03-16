export default {
	methods: {
		async preverify(data) {
			let errorMsgObject =  {
				"1007": '您已被禁言',
				"1024": "您已被圈主禁言！",
				"1027": "您还不是该私圈成员，加入后可发布评论",
				"1012": "对方已将您加入黑名单"
			}
			const { coterieId, user, createUserId } = data;
			let postData = {
				blacklist: 1,
				mute: 1,
				sourceUserId: user ? user.userId : createUserId
			}
			if (coterieId && coterieId !== 0) {
				postData.coterieId = coterieId;
				postData.coterieMember = 1;
				postData.coterieMute = 1;
			}
			let res = await this.$http({
				url: '/services/app/v2/behavior/preverify',
				method: 'post',
				data: postData,
				disabledErrorToast: true
			})
			let resData = res.data;
			if (resData.code === '200') {
				return true;
			} else {
				this.$toast(errorMsgObject[resData.code]);
			}
			return false;
		},
		async isGag(data) {
			// 查询是否禁言 用户权限查询
			let params = {
				userId: data.user ? data.user.userId : data.createUserId
			}
			let res = await this.$http.get("/services/app/v2/user/getPermission", { params});
			if (res.data.code === "200") {
				if (res.data.data.disTalk) {
					this.$toast("您已被禁言", {autoClose: 1000})
					return false;
				}
			} else {
				this.$toast(res.data.msg, { autoClose: 1000 })
				return false;
			}
			return true
			
		},

		async isDefriend(data) {
			// 查询 目标用户是否将当前用户拉黑
			let params = {
				targetUserId: data.user ? data.user.userId : data.createUserId
			}
			let res = await this.$http.get("/services/app/v2/user/relation/query/id", {params})
			if (res.data.code === "200") {
				if (res.data.data.relationStatus === 3) {  // relationStatus取值 0无关系 1粉丝 2关注 3拉黑 4被拉黑 5好友 6相互拉黑
					this.$toast("对方已将您加入黑名单", {autoClose: 1000})
					return false;
				}
			} else {
				this.$toast(res.data.msg, { autoClose: 1000 })
				return false;
			}
			return true
		},
		async isCoterieDisTalk(data) { // 查询是否私圈禁言 平台级禁言不用此接口查询
			if (data.coterieId && data.coterieId !== 0) {
				let params = {
					coterieId: data.coterieId
				}
				let res = await this.$http.get("/services/app/v2/coterie/member/coterieBanSpeak", {params})
				if (res.data.code === "200") {
					if (res.data.data.permission === 20) {  // 10平台用户禁言，20私圈内用户禁言，30未禁言正常用户
						this.$toast("对方已将您加入黑名单", {autoClose: 1000})
						return false;
					}
				} else {
					this.$toast(res.data.msg, { autoClose: 1000 })
					return false;
				}
				return true;
			} else {
				return true;
			}
			

		}

		
	}
}