import { createStore, createEvent, createEffect } from 'effector'
import { fetchUserInfo } from '../servers/api'

interface State {
	loading: boolean,
	error: Error | null,
	lists: any[]
}

const initialState: State = {
	loading: false,
	error: null,
	lists: []
}

export const userinfo = createStore(initialState)
export const fetchData = createEvent('fetch')
const asyncFetch = createEffect('userinfo', { 
	handler: (params: {name: string}) => fetchUserInfo(params.name) 
})

userinfo.on(fetchData, (state) => {
	if (state.loading) return

	asyncFetch({
		name: 'Jarweb',
	})
})
userinfo.on(asyncFetch.pending, (state, pending) => {
	return {
		...state,
		loading: pending,
	}
})
userinfo.on(asyncFetch.fail, (state, { error }) => {
	return {
		...state,
		error: error,
	}
})
userinfo.on(asyncFetch.done, (state, { result }) => {
	return {
		loading: state.loading,
		error: null,
		lists: [...result]
	}
})


