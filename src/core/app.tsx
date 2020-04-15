import React, { Suspense, ReactNode } from 'react'
import ReactDOM from 'react-dom'
import { Router, Switch, Route, Redirect } from 'react-router-dom'
import { createHashHistory, createBrowserHistory } from 'history'
import ErrorBoundary from './ErrorBoundle'
import EventEmitter from './event'
import { appContextEvent } from './appContext'
import useUnmount from './useUnmount';
import errorCtr from './plugin-errorControl'

interface AppConfig {
	appMode: 'spa' | 'mpa',
	routerMode: 'hashRouter' | 'historyRouter'
	pageLoading?: NonNullable<ReactNode> | null,
	pageNotFound?: React.ReactNode,
	pageForbidden?: React.ReactNode,
	pageNetworkError?: React.ReactNode,
	pageServerError?: React.ReactNode,
	pageComponent?: React.ReactNode
}

interface Plugin {
	name: string,
	plugin: (ctx: any) => void,
}

class Application extends EventEmitter {
	private plugins: Plugin[] = []
	private onReadyPlugins: string[] = []
	private cleanup: any[] = []
	private routers = []
	private ctx: any = {}
	private appConfig: AppConfig = {
		appMode: 'spa',
		routerMode: 'hashRouter'
	}

	public constructor(options?: AppConfig) {
		super()
		this.configApp(options)
		this.plugins.push({
			name: 'errorController',
			plugin: errorCtr
		})
	}

	public configApp = (options?: AppConfig) => {
		this.appConfig = {
			...this.appConfig,
			...options
		}
	}

	public configRoutes = (routesMap: any) => {
		this.routers = routesMap
	}

	private createHistory = () => {
		if (this.appConfig.routerMode === 'historyRouter') {
			return createBrowserHistory()
		}
		if (this.appConfig.routerMode === 'hashRouter') {
			return createHashHistory()
		}
		throw new Error('routerMode error')
	}

	private renderSpa = () => {
		useUnmount(() => {
			this.off('_error')
		})

		return (
			<ErrorBoundary onCatch={this.catchComponentError}>
				<Router history={this.createHistory()}>
					<Suspense fallback={this.appConfig.pageLoading || null}>
						<Switch>
							{this.routers.map(({ ...props }: any, index: number) => (
									<Route
										{...props}
										component={props.component}
										key={(props.path + index) as string}
									/>
							))}
							<Redirect from="*" to="/404" />
						</Switch>
					</Suspense>
				</Router>
			</ErrorBoundary>
    )
	}
	
	private renderMpa = () => {
		useUnmount(() => {
			this.off('_error')
		})

		return (
			<ErrorBoundary onCatch={this.catchComponentError}>
				{this.appConfig.pageComponent}
			</ErrorBoundary>
		)
	}

	public use = (name: string, cb: (ctx: any) => void) => {
		this.plugins.push({
			name: name, 
			plugin: cb,
		})
	}

	public pluginReady = (name: string) => {
		return new Promise((resolve, reject) => {
			if (this.ctx[name]) {
				resolve(this.ctx[name])
			}
			else {
				if (this.onReadyPlugins.indexOf(name) === -1) {
					appContextEvent.on('_ctx_change_', (ctx: any) => {
						ctx[name] && resolve(ctx[name])
					})
					this.onReadyPlugins.push(name)
				}
			}
		})
	}

  public render = (root: HTMLElement | null) => {
		if (!root) return

		this.ctx.routers = this.routers
		this.ctx.appConfig = this.appConfig
		this.ctx.emit = this.emit
		this.ctx.on = this.on
		this.ctx.once = this.once
		this.ctx.off = this.off
		this.ctx.ready = this.pluginReady
		this.ctx.plugins = this.plugins
		
		this.plugins.forEach(async (item: Plugin) => {
			try {
				const sdk = await item.plugin(this.ctx)
				this.ctx[item.name] = sdk
				this.onReadyPlugins.push(item.name)
				appContextEvent.emit('_ctx_change_', this.ctx)
			} catch (error) {
				console.error(item.name, 'error')
			}
		})

		const App = this.appConfig.appMode === 'spa' 
			? this.renderSpa 
			: this.renderMpa

		ReactDOM.render(
			<React.StrictMode>
				<App />
			</React.StrictMode>
			, root
		)
	}

	public onComponentError = (cb: (error: Error, ctx: any) => void) => {
		this.on('_error', (err: any) => {
			cb(err, this.ctx)
		})
	} 

	public catchComponentError = (err: Error) => {
		this.emit('_error', err)
	}
}

export default Application