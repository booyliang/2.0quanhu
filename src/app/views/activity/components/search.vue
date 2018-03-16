<template>
	<y-item class="activity_search_wrap" :class="$env.specialDeviceName + '_search'">
		<div slot="body">
			<div class="input_container">
				<span class="iconfont icon-search_line"></span>
				<y-input v-model="searchValue" type="number" :min="1" :maxlength="10" placeholder="请输入参赛编号" :show-text-length-info="false"></y-input>
			</div>
			<span v-if="searchValue" @click="clearInput" class="iconfont icon-close_solid"></span>
		</div>
		<div slot="foot" class="search_button" @click="search">搜索</div>
	</y-item>
</template>
<script>
import YItem from '@/components/item'
import YInput from '@/components/input'
export default {
	components: {
		YItem, YInput,
	},
	data() {
		return {
			searchValue: ''
		}
	},
	methods: {
		search() {
			this.$emit('search', this.searchValue);
		},
		clearInput() {
			this.searchValue = '';
		}
	}
}
</script>

<style>
@import "#/css/var.css";
.activity_search_wrap {
	/* background: #F8F8F8; */
	position: fixed;
	/* position: -webkit-sticky; */
	top: 2.16rem;
	width: 100%;
	height: .96rem;
	z-index: 9;
	& .item-wrap {
		padding: .2rem .16rem;
		border: none;
		/* position: relative;
		top: .2em; */
	}
	& .item-body {
		position: relative;
		background-color: #F5F5F5;
		border-radius: .5rem;
		padding: 0 .3rem;
		margin-right: .24rem;
		&>div {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		& .input_container {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			width: 100%;
		}

		& .icon-search_line {
			color: #999;
		}
		& .clear {
			font-size: .28px;
			color: #bfbfbf;
		}
		& .y-input {
			width: 100%;
			margin-left: .2rem;
			background-color: transparent;
			& input {
				font-size: .28rem;
				padding: 0.1rem 0;				
			}
		}
		& .icon-close_solid {
			color: #999;
			font-size: .28rem;
		}
	}
	& .item-foot {
		&>div {
			color: var(--theme-color);
			font-size: .3rem;
		}
	}
}
.iPhoneX_search {
	top: 2.4rem;
}
</style>
