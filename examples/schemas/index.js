'use strict'

const yaml = require('js-yaml')
const fs   = require('fs')
const basePath = 'examples/schemas/'

const loadSync = name => yaml.safeLoad(fs.readFileSync(`${basePath}${name}.yaml`))

module.exports = {
  Common:                         loadSync('common'),
  Shift:                          loadSync('shift'),
  ShiftRequirement:               loadSync('shiftRequirement'),
  Unit:                           loadSync('unit'),
  UnitMinimumStaffingRequirement: loadSync('unitMinimumStaffingRequirement'),
  Job:                            loadSync('job'),
  JobState:                       loadSync('jobState')
}
