// make bluebird default Promise
Promise = require('bluebird') // eslint-disable-line no-global-assign
const express = require('express')
const config = require('./config')
const Logger = require('./loaders/logger')

const start = async () => {
  const app = express()
  // eslint-disable-next-line global-require
  await require('./loaders').init({ app })

  app.listen(config.port, err => {
    if (err) {
      Logger.error(err)
      process.exit(1)
      return
    }
    Logger.info(`
    ################################################
    🛡️  Server listening on port: ${config.port} 🛡️
    ################################################
  `)
  })
}

start()
