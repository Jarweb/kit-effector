import * as cache from './fetchCache'
import 'isomorphic-fetch'

const fetcher = (url: string, options?: { cache?: boolean, expiredAge?: number }) => {
	return new Promise((resolve, reject) => {
		const req = new Request(url, { keepalive: true })
		const cacheKey = req.url

		const rejectFn = (error: Error | string) => {
			if (req.method === 'GET' && options?.cache) {
				cache.removeRequestCache(cacheKey)
			}
			reject(error)
		}

		const resovleFn = (res: any) => {
			if (req.method === 'GET' && options?.cache) {
				cache.setRequestCache(cacheKey, res)
			}
			resolve(res)
		}

		const f = () => {
			if (req.method === 'GET' && options?.cache) {
				cache.pendingRequestCache(cacheKey, options?.expiredAge)
			}

			fetch(req)
				.then(res => {
					if (!res.ok) {
						rejectFn(res.statusText)
					}
					else {
						return res.json()
					}
				})
				.then(res => resovleFn(res))
				.catch(error => rejectFn(error))
		}

		const resCache = cache.getRequestCache(cacheKey)

		if (resCache) {
			if (resCache.status === 'pending') return
			resolve(resCache.value)
		}
		else {
			f()
		}
	})
}

export default fetcher