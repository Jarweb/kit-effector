import fetcher from '../../core/fetcher'

export const fetchUserInfo = (name: string): Promise<any> | void => {
	return fetcher(`https://api.github.com/users/${name}/repos`, {cache: true})
}