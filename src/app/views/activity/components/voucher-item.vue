<template>
	<div class="voucher-wrap">
		<div class="volume" :class="{'ticket_over': data.issueNum === 0}">
			<div class="volume_left">
				<p class="ticket_type">
					<span class="prizes_name" v-text="data.prizesName"></span>
					<span class="only_code" v-if="data.onlyCode" v-text="data.onlyCode"></span>
				</p>
				<p class="ticket_date" v-text="prizesTime"></p>
				<div class="prizes_remark">
					<div>
						<span v-text="data.remark" :class="isShowInfo ? '' : 'show_more_remark'" ref="remark"></span>
						<span v-if="showMore" class="iconfont" :class="isShowInfo ? 'icon-uparrow_solid' : 'icon-downarrow_solid'" @click="showRemark"></span>
					</div>
				</div>
			</div>
			<div class="divider">
				<div class="round_top"></div>
				<div class="line"></div>
				<div class="round_bottom"></div>
			</div>
			<div class="volume_right">
				<p v-text="data.prizesNum + data.prizesUnit" class="ticket_num"></p>
				<p class="ticket_btn">{{data.status ? data.status : '可使用'}}</p>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'voucher-item',
	props: {
		data: {
			type: Object,
			require: true
		},
		showTxt: {
			type: String,
			default: ''
		}
	},
	computed: {
		prizesTime() {
			return this.transformTime(this.data.beginTime) + ' 至 ' + this.transformTime(this.data.endTime);
		}
	},
	data() {
		return {
			isShowInfo: false,
			showMore: false,
		}
	},
	mounted() {
		console.log('data', this.data)
		if (this.isEllipsis(this.$refs.remark)) {
			this.showMore = true;
		}
	},
	methods: {
		transformTime(time) {
			let date = new Date(time);
			return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
		},
		showRemark() {
			this.isShowInfo = !this.isShowInfo;
		},
		isEllipsis(dom) {
			var checkDom = dom.cloneNode(), parent, flag;
			checkDom.style.width = dom.offsetWidth + 'px';
			checkDom.style.height = dom.offsetHeight + 'px';
			checkDom.style.overflow = 'auto';
			checkDom.style.position = 'absolute';
			checkDom.style.zIndex = -1;
			checkDom.style.opacity = 0;
			checkDom.style.whiteSpace = "nowrap";
			checkDom.innerHTML = dom.innerHTML;

			parent = dom.parentNode;
			parent.appendChild(checkDom);
			flag = checkDom.scrollWidth > checkDom.offsetWidth;
			parent.removeChild(checkDom);
			return flag;
		}
	}
}
</script>

<style>
.voucher-wrap {
	& .volume {
		& .prizes_remark>div {
			display: flex;
			justify-content: space-between;
		}
	}
	& .show_more_remark {
		width: calc(100% - .4rem);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}
</style>
