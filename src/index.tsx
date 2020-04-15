import Wolverine from './core/app'
import routes from './demo/routes'

const app = new Wolverine({
  appMode: 'spa',
  routerMode: 'hashRouter'
})

// config routes
app.configRoutes(routes)

// catch components error
app.onComponentError((error, ctx) => {
  console.log(error)
})

// add plugins: sync/async
app.use('reportSdk', (ctx) => {
  return new Promise((resolve, reject) => {
    return import(
      /* webpackChunkName: 'report' */
      './demo/plugins/sdkreport'
    ).then(({ default: report }) => {
      setTimeout(() => {
        resolve(report)
      }, 10000);
    })
  })
})

app.use('absdk', (ctx) => {
  return import(
    /* webpackChunkName: 'absdk' */
    './demo/plugins/sdkab'
  ).then(({ default: ab }) => {
    return ab
  })
})

app.use('wxsdk', (ctx) => {
  return import(
    /* webpackChunkName: 'wxsdk' */
    './demo/plugins/sdkwx'
  ).then(({ default: wx }) => {
    return wx
  })
})

// render to dom root
app.render(document.getElementById('root'))