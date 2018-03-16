export default [
	{
		path: `/coterie/:coterieId`,
		name: `coterieIndex`,
		component: require(`./index`),
		meta: {
			schema: '/coterie/home?coterieId=:coterieId'
		}
	},
	{
		path: `/coterie/:coterieId/article/detail/:articleId`,
		name: `coterieArticleDetail`,
		component: require(`./article/detail`)
	},
	{
		path: `/coterie/:coterieId/question/detail/:questionId`,
		name: `coterieQuestionDetail`,
		component: require(`./question/detail`)
	}
]