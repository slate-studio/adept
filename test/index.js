'use strict'

describe('lib', () => {
  describe('compose', () => {
    it('should build specification for modules', () => {
      const units = require('./units')
      const { Composer } = require('../lib')

      const modules  = [ units ]
      const composer = new Composer({ modules })
      const yaml = composer.yaml

      console.log(yaml) // eslint-disable-line no-console
    })
  })
})
