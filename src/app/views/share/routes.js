import Register from './register'
import Success from './success'
export default [
	{ 
		path: '/share-register',
		component: Register,
		name: 'shareRegister',
		meta: {
			disableForward: true
		}
	},
	{
		path: '/share-register-success',
		component: Success,
		name: 'shareRegisterSuccess',
		meta: {
			disableForward: true
		}
	}
]