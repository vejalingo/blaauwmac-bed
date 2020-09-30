const httpStatus = require('http-status')
const mongoose = require('mongoose')

/* eslint-disable camelcase */
const ClaimsModel = require('../models/claims.model')

exports.read = async (req, res, next) => {
  try {
    const { claimId, userId } = req.params
    const data = await ClaimsModel.find({ user_id: userId, _id: claimId })

    res.status(httpStatus.OK).json({
      data
    })
  } catch (error) {
    next(error)
  }
}

exports.readAll = async (req, res, next) => {
  try {
    const {
      params: { userId },
      query
    } = req

    let searchQuery = { user_id: userId }
    if (typeof query.claim_number !== 'undefined') {
      searchQuery = { ...searchQuery, claim_number: query.claim_number }
    }

    const data = await ClaimsModel.find(searchQuery)
    const dashboardData = data
      .map(item => {
        return {
          name: item.policy_section,
          'Open Claims': data
            .filter(pred => pred.policy_section === item.policy_section)
            .filter(pred => !['Settled', 'Repudiated'].includes(pred.status)).length,
          'Paid Claims': data
            .filter(pred => pred.policy_section === item.policy_section)
            .filter(pred => pred.status === 'Settled').length,
          Repudiated: data
            .filter(pred => pred.policy_section === item.policy_section)
            .filter(pred => pred.status === 'Repudiated').length
        }
      })
      .filter((v, i, a) => a.findIndex(t => t.name === v.name) === i)

    res.status(httpStatus.OK).json({
      data,
      dashboardData
    })
  } catch (error) {
    next(error)
  }
}

exports.create = async (req, res, next) => {
  try {
    const {
      params: { userId },
      files
    } = req
    const newData = new ClaimsModel({ ...req.body, user_id: userId })
    const savedData = await newData.save()

    if (savedData) {
      res.status(httpStatus.CREATED).json({
        claimId: savedData._id
      })
    }
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send({
      error
    })
  }
}

exports.update = async (req, res, next) => {
  try {
    const {
      params: { userId, claimId },
      body
    } = req
    const updatedClaimData = await ClaimsModel.findOneAndUpdate(
      { user_id: userId, _id: claimId },
      body
    )

    console.log('updatedClaimData', updatedClaimData)

    if (updatedClaimData) {
      res.status(httpStatus.OK).json({ claimId: updatedClaimData._id })
    } else {
      res.send({ error: 'Failed to update' })
    }
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send({
      error
    })
  }
}

exports.delete = async (req, res, next) => {
  try {
    const { claimId, userId } = req.params
    const claimDeleted = await ClaimsModel.findOneAndDelete({ _id: claimId, user_id: userId })

    if (claimDeleted) {
      res.status(httpStatus.NO_CONTENT)
    } else {
      res.send({ error: 'Failed to delete' })
    }
  } catch (error) {
    next(error)
  }
}
