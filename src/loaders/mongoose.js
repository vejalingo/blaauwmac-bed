const mongoose = require('mongoose');
const config = require('../config');
const Logger = require('./logger');

mongoose.Promise = Promise

// Exit application on error
mongoose.connection.on('error', err => {
  console.log("----Encountered Error Connecting-----", err);
  Logger.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
})

if (config.env === 'development') {
  mongoose.set('debug', true);
}

module.exports = async () => {
  // ?retryWrites=true&w=majority
  const mongoUrl = `${config.mongo.host}:${config.mongo.port}/${config.mongo.db}`
  const options = {
    useNewUrlParser: true,
     useUnifiedTopology: true,
    // useCreateIndex: true,
    // keepAlive: 1,
    auth: {
      username: config.mongo.user,
      password: config.mongo.pass
    }
  }
  
  const connection = await mongoose.connect(mongoUrl, options, (err) => console.log("Error Connecting...", err))
  
  console.log("connection.connection.db...", connection.connection)

  return connection.connection.db
}
