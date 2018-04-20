'use strict'

// securityDefinitions:
//   authenticationToken:
//     type: apiKey
//     in:   header
//     name: Authorization
//   facilityScope:
//     type: apiKey
//     in:   header
//     name: Scope

const Unit            = require('./unit')
const IndexUnits      = require('./indexUnits')
const CreateUnit      = require('./createUnit')
const CreateUnitInput = require('./createUnitInput')
const ReadUnit        = require('./readUnit')
const UpdateUnit      = require('./updateUnit')
const UpdateUnitInput = require('./updateUnitInput')
const DeleteUnit      = require('./deleteUnit')

module.exports = {
  Unit,
  IndexUnits,
  CreateUnit,
  CreateUnitInput,
  ReadUnit,
  UpdateUnit,
  UpdateUnitInput,
  DeleteUnit
}
