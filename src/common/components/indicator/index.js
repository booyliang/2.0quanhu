import Vue from 'vue';

const Indicator = Vue.extend(require('./src/indicator.vue'));
let instance;

export default {
	open(options = {}) {
		if (!instance) {
			instance = new Indicator({
				el: document.createElement('div')
			});
		}
		// instance.message = 'loading...';
		if (instance.opened) return;
		if ((typeof options === 'string' && options) || options.text) {
			instance.message = typeof options === 'string' ? options : options.text;
		}
		document.body.appendChild(instance.$el);

		Vue.nextTick(() => {
			instance.opened = true;
		});
	},

	close() {
		if (instance) {
			instance.opened = false;
		}
	}
};