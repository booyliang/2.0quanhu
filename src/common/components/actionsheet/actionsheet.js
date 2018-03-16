import ActionsheetVue from './actionsheet.vue';
import Popup from '@/components/popup/popup.js';
import Vue from 'vue';

class Actionsheet extends Popup {
	constructor(actions, options) {
		super(ActionsheetVue, {
			actions,
			options
		});
	}
}

const actionsheetApi = (actions, options) => {
	new Actionsheet(actions, options).open();
};

export default actionsheetApi;