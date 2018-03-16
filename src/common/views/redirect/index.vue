<!-- Author: Boring -->

<template>

</template>

<script>
export default {
	methods: {
		to404() {
			this.$eventBus.$emit('global-message', {
				type: 'notfound',
				action(app) {
					app.currentView = 'y-not-found';
				}
			});
		}
	},

	async mounted() {
		
		let {
			moduleEnum,
			} = this.$route.params;
		
		
		let module = this.$utils.getModule(moduleEnum);
		if (!module) {
			console.error(`Module ${moduleEnum} not found.`);
			return this.to404();
		}
		let linkTemplate = module.link;
		if (!linkTemplate) {
			console.error(`Module ${moduleEnum} doesn't have a link.`);
			return this.to404();
		}
		const { query  } = this.$route;
		let allParams = Object.assign({}, query, this.$route.params);
		let path = linkTemplate.replace(/(\:\w+)/g, (m) => allParams[m.substr(1)] )
		return this.$router.replace({ path, query });

	}
};
</script>