const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const compress = require('compression')
const morgan = require('morgan')
const cors = require('cors')
const passport = require('passport')
const helmet = require('helmet')
const fileUpload = require('express-fileupload')
const config = require('../config')
const { jwt, facebook, google } = require('./passport')

const morganFormat = process.env.NODE_ENV !== 'production' ? 'dev' : 'combined'

const express = app => {
  // enable files upload
  app.use(
    fileUpload({
      createParentPath: true
    })
  )

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy')

  // The magic package that prevents frontend developers going nuts
  // Alternate description:
  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors())

  // Some sauce that always add since 2014
  // "Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it."
  // Maybe not needed anymore ?
  // eslint-disable-next-line global-require
  app.use(require('method-override')())

  app.use(morgan(morganFormat))

  // Middleware that transforms the raw string of req.body into json
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))

  app.use(cookieParser())
  app.use(compress())

  // secure apps by setting various HTTP headers
  app.use(helmet())

  // enable authentication
  app.use(passport.initialize())
  passport.use('jwt', jwt)
  passport.use('facebook', facebook)
  passport.use('google', google)

  // eslint-disable-next-line global-require
  app.use(config.api.prefix, require('../api/routes/v1'))

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
  })

  // error handlers
  app.use((err, req, res, next) => {
    /**
     * Handle 401 thrown by express-jwt library
     */
    if (err.name === 'UnauthorizedError') {
      return res
        .status(err.status)
        .send({ message: err.message })
        .end()
    }
    return next(err)
  })
  app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.json({
      errors: {
        message: err.message
      }
    })
  })
}

module.exports = express
