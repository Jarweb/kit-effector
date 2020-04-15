import { createStore, createEvent } from 'effector'
import { appContext } from '../../core/appContext';

const initialState = {
	count: 0
}

export const counter = createStore(initialState.count)
export const incre = createEvent<number>('incre')
export const decre = createEvent<number>('decre')
export const reset = createEvent('rest')

counter.on(incre, (state, payload: number) => state + payload)
counter.on(decre, (state, payload: number) => {
	appContext.ready('reportSdk')
		.then((reportSdk: any) => {
			reportSdk.push()
		})
	
	return state - payload
})
counter.reset(reset)