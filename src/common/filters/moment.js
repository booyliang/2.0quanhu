
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

export default function (value, fmt) {	
	if (!value) return "";	
	fmt = fmt || 'YYYY-MM-DD'	
	return moment(value, moment.ISO_8601 ).format(fmt)
}
// console.log(moment(new Date()).format('LLL'))