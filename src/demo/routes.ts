import { lazy } from 'react'

export default [
	{
		path: '/',
		exact: true,
		title: 'page 示例',
		component: lazy(() => import('./app'))
	},
	{
		path: '/404',
		title: '404',
		component: lazy(() => import('./components/404'))
	},
	{
		path: '/403',
		title: '403',
		component: lazy(() => import('./components/403'))
	},
]