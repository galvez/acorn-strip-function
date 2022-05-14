const { tokenizer } = require('acorn')
const MagicString = require('magic-string')

const acornSettings = {
  ecmaVersion: 'latest',
  sourceType: 'module',
  allowHashBang: true,
  allowAwaitOutsideFunction: true,
  allowImportExportEverywhere: true,
}

module.exports = function stripFunction (code, funcName, { 
  settings = acornSettings, 
  tokens
} = {}) {
  if (!tokens) {
    tokens = tokenizer(code, acornSettings)[Symbol.iterator]()
  }
  const slices = []
  let step = null  
  while (true) {
    step = tokens.next()
    if (step.done) {
      break
    }
    try {
      const { value: token } = step
      if (token.type.label === 'export') {
        let func = tokens.next()
        if (['function', 'const'].includes(func.value.type.label)) {
          name = tokens.next()
          if (name.value.type.label === 'name' && name.value.value === funcName) {
            const functionEnd = findFunctionEnd(tokens)
            slices.push([token.start, functionEnd])
          }
        }
      }
      if (['function', 'const'].includes(token.type.label)) {
        name = tokens.next()
        if (name.value.type.label === 'name' && name.value.value === funcName) {
          const functionEnd = findFunctionEnd(tokens)
          slices.push([token.start, functionEnd])
        }
      }
    }
    catch (e) {
      throw e
    }
  }
  if (slices.length) {
    code = new MagicString(code)
    for (const slice of slices) {
      code.overwrite(slice[0], slice[1], '')
    }
    return code.toString()
  } else {
    return code
  }
}

function findFunctionEnd (iter) {
  let next
  let level = 0
  while (next = iter.next()) {
    if (next.done) {
      break
    }
    const { value: innerToken } = next
    if (innerToken.type.label === '{') {
      level += 1
    } else if (innerToken.type.label === '}') {
      if (--level === 0) {
        return innerToken.end
        break
      }
    }
  }
}
