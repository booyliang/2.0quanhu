<template>
	<div class="detail-action-wrap" v-if="resourceData">
		<div class="action-list">
			<div class="detail-action-reward" v-if="showReward" >
				<y-reward :data="rewardData" @reward-success = "handerRewardSuccess"></y-reward>
			</div>
			<y-tab-bar class="action-tab" v-model="tabId"  :tabOption="finalOption" :enableRouter="false" :show-count = "true">
			</y-tab-bar>
			<div v-for = "(item, index) in actionOption" :key = "index"  v-show = "tabId === item">
				<y-detail-action-list :ref="`${item}Item`" :item-name = "item" :resource-data = "resourceData" ></y-detail-action-list>
			</div>
		</div>

		
		<div class="action-tool" v-if="inApp" :class="$env.specialDeviceName + '_tool_bar'">
			<y-hot-list v-if="finalHeats && finalHeats.length > 1 " :heats="finalHeats" @open-comment = "openNativeComment"  @change-like = "changeLikeList" @forward-success = "handleForwardSuccess" :data = "hotData"></y-hot-list>
			<div class="action-comment_tool" v-else-if = "finalHeats.includes('comment') > 0">
				<span class="input-view" @click.stop="openNativeComment">我要说几句…</span>					
			</div>
		</div>
	  

		<div v-if="showCommentDetail" class="comment-detail-fix">
			<div class="comment-detail">
				<y-comment-detail @hide="hideCommentDetail" :kid="commentDetailKid" :parent-resource-data = "resourceData" :resourceId="commentDetailResourceId"></y-comment-detail>
			</div>
		</div>
		
	</div>
</template>
<script>
	let defaultOption = {
		like: {
			id: 'like',
			text: "点赞",
			count: 0,
		},
		comment: {
			id: 'comment',
			text: "评论",
			count: 0,		
		},
		repost: {
			id: 'repost',
			text: "转发",
			count: 0,
		},
		reward: {
			id: 'reward',
			text: "打赏",
			count: 0,
		},
		
	}
	import DetailActionList from "./components/detail-action-list";
	import LoadMoreRemote from '@/components/load-more-remote';
	import Reward from "@/components/reward"
	import HotList from "@/components/hot-list"
	import YFlowList from "@/components/flow-list"
	import YTabBar from "@/components/tab/tab-bar"
	import YCommentDetail from '@/components/comment-detail'
	import commentMixin from "./components/comment/mixins/comment"
	export default {
		name: "y-detail-action",
		mixins: [commentMixin],
		components: {
			[Reward.name]: Reward,
			[HotList.name]: HotList,
			[YFlowList.name]: YFlowList, 
			[YTabBar.name]: YTabBar,
			YCommentDetail,
			[LoadMoreRemote.name]: LoadMoreRemote,
			[DetailActionList.name]: DetailActionList,
		},
		props: {
			resourceData: {
				type: Object,
				required: true
			},
			actionOption: {
				type: Array,
				default: () => {
					return ['comment', 'repost', 'reward', 'like']
				}
			}

		},
		data() {
			return {
				rewardCount: null,
				likeFlag: null,
				tabId: 'comment',
				showCommentDetail: false,
				commentDetailKid: '', // 进入评论详情的评论id
				commentDetailResourceId: "",
				list: [], // 评论列表
				inApp: !!this.$yryz.isNative(),
				countList: {}
			}
		},
		computed: {
			finalOption() {
				let result = [];
				this.actionOption.map(item => {
					defaultOption[item].count = this.countList[item];
					result.push(defaultOption[item]);
				})
				return result;
			},
			rewardData() {
				return {
					...this.resourceData,
					rewardCount: this.rewardCount
				}
			},
			hotData() {
				return {
					...this.resourceData,
					likeFlag: this.likeFlag
				}
			},
			showActionTool() {
				return this.$yryz.isNative();
			},
			showReward() {
				return this.inApp && this.actionOption.includes("reward");
			},
			finalHeats() {
				let initHeat = ['comment'];
				if (this.actionOption.includes("repost")) {
					initHeat.unshift("repost");
				}
				if (this.actionOption.includes("like")) {
					initHeat.push("like");
				}
				return initHeat;
			},



		},
		// watch: {
	
		// 	resourceData() {
		// 	}

		// },
		mounted() {
			this.$eventBus.$on('show-comment-detail', this.handleShowCommentDetail);
			this.$eventBus.$on('hanlde-comment-count-add', this.handlecommentCountAdd);
			this.$eventBus.$on('hanlde-comment-count-delete', this.handlecommentCountDelete);

			this.$nextTick(() => {
				this.getCount();
			})
		
		},
		beforeDestroy() {
			this.$eventBus.$off('show-comment-detail', this.handleShowCommentDetail);
			this.$eventBus.$off('hanlde-comment-count-add', this.handlecommentCountAdd);
			this.$eventBus.$off('hanlde-comment-count-delete', this.handlecommentCountDelete);

		},
		// created() {
		// 	this.initOption();
		// },
		methods: {

			// initOption() {
			// 	this.actionOption.map(item => {
			// 		this.finalOption.push(defaultOption[item]);
			// 	})
			// 	// console.log("finalOption:", this.finalOption)
			// },
			handleShowCommentDetail(item) {
				// console.log("commentDetailKid", item.kid)
				this.showCommentDetail = true;
				this.commentDetailKid = item.kid;
				this.commentDetailResourceId = item.resourceId;
			},
			hideCommentDetail() {
				this.showCommentDetail = false;
				this.commentDetailKid = "";
				this.commentDetailResourceId = "";
			},
			handleChangeCount(name, isAdd, deleteNum) { // 动态改变数量
				// this.finalOption.forEach((item, index) => {
				// 	if (item.id === name) {
				// 		if (isAdd) {
				// 			this.finalOption[index].count += 1;
				// 		} else {
				// 			this.finalOption[index].count -= deleteNum + 1;
				// 		}
				// 	}
				// });
				if (isAdd) {
					this.countList[name] += 1;
				} else {
					this.countList[name] -= deleteNum + 1;
				}
				this.updateNative();
			},
			async changeLikeList(data) { // 点赞成功后 改变点赞列表
				this.likeFlag = data.likeFlag;
				if ( data.likeFlag === 10 ) { // 点赞状态 10-取消点赞 11-点赞
					// console.log("取消点赞", data)
					this.$refs['likeItem'][0].handleListRemoveLike(data.likeInfo);
					this.handleChangeCount("like", false, 0); // 点赞数-1
				} else {
					// console.log("点赞后改变点赞列表", data)
					this.$refs['likeItem'][0].handleListDataAppend(data.likeInfo);
					this.handleChangeCount("like", true); // 点赞数+1
				}
			},
			async updateNative() {
				const { kid } = this.resourceData;
				const { repost, like, comment } = this.countList;
				let nativeData = {
					kid,
					transmitCount: repost,
					likeCount: like,
					commentCount: comment,
					likeFlag: this.likeFlag
				}
				this.$yryz.update(nativeData)
			},
			handerRewardSuccess(data) { // 打赏列表 动态插入数据
				this.$refs['rewardItem'][0].handleListDataAppend(data);
				this.handleChangeCount("reward", true); // 打赏数-1
			
			},
			handleForwardSuccess(data) { // 转发列表 动态插入数据
				this.$refs['repostItem'][0].handleListDataAppend(data);
				this.handleChangeCount("repost", true); // 转发数+1
				
				
			},
			handlecommentCountAdd() {
				this.handleChangeCount("comment", true); // 评论数+1
				
			},
			handlecommentCountDelete(num) {
				this.handleChangeCount("comment", false, num); // 评论数- num
			},
			async getCount() { // 查询计数接口
				
				let params = {
					countType: "10,11,13,14", // 评论数10，点赞数11，转发数13，打赏数14
					kid: this.resourceData.kid
				}
				const res = await this.$http.get("/services/app/v2/behavior/getCountFlag", {params});
				if (res.data.code === '200') {
					const {rewardCount, transmitCount, likeCount, commentCount, likeFlag } = res.data.data;
					
					let newCount = {
						'reward': rewardCount,
						'repost': transmitCount, // 举报 注：前端定义为repost  接口返回transmit
						'like': likeCount,
						'comment': commentCount,
					}
					this.countList = newCount;
					// console.log("old finalOption", JSON.stringify(this.finalOption));
					for (let tab of this.finalOption) {
						tab.count = newCount[tab.id];
					}
					this.likeFlag = likeFlag;
					this.rewardCount = rewardCount;
					
					// console.log("new finalOption :", JSON.stringify(this.finalOption));
				}
				
			},
		}

	}
