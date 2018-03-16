<template>
	<page-panel class="share_register_success">
		<img slot="cover" src="../../assets/banner-register_success.jpg">
		<p class="info">
			积分已发放到<em>{{ phone }}</em>账户，<br>
			请立即下载圈乎APP去使用积分！<br>
			更有惊喜大奖等您拿！
		</p>
		<y-button block @click.native="onDownload">下载圈乎APP</y-button>
	</page-panel>
</template>
<script>
	import AppConfig from '@/config/app'
	import PagePanel from './components/page-panel'
	export default {
		name: 'register-success',
		components: {
			PagePanel
		},
		data() {
			return {
				phone: ''
			}
		},
		methods: {
			onDownload() {
				window.location.href = AppConfig.DOWNLOAD_APP_URL;
			}
		},
		mounted() {
			let phone = sessionStorage.getItem('inviter-register-phone');
			if (!phone) {
				this.$router.replace({name: 'shareRegister'});
			}
			this.phone = phone;
		}
	}
</script>
<style>
	@import "#/css/var.css";
	.share_register_success {
		& .info {
			margin-top: .8rem;
			line-height: .76rem;
			font-size: .36rem;
			color: var(--text-assist-color);
			text-align: center;
			& em {
				color: #349dff;
				padding: 0 .1rem;
				font-size: .34rem;
			}
		}
		& .button--block {
			margin: .8rem 0 0;
			max-width: none;
			border-radius: 2.5em;
		}
	}
</style>