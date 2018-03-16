import Vue from 'vue'
import album from './src/main.vue'
let albumComponent = Vue.extend(album)
let albumInstance = new albumComponent({
	el: document.createElement('div')
})
export default {
	init(data, options) {
		if (options) albumInstance.swiperOptions = options;
		albumInstance.list = data;
	},
	show(index) {
		let componentEl = albumInstance.$el;
		document.body.appendChild(componentEl);
		albumInstance.swiperOptions.initialSlide = index || 0;
		albumInstance.show = true;
	},
	hide() {
		albumInstance.show = false;
	}
}