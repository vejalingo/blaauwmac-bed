const dotenv = require('dotenv')
const Joi = require('@hapi/joi')

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const envFound = dotenv.config()
if (!envFound) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️")
}

const schema = Joi.object({
  NODE_ENV: Joi.string()
    // .allow(['development', 'production', 'test', 'staging'])
    .default('development'),
  PORT: Joi.number().default(3000),
  LOG_LEVEL: Joi.string().required(),
  MONGOOSE_DEBUG: Joi.boolean().when('NODE_ENV', {
    is: Joi.string().equal('development'),
    then: Joi.boolean().default(true),
    otherwise: Joi.boolean().default(false)
  }),
  JWT_SECRET: Joi.string()
    .required()
    .description('JWT Secret required to sign'),
  JWT_EXPIRATION_MINUTES: Joi.string().required(),
  MONGO_HOST: Joi.string()
    .required()
    .description('Mongo DB host url'),
  MONGO_PORT: Joi.number().default(27017),
  MONGO_DB: Joi.string()
    .required()
    .description(' Mongo DB database name'),
  MONGO_USER: Joi.string(),
  MONGO_PASS: Joi.string()
})
  .unknown()
  .required()

const { error, value: envVars } = schema.validate(envFound.parsed)
if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const config = {
  env: envVars.NODE_ENV,
  port: process.env.PORT || envVars.PORT,
  jwtSecret: envVars.JWT_SECRET,
  jwtExpirationInterval: envVars.JWT_EXPIRATION_MINUTES,
  mongo: {
    db: envVars.MONGO_DB,
    host: envVars.MONGO_HOST,
    port: envVars.MONGO_PORT,
    user: envVars.MONGO_USER,
    pass: envVars.MONGO_PASS
  },
  logs: {
    level: envVars.LOG_LEVEL || 'silly'
  },
  api: {
    prefix: '/api/v1',
    cem: '/api/v1/cem'
  },
  elk: {
    user: process.env.ELK_USER,
    pass: process.env.ELK_PASS,
    url: process.env.ELK_URL
  }
}

module.exports = config
