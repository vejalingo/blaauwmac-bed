const mongoose = require('mongoose')
const config = require('../config')
const Logger = require('./logger')

mongoose.Promise = Promise

// Exit application on error
mongoose.connection.on('error', err => {
  Logger.error(`MongoDB connection error: ${err}`)
  process.exit(-1)
})

if (config.env === 'development') {
  mongoose.set('debug', true)
}

module.exports = async () => {
  // :${config.mongo.port}
  const mongoUrl = `${config.mongo.host}/${config.mongo.db}?retryWrites=true&w=majority`
  const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    keepAlive: 1,
    useUnifiedTopology: true,
    auth: {
      username: config.mongo.user,
      password: config.mongo.pass
    }
  }
  
  const connection = await mongoose.connect(mongoUrl, options, (err) => console.log("Error Connecting...", err))
  
  console.log("connection.connection.db...", connection.connection)

  return connection.connection.db
}
