const expressLoader = require('./express')
const mongooseLoader = require('./mongoose')
const Logger = require('./logger')

const Loaders = {}

Loaders.init = async ({ app }) => {
  await expressLoader(app)
  Logger.info('✌️ Express loaded')

  await mongooseLoader()
  Logger.info('✌️ Mongoose loaded')
}

module.exports = Loaders