</script>
<style>
	@import "#/css/var.css";
	.detail-action-wrap{
		-moz-user-select: none;
		-khtml-user-select: none;
		user-select: none;
		padding-bottom: 44px;
		& .action-list{
			& .detail-action-reward{
				min-height: 100px;
				margin-bottom: .2rem;
				background: #fff;
				text-align: center;
				& .hot-reward-item{
					display: inline-block;
				}
			}
			& .action-tab .tab_bar{
				border-bottom: 1px solid #ddd;
				height: 0.88rem;
				/* line-height: 44px; */
				& a{
					font-size: .28rem;
					color: var(--text-tips-color);
					border-bottom: none;
					text-align: left;
					& .tab_bar-item{
						height: 100%;
						font-weight: normal;
					}
					& .tab_bar-item.active{
						height: 100%;
						color: var(--text-primary-color);
						font-weight: bold;

						& span {
							font-weight: bold;
						}
					}
				}
				& a:last-child{
					flex: 50%;
					text-align: right;
				}
				& a:only-child{
					text-align: left;
				}
			}
			& .load_more {
				padding-bottom: .44rem;
				background: #fff;
			}
			& .load_more--end.empty{
				padding: 0;
			}
			& .message{
				background: #fff;
			}
		}
		& .action-tool{
			background: #f7f7f7;
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			height: .88rem;
			z-index: 99;
			& .action-comment_tool{
				display: flex;
				align-items: center;
				position: fixed;
				right: 0;
				bottom: 0;
				left: 0;
				height: 1.07rem;
				background: #f4f4f4;
				padding: 0 .2rem;
				& .input-view {
					display: flex;
					align-items: center;
					padding-left: .3rem;
					flex: 1;
					height: .7rem;
					border-radius: .2rem;
					background: #fff;
					font-size: .32rem;
					color: #999;
				}
			}
			&.iPhoneX_tool_bar {
				height: 1.2rem;

				& .action-comment_tool {
					padding: .7rem 0 1.1rem 0;
				}
				& .input-view {
                    margin: 0 .3rem;
				}
			}
		}
	}
	.comment-detail-fix{
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		min-height: 100vh;
		z-index: 999;
		overflow-y: scroll;
		overflow-x: hidden;
		& .comment_detail-wrap{
			min-height: 100vh;
			padding-bottom: 0;
		}
	}
</style>