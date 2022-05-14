# acorn-strip-function

Strip functions from JavaScript source via acorn.

## Install

```bash
npm i acorn-strip-function --save
```

## Usage

```js
const stripFunction = require('acorn-strip-function')

console.log(stripFunction('function removeMe() {}', 'removeMe') === '')
// true
```

## Reference

### `stripFunction(source, functionName, { tokens, settings })`

- `source`: Source code as string.
- `functionName`: Name of function to be removed across code.
- `tokens`: Provide existing `acorn` tokenizer instance, ignores `source`.
- `settings`: Provide custom acorn settings (default: modules with latest JavaScript features).

## License

MIT
