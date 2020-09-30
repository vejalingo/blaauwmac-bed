const mongoose = require('mongoose')

const PolicySchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    client_name: {
      type: String
    },
    insurer_name: {
      type: String
    },
    insurer_fsp_no: {
      type: Date
    },
    broker_name: {
      type: Date
    },
    broker_fsp_no: {
      type: String
    },
    contact_person: {
      type: String
    },
    contact_details: {
      type: String
    },
    risk_address: {
      type: Number
    },
    policy_number: {
      type: String
    },
    period_of_cover: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Policy', PolicySchema)
