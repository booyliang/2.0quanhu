import Toast from "@/components/toast";
import Indicator from '@/components/indicator'
import Actionsheet from "@/components/actionsheet"
function install(Vue) {
	Vue.component("y-not-found", require("@/views/not-found"));
	Vue.component("y-removed", require("@/views/removed"));
	Vue.component("y-nav", require("@/components/nav/nav"));
	Vue.component("y-nav-search", require("@/components/nav/nav-search"));
	Vue.component("y-nav-toggle", require("@/components/nav/nav-toggle"));
	Vue.component("y-button", require("@/components/button/button"));
	Vue.component("y-item", require("@/components/item/item"));
	Vue.component("y-flow-list", require("@/components/flow-list/flow-list"));
	Vue.component("y-flow-detail", require("@/components/flow-detail/src/flow-detail"));
	Vue.prototype.$toast = Vue.toast = Toast;
	Vue.prototype.$actionsheet = Vue.actionsheet = Actionsheet;
	Vue.prototype.$indicator = Vue.indicator = Indicator;
}
export default install;
