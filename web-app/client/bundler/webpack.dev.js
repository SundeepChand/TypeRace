const { merge } = require('webpack-merge')
const commonConfiguration = require('./webpack.common.js')
const portFinderSync = require('portfinder-sync')
const { DefinePlugin } = require('webpack')

const infoColor = (_message) => {
  return `\u001b[1m\u001b[34m${_message}\u001b[39m\u001b[22m`
}

module.exports = merge(
  commonConfiguration,
  {
    mode: 'development',
    plugins: [
      new DefinePlugin({
        API_URL: JSON.stringify('http://localhost:3001')
      })
    ],
    devServer:
    {
      host: 'localhost',
      port: portFinderSync.getPort(8080),
      static: {
        directory: './dist',
        watch: true,
        serveIndex: true,
      },
      open: true,
      https: false,
      allowedHosts: 'all',
      client: {
        overlay: true,
      },
      onAfterSetupMiddleware: function (devServer) {
        const port = devServer.options.port
        const serverType = devServer.options.server.type
        const domain1 = `${serverType}://localhost:${port}`

        console.log(`Project running at:\n  - ${infoColor(domain1)}`)
      }
    }
  }
)
