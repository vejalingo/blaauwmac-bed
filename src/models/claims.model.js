const mongoose = require('mongoose')
const { MongooseAutoIncrementID } = require('mongoose-auto-increment-reworked')

const ClaimSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    policy_section: {
      type: String
    },
    sub_section: {
      type: String
    },
    date_loss: {
      type: Date
    },
    date_registration: {
      type: Date
    },
    reason_late_notify: {
      type: String
    },
    saps_number: {
      type: String
    },
    case_number: {
      type: String
    },
    claim_number: {
      type: Number
    },
    name_user: {
      type: String
    },
    broker_c_number: {
      type: String
    },
    id_number: {
      type: String
    },
    insurance_c_number: {
      type: String
    },
    contact_details: {
      type: String
    },
    desc_of_loss: {
      type: String
    },
    asset_code: {
      type: String
    },
    date_acquired: {
      type: String
    },
    make: {
      type: String
    },
    model: {
      type: String
    },
    serial_number: {
      type: String
    },
    asset_value: {
      type: String
    },
    motor: {
      type: String
    },
    total_loss: {
      type: String
    },
    engine_number: {
      type: String
    },
    vin_number: {
      type: String
    },
    reg_number: {
      type: String
    },
    remove_cover: {
      type: Boolean,
      default: false
    },
    damage_desc: {
      type: String
    },
    claim_desc: {
      type: String
    },
    status: {
      type: String
    },
    excess: {
      type: String
    },
    invoice: {
      type: String
    },
    claimed_amount: {
      type: String
    },
    assessor_name: {
      type: String
    },
    appointment_date: {
      type: Date
    },
    assessment_fees: {
      type: String
    },
    fees: {
      type: String
    },
    contractor_name: {
      type: String
    },
    drivers_licence: {
      type: String
    },
    licence_code: {
      type: String
    },
    notes: {
      type: String
    },
    prdp: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

const options = {
  field: 'claim_number',
  incrementBy: 1,
  startAt: 1000
  // unique: true
}

MongooseAutoIncrementID.setDefaults(options)

ClaimSchema.plugin(MongooseAutoIncrementID.plugin, { modelName: 'Claims' })
console.log(MongooseAutoIncrementID.getDefaults())

module.exports = mongoose.model('Claims', ClaimSchema)
