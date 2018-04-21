'use strict'

const Definition = require('../document')

class ShiftRequirement extends Definition {
  static get schema() {
    return {
      census: {
        description: '',
        type:        'number'
      },
      ratio: {
        description: '',
        type:        'number'
      },
      number: {
        description: '',
        type:        'number'
      }
    }
  }
}

module.exports = ShiftRequirement
