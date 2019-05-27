[![npm](https://img.shields.io/npm/v/env-info-webpack-plugin.svg?style=flat-square)](https://www.npmjs.com/package/env-info-webpack-plugin)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/sqrthree/env-info-webpack-plugin/blob/master/LICENSE)

# env-info-webpack-plugin

Webpack plugin for generates building and env information.

## Getting started

Install with npm:

```shell
npm i --save-dev html-webpack-plugin
```

Install with yarn:

```shell
yarn add --dev html-webpack-plugin
```

### Prerequisites

- [webpack](https://github.com/webpack/webpack)

## Usage

##### webpack.config.js

```js
const EnvInfoPlugin = require('env-info-webpack-plugin')

module.exports = {
  entry: 'index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
  },
  plugins: [new EnvInfoPlugin()],
}
```

##### index.js

```js
console.log(BUILD_INFO) // BUILD_INFO will be replaced with env info.

/*

BUILD_INFO => {
  version: '0.1.0',
  time: '2019-05-27T15:49:46.162Z',
  hash: '035d7e36be302121871cf907e292269071a0c2f4',
}

*/
```

## Options

### name

Type: `string`

Global constant name for env info.

### output

Type: `string`

Global constant name for env info.

### persistent

Type: `boolean|string`

Persistent storage to local file. If a string is given, it will be as name of output file.

---

> [sqrtthree.com](http://sqrtthree.com/) &nbsp;&middot;&nbsp;
> GitHub [@sqrthree](https://github.com/sqrthree) &nbsp;&middot;&nbsp;
> Twitter [@sqrtthree](https://twitter.com/sqrtthree)
