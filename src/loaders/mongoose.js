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
  // const mongoUrl = `${config.mongo.host}:${config.mongo.port}/${config.mongo.db}`
  const mongoUrl = `mongodb://veli:IsVXjiqkULutuT3b@cluster0-shard-00-00.imkph.mongodb.net:27017,cluster0-shard-00-01.imkph.mongodb.net:27017,cluster0-shard-00-02.imkph.mongodb.net:27017/blaau?replicaSet=atlas-nvkbw3-shard-0&ssl=true&authSource=admin`
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
  
  // const connection = await mongoose.connect(mongoUrl, options, (err) => console.log("Error Connecting...", err))
  
  const connection = await mongoose.connect(mongoUrl)
  
  console.log("connection.connection.db...", connection.connection)

  return connection.connection.db
}
