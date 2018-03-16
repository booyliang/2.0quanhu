import Activity from '../views/activity/routes';
import Article from '../views/article/routes';
import Topic from '../views/topic/routes';
import Dynamic from '../views/dynamic/routes';
import Share from '@app/views/share/routes';
import Coterie from '@app/views/coterie/routes';

let routes = [
	{
		path: "/empty",
		component: require("../views/empty")
	},
]
export default [Activity, Article, ...Topic, Dynamic, ...Share, ...Coterie, ...routes]