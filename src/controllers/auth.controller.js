const httpStatus = require('http-status')
const moment = require('moment-timezone')
const { omit } = require('lodash')
const User = require('../models/user.model')
const RefreshToken = require('../models/refreshToken.model')
const config = require('../config')

/**
 * Returns a formated object with tokens
 * @private
 */
function generateTokenResponse(user, accessToken) {
  const tokenType = 'Bearer'

  // FIXME: Below Method is buggy, Investigate 👀
  const refreshToken = RefreshToken.schema.statics.generate(user)

  const expiresIn = moment().add(config.jwtExpirationInterval, 'minutes')
  return {
    tokenType,
    accessToken,
    refreshToken: refreshToken.token,
    expiresIn
  }
}

/**
 * Returns jwt token if registration was successful
 * @public
 */
exports.register = async (req, res, next) => {
  try {
    const userData = omit(req.body, 'role')
    const user = await new User(userData).save()
    const userTransformed = user.transform()
    const token = generateTokenResponse(user, user.token())
    res.status(httpStatus.CREATED)
    return res.json({ token, user: userTransformed })
  } catch (error) {
    return next(User.checkDuplicateEmail(error))
  }
}

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
exports.login = async (req, res, next) => {
  try {
    const { user, accessToken } = await User.findAndGenerateToken(req.body)
    const token = generateTokenResponse(user, accessToken)
    const userTransformed = user.transform()
    return res.json({ token, user: userTransformed })
  } catch (error) {
    return next(error)
  }
}

/**
 * login with an existing user or creates a new one if valid accessToken token
 * Returns jwt token
 * @public
 */
exports.oAuth = async (req, res, next) => {
  try {
    const { user } = req
    const accessToken = user.token()
    const token = generateTokenResponse(user, accessToken)
    const userTransformed = user.transform()
    return res.json({ token, user: userTransformed })
  } catch (error) {
    return next(error)
  }
}

/**
 * Returns a new jwt when given a valid refresh token
 * @public
 */
exports.refresh = async (req, res, next) => {
  try {
    const { email, refreshToken } = req.body
    const refreshObject = await RefreshToken.findOneAndRemove({
      userEmail: email,
      token: refreshToken
    })
    const { user, accessToken } = await User.findAndGenerateToken({
      email,
      refreshObject
    })
    const response = generateTokenResponse(user, accessToken)
    return res.json(response)
  } catch (error) {
    return next(error)
  }
}
