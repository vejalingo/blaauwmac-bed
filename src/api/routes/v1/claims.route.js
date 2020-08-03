const express = require('express')
const validate = require('express-validation')
const { authorize, ADMIN, LOGGED_USER } = require('../../../middlewares/auth')
const ClaimsController = require('../../../controllers/claims.controller')

const router = express.Router()

router
  .route('/:userId')
  /**
   * @api {get} api/v1/claims List Accounts
   * @apiDescription Gets Claims objects
   * @apiVersion 1.0.0
   * @apiName ListClaims
   * @apiGroup Claims
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Accounts per page
   * @apiParam  {Number}             [account_id]    Account id
   * @apiParam  {Nymber}             [class_id]      Account Class id
   * @apiParam  {String}             [class_description]       Class Description
   *
   * @apiSuccess {Object[]} claims List of accounts.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(), ClaimsController.readAll)
  .post(authorize(), ClaimsController.create)

router
  .route('/:userId/:claimId')
  .get(authorize(), ClaimsController.read)
  .put(authorize(), ClaimsController.update)
  .delete(authorize(), ClaimsController.delete)

module.exports = router
