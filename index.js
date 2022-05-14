const { tokenizer } = require('acorn')

const acornSettings = {
  ecmaVersion: 'latest',
  sourceType: 'module',
  allowHashBang: true,
  allowAwaitOutsideFunction: true,
  allowImportExportEverywhere: true,
}

module.exports = function removeFunction (code, funcName, { 
  exportsOnly = false,
  settings = acornSettings, 
  tokens
} = {}) {
  if (!tokens) {
    tokens = tokenizer(code, acornSettings)[Symbol.iterator]()
  }
  let slice = []
  let step = null  
  while (true) {
    step = tokens.next()
    if (step.done) {
      break
    }
    try {
      const { value: token } = step
      if (exportsOnly) {
        if (token.type.label === 'export') {
          let func = tokens.next()
          if (['function', 'const'].includes(func.value.type.label)) {
            name = tokens.next()
            if (name.value.type.label === 'name' && name.value.value === funcName) {
              const functionEnd = findFunctionEnd(tokens)
              slice.push(token.start, functionEnd)
              break
            }
          }
        }
      } else if (['function', 'const'].includes(token.type.label)) {
        name = tokens.next()
        if (name.value.type.label === 'name' && name.value.value === funcName) {
          const functionEnd = findFunctionEnd(tokens)
          slice.push(token.start, functionEnd)
          break
        }
      }
    }
    catch (e) {
      throw e
    }
  }
  if (slice.length === 2) {
    return `${
      code.slice(0, slice[0])
    }${
      code.slice(slice[1])
    }`
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
