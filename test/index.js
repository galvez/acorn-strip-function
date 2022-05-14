const { readFileSync, writeFileSync } = require('fs')
const { resolve } = require('path')
const t = require('tap')

const stripFunction = require('../index')
const loadFixture = (fixture) => {
  return readFileSync(resolve(__dirname, 'fixtures', fixture), 'utf8')
}

t.test('should remove arrow functions', (t) => {
  t.plan(1)
  const before = loadFixture('arrow-function.before.js')
  const after = loadFixture('arrow-function.after.js')
  t.equal(after, stripFunction(before, 'remove'))
})

t.test('should remove named functions', (t) => {
  t.plan(1)
  const before = loadFixture('named-function.before.js')
  const after = loadFixture('named-function.after.js')
  t.equal(after, stripFunction(before, 'remove'))
})
