import { fetchUserInfo } from './demo/servers/api'
import { getParamFromUrl } from './core/utils'

// 提前加载数据，避免与框架、首页 bundle串行
(async () => {
	// 获取参数：url、db、登录态 token/cookie 等
	const { name } = getParamFromUrl()
	// 流程控制：串/并行
	// await fetchUserInfo(name)
	await Promise.all([
		fetchUserInfo(name),
		fetchUserInfo('Jarweb'),
	])
})()

// 目前的缺点是：
// 1、需要依赖 polyfill 包加载完
// 2、需要依赖自身 rctr 包加载完。可以 inline 到 html 中，也需要等待 polyfill 加载完