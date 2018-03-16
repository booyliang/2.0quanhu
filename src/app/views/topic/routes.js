export default [
	{
		path: `/topic/home/:topicId`,
		name: `topicHome`,
		component: require(`./home`),
		meta: {
			schema: '/topic/home?topicId=:topicId'
		}
	},
	{
		path: `/topic/detail/:invitationId`,
		name: `postsDetail`,
		component: require(`./detail`)
	}
]