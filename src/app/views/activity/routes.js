export default {
	path: `/activity`,
	component: require(`./main`),
	beforeEnter: (to, from, next) => {
		// if (from.path === '/' && ['signupIndex', 'voteIndex', 'voteDetail'].indexOf(to.name) === -1) {
		// 	let activityIndexRoute = { params: { activityId: to.params.activityId } };
		// 	activityIndexRoute.name = to.path.indexOf('signup') > -1 ? 'signupIndex' : 'voteIndex';
		// 	next(activityIndexRoute);
		// }
		next();
	},
	children: [
		// 投票活动
		{
			path: `vote/:activityId`,
			component: require(`./vote/main`),
			redirect: { name: 'voteHome' },
			children: [
				{
					path: `/`,
					component: require(`./vote/index`),
					name: `voteIndex`,  // tab 首页
					redirect: { name: 'voteHome' },
					meta: { disableForward: true },
					children: [
						{
							path: `home`,
							name: `voteHome`,  // tab 首页
							component: require(`./vote/home`),
							meta: { keepAlive: true, disableForward: true },
							beforeEnter(to, from, next) {
								if (from.name !== 'worksDetail') {
									to.meta.keepAlive = false;
									next();
									return;
								}
								to.meta.keepAlive = true;
								next();
							}
						},
						{
							path: `introduce`,
							name: `voteIntroduce`, // tab 活动简介
							component: require(`./vote/introduce`),
							meta: { disableForward: true },
						},
						{
							path: `rank`,
							name: `voteRank`,   // tab 投票排名
							component: require(`./vote/rank`),
							meta: { keepAlive: true, disableForward: true },
							beforeEnter(to, from, next) {
								if (from.name !== 'worksDetail') {
									to.meta.keepAlive = false;
									next();
									return;
								}
								to.meta.keepAlive = true;
								next();
							}
						},
						{
							path: `notice`,
							name: `voteNotice`,   // tab 中奖公告
							component: require(`./vote/notice`),
							meta: { disableForward: true },
						}
					]
				},
				{
					path: `join`,
					name: 'joinWorks',  // 投票活动 发布作品
					component: require(`./vote/join`),
					meta: { disableForward: true },
				},
				{
					path: `share/:id`,
					name: 'worksJoinShare',  // 投票活动 发布作品成功
					component: require(`./vote/share`),
					meta: { disableForward: true },
				},
				// 第三方页面
				{
					path: `prizes`,
					name: 'prizes',  // 投票活动 投票成功领奖页
					component: require(`./vote/prizes`),
					meta: { disableForward: true },
				},
				{
					path: `prizes-not`,
					name: 'prizesNot',  // 投票活动 投票成功无奖励页
					component: require(`./vote/prizes-not`),
					meta: { disableForward: true },
				}
			]
		},
		{
			path: `vote/detail/:id`,
			name: 'worksDetail',  // 投票活动 作品详情
			component: require(`./vote/detail`),
			meta: { disableForward: true },
		},
		// 报名活动
		{
			path: `signup/:activityId`,
			name: 'signup',  // 报名活动主页
			component: require(`./signup/main`),
			redirect: { name: 'signupIndex' },
			meta: { disableForward: true },
			children: [
				{
					path: `index`,
					name: 'signupIndex',  // 报名活动主页
					component: require(`./signup/index`),
					meta: { disableForward: true },
				},
				{
					path: `join`,
					name: 'signupJoin',  // 报名活动参与页
					component: require(`./signup/join.vue`),
					meta: { disableForward: true },
				},
				{
					path: `share`,
					name: 'signupJoinShare',  // 报名活动参与成功页
					component: require(`./signup/share.vue`),
					meta: { disableForward: true },
				}
			]
		}
	]
}