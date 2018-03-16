import DialogVue from './dialog.vue';
import Popup from '@/components/popup/popup.js';
import Vue from 'vue';

class Dialog extends Popup {
	constructor(content, options) {
		if (typeof content === 'string') {
			content = {
				message: content
			}
		}

		super(DialogVue, {
			...content,
			options
		});
	}

	_open(type, content, options) {
		return new Promise((resolve, reject) => {
			let data = {
				type,
				resolve,
			};

			if (type === 'confirm') {
				data.reject = reject;
			}

			this.setData(data);
			this.open();
		});
	}

	static alert(content, options) {
		let dialog = new Dialog(content, options);
		return dialog._open('alert', content, options);
	}

	static confirm(content, options) {
		let dialog = new Dialog(content, options);
		return dialog._open('confirm', content, options);
	}
}

Vue.Dialog = Vue.prototype.$dialog = Dialog;

export default Dialog;