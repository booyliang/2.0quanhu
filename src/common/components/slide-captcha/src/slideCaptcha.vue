<template>
  <div :id="DOMId" class="slide_captcha"></div>
</template>
<script>
	const aliNcH5ScriptPath = '//g.alicdn.com/sd/nch5/index.js?t=1512615933302';
	const nc_appkey =  'FFFF000000000178AFC0'; // 应用标识,不可更改
	const nc_scene = 'activity_h5';  // 场景,不可更改
	const nc_token = [nc_appkey, (new Date()).getTime(), Math.random()].join(':');
	const aliNcScriptId = 'alincScript';
	const aliNcDomId = '_umfp';
	const aliNcDomStyleObj = {
		display: "inline",
		width: "1px",
		height: "1px",
		overflow: "hidden"
	}
	export default {
		name: 'y-slide-captcha',
		data() {
			return {
				DOMId: 'slideCaptcha-1',
				scriptTagLoaded: false,
				ncOptions: {
					renderTo: '',
					appkey: nc_appkey, 
					scene: nc_scene,
					token: nc_token,
					callback: this.callbackFn,
					error: this.errorFn,
					verifycallback: this.verifycallbackFn
				}
			}
		},
		methods: {
			insertDOMAndScript() {
				let scriptTag = document.getElementById(aliNcScriptId);
				let aliNcDomTag = document.getElementById(aliNcDomId);
				if (aliNcDomTag === null) {
					aliNcDomTag = document.createElement('div');
					aliNcDomTag.id = aliNcDomId;
					for (let styleKey in aliNcDomStyleObj) {
						aliNcDomTag.style[styleKey] = aliNcDomStyleObj[styleKey];
					}
					document.body.appendChild(aliNcDomTag);
				}
				if (scriptTag === null) {
					scriptTag = document.createElement('script');
					scriptTag.type = 'text/javascript';
					scriptTag.src = aliNcH5ScriptPath;
					scriptTag.id = aliNcScriptId;
					let head = document.getElementsByTagName('head')[0];
					head.appendChild(scriptTag);
					scriptTag.addEventListener('load', () => {
						this.scriptTagLoaded = true;
						this.init();
					});
				} else if (this.scriptTagLoaded) {
					this.init();
				}
			},
			callbackFn(data) {
				const { csessionid, sig } = data;

				this.$emit('success', {
					sig,
					session: csessionid,
					scene: nc_scene,
					token: nc_token
				});
			},
			verifycallbackFn(data) {
				this.$emit('verifycallback', data);
			},
			errorFn(errorMsg) {
				this.$emit('error', errorMsg);
			},
			init() {
				if (!this.scriptTagLoaded) {
					this.insertDOMAndScript();
					return false;
				};
				this.DOMId = 'slideCaptcha-1';
				this.ncOptions.renderTo = `#${this.DOMId}`;
				window.NoCaptcha.init(this.ncOptions);
				window.NoCaptcha.setEnabled(true);
			},
			reset() {
				window.NoCaptcha.reset();
			}
		},
		created() {
			this.insertDOMAndScript();
		}
	}
</script>
<style>
	.slide_captcha {
		& ._nc .stage {
			padding: 0;
			& .slider {
				left: 0;
				right: 0;
			}
		}
	}
</style>

