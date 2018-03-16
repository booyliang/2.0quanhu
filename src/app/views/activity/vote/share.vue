<template>
	<div class="activity_share_guide_wrap" v-if="data">
		<y-nav :title="data.activityTitle" :showLeftArrow="inApp"></y-nav>
		<div class="content">
			<img :src="data.coverPlan | imageResize('600_600')" alt="" @click="picturePreview">
			<div v-if="inApp" v-text="data.user.userNickName" class="nickName"></div>
		</div>
		<div class="guide-success">
			<div class="iconfont icon-hook_solid"></div>
			<p>{{inApp ? `发布成功` : `参与成功`}}</p>
		</div>
		<div v-if="inApp" class="trip_text">
			<p>您已参加</p>
			<div class="triangle_arrow"></div>
			<div class="activity_title" v-text="data.activityTitle"></div>
		</div>
		<div class="guide_share" v-if="inApp">
			<p>赶快分享给朋友为自己拉票<span v-if="prizesFlag">，<i>丰厚奖品</i>等你拿</span>！</p>
			<share :data="shareData"></share>
		</div>
		<div class="guide_share" v-else>
			<div class="share_trip">
				<p>赶快分享给朋友为自己拉票，</p>
				<p> 丰厚奖品等你拿！</p>
			</div>
			<div class="share_down">
				<span @click.stop="toHome">分享我的发布</span>
				<span @click.stop="downloadApp">下载APP</span>
			</div>
		</div>
	</div>
</template>
<script>
import Share from '../components/share'
import Mixin from '../mixins';
export default {
	mixins: [Mixin],
	components: {
		[Share.name]: Share,
	},
	computed: {
		voteCount() {
			return this.data.voteCount + '票';
		}
	},
	data() {
		return {
			inApp: !!this.$yryz.isNative(),
			data: null,
			prizesFlag: false,
			shareData: null,
		}
	},
	created() {
		if (!this.inApp && !this.$env.userId) {
			let {activityId} = this.$route.params;
			this.$router.replace({ name: 'voteIndex', params: { activityId, } });
		}
	},
	async mounted() {
		let params = {
			activityInfoId: this.$route.params.activityId,
			candidateId: this.$route.params.id,
			otherFlag: this.inApp ? 0 : 1,
		}
		let res = await this.$http.get(`/services/app/v2/activity/candidate/detail`, { params })
		let resData = res.data;
		if (resData.code !== '200') return;
		this.data = resData.data;
		if (resData.data.obtainIntegral)
			this.$toast(`您通过参与活动获得${resData.data.obtainIntegral}积分`)

		let content = this.data.content || this.data.content1 || this.data.content2 || '';
		let shareInfo = {
			kid: resData.data.kid,
			title: resData.data.activityTitle,
			content,
			coverPlanUrl: resData.data.coverPlan,
			url: `${location.origin}/activity/vote/detail/${resData.data.kid}`
		}
		this.shareData = Object.assign(this.data, shareInfo);
		//
		if (!this.inApp) {
			document.title = '参与成功';
			return;
		}
		//
		let activityData = this.$attrs['activity-data'];
		this.prizesFlag = activityData.prizesFlag === 11;
	},
	methods: {
		picturePreview() {
			if (!this.inApp) return;
			let imgs = [this.data.coverPlan]
			this.$yryz.picturePreview({
				imageUrls: imgs,
				currentIndex: 1
			})
		},
		toHome() {
			let params = this.$route.params;
			this.$router.replace({ name: 'worksDetail', params });
		}
	}
}
</script>
<style>
@import '#/css/var.css';
.activity_share_guide_wrap {
	min-height: 100vh;
	background-color: #fff;
	& .content {
		position: relative;
		height: 6rem;
		width: 6rem;
		margin: 0.3rem auto 0;
		overflow: hidden;
		& .nickName {
			position: absolute;
			bottom: 0;
			background-color: rgba(0, 0, 0, .5);
			color: #FFF;
			text-align: center;
			width: 100%;
			padding: .15rem 0;
			font-size: .36rem;
		}
	}
	& .guide-success {
		text-align: center;
		color: #FFD460;
		margin-top: .4rem;
		& .iconfont {
			font-size: .7rem;
		}
		& p {
			font-size: .36rem;
			font-weight: bold;
		}
	}
	& .trip_text {
		text-align: center;
		color: #666;
		font-size: .3rem;
		margin: .3rem 0;

		& .triangle_arrow {
			width: 0px;
			height: 0px;

			border-right: .27rem solid rgba(0,0,0,0);
			border-bottom: .18rem solid #f4f4f4;
			border-left: .27rem solid rgba(0,0,0,0);
			margin: 0 auto;
		}
		& .activity_title {
			display: inline-block;
			color: #000;
			font-size: .38rem;
			font-weight: bold;
			background-color: #F4F4F4;
			padding: .2rem;
			border-radius: .1rem;
		}
	}
	& .guide_share {
		text-align: center;
		margin-top: .4rem;
		padding-bottom: .4rem;
		&>p {
			margin: .2rem 0;
			color: #666;
			& span {
				display: inline-block;
			}
			& i {
				color: var(--theme-color);
			}
		}
		& .share_trip {
			color: #000;
			& p {
				line-height: 1.6;
			}
		}
		& .share_down {
			padding-bottom: .3rem;
			& span {
				display: inline-block;
				font-size: .28rem;
				margin: .6rem .35rem 0;
				width: 2.6rem;
				height: .68rem;
				line-height: .68rem;
				color: #3f8cff;
				border: 1px solid #3f8cff;
				border-radius: .1rem;
			}
			& span:last-child {
				color: #fff;
				background-color: #3f8cff;
			}
		}
	}
}
</style>

