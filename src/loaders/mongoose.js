const mongoose = require('mongoose')
const config = require('../config')
const Logger = require('./logger')

mongoose.Promise = Promise

// Exit application on error
mongoose.connection.on('error', err => {
  Logger.error(`MongoDB connection error: ${err}`)
  process.exit(-1)
})

// print mongoose logs in dev env
if (config.env === 'development') {
  mongoose.set('debug', true)
}

module.exports = async () => {
  const mongoUrl = `${config.mongo.host}:${config.mongo.port}/${config.mongo.db}`
  const connection = await mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    keepAlive: 1,
    useUnifiedTopology: true,
    auth: {
      username: config.mongo.user,
      password: config.mongo.pass
    }
  })

  return connection.connection.db
}
