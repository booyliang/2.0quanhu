<template>
	<div class="topic-home">
		<y-nav title="话题主页"></y-nav>
		<div class="topic-info" v-if="topicData.kid">
			<div class="topic-banner">
				<img :src="topicData.imgUrl" v-if="topicData.imgUrl" />
			</div>
			<div class="topic-text">
				<div class="title">#{{topicData.title}}#</div>
				<div class="content" v-text="topicData.content"></div>
				<div class="time">{{topicData.createDate | recentTime}}</div>
			</div>
		</div>
		<div class="invitation-label" v-if="topicData.kid">
			<span class="iconfont icon-label_line"></span>帖子</div>
		<y-flow-list :request="flowRequest" :item="invitationItem" v-if="topicData.replyCount"></y-flow-list>
		<div class="no_data" v-if="topicData.kid && !topicData.replyCount">
			<div class="no_data-img"></div>
			<p>还没有帖子，快来发帖吧~</p>
		</div>
		<!-- <div class="bottom-wrap" v-if="inApp" @click="goPost">
			<div class="publish-invitation">发表我的看法...</div>
		</div> -->
	</div>
</template>

<script>
	import InvitationItem from './components/invitation-item'
	export default {
		name: 'topic-home',
		data() {
			return {
				invitationItem: InvitationItem,
				flowRequest: {
					url: '/services/app/v2/post/list',
					params: {
						topicId: this.$route.params.topicId,
						orderBy: 'hot'
					}
				},
				topicData: {}
			}
		},

		created() {
			this.initData()
		},

		methods: {
			async initData() {
				this.$indicator.open()
				let res = null
				try {
					res = await this.$http.get(`/services/app/v2/topic/single?kid=${this.$route.params.topicId}`)
				} catch (error) {
					this.$indicator.close()
				}
				this.$indicator.close()
				if (res.data.code === '200') {
					this.topicData = res.data.data
				}
			}
		}
	}
</script>

<style>
	@import '#/css/var.css';
	.topic-home {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		/* padding-bottom: 1.06rem; */
		& .invitation-label {
			height: .6rem;
			padding: .1rem .3rem 0 .3rem;
			background: #fff;
			border-bottom: 1px solid #dddddd;
			font-size: .28rem;
			color: #a7a7a7;
			& .icon-label_line {
				margin-right: .08rem;
			}
		}

		& .no_data {
			flex: auto;
			padding: .9rem 0;
			background: #fff;
			& .no_data-img {
				width: 2.64rem;
				height: 2.4rem;
				margin: 0 auto .34rem auto;
				background-image: url(../../../common/assets/no_data@2x.png);
				background-size: 2.64rem 2.4rem;
			}
			& p {
				text-align: center;
				font-size: .28rem;
				color: var(--text-assist-color);
			}
		}

		& .bottom-wrap {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 1.06rem;
			padding: .18rem .32rem;
			background: #f7f7f7;
			& .publish-invitation {
				padding: .12rem .2rem;
				background: #fff;
				border-radius: .1rem;
				font-size: .32rem;
				color: #aaa;
			}
		}
	}

	/* 话题详情样式，单独抽出，以便帖子详情页样式复用 */

	.topic-info {
		margin-bottom: .2rem;
		background: #fff;
		& .topic-banner {
			& img {
				width: 100%;
				height: 3.36rem;
			}
		}
		& .topic-text {
			padding: .32rem .3rem .35rem .3rem;
			& .title {
				font-size: .34rem;
				font-weight: bold;
			}
			& .content {
				margin: .1rem 0 .12rem 0;
				font-size: .28rem;
				color: var(--text-assist-color);
			}
			& .time {
				text-align: right;
				font-size: .22rem;
				color: var(--text-tips-color);
			}
		}
	}
</style>