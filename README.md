[![npm](https://img.shields.io/npm/v/env-info-webpack-plugin.svg?style=?style=flat&logo=appveyor)](https://www.npmjs.com/package/env-info-webpack-plugin)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=?style=flat&logo=appveyor)](http://makeapullrequest.com)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=?style=flat&logo=appveyor)](https://github.com/sqrthree/env-info-webpack-plugin/blob/master/LICENSE)

# env-info-webpack-plugin

Webpack plugin for generates building and env information.

![image](https://user-images.githubusercontent.com/8622362/62819515-e006d000-bb88-11e9-88d8-e9e535a92e6f.png)

## Getting started

Install with npm:

```shell
npm i --save-dev env-info-webpack-plugin
```

Install with yarn:

```shell
yarn add --dev env-info-webpack-plugin
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

console.log(
  `%c${BUILD_INFO.name}%cv${BUILD_INFO.version}`,
  'background: #35495e; color: #fff; padding: 2px 4px; border-radius: 3px 0 0 3px;',
  'background: #19be6b; color: #fff; padding: 2px 4px; border-radius: 0 3px 3px 0;'
) // Output with colorful support.

/*

BUILD_INFO => {
  name: 'Your Project Name',
  version: '0.1.0',
  time: '2019-05-27T15:49:46.162Z',
  hash: '035d7e36be302121871cf907e292269071a0c2f4',
}

*/
```

##### If you are using vue-cli

```js
// 1. Working with Webpack in vue.config.js
const EnvInfoPlugin = require('env-info-webpack-plugin')

module.exports = {
  // ...Your own config.

  configureWebpack: {
    plugins: [new EnvInfoPlugin()],
  },
}

// 2. Output info in main.js
console.log(
  `%c${BUILD_INFO.name}%cv${BUILD_INFO.version}`,
  'background: #35495e; color: #fff; padding: 2px 4px; border-radius: 3px 0 0 3px;',
  'background: #19be6b; color: #fff; padding: 2px 4px; border-radius: 0 3px 3px 0;'
) // Output with colorful support.
```

## Options

### name

Type: `string`

Global constant name for env info, the default is `BUILD_INFO`.

### output

Type: `string`

Global constant name for env info, the default is value of _Options.name_.

### persistent

Type: `boolean|string`

Persistent storage to local file. If a string is given, it will be as name of output file.

---

> [sqrtthree.com](http://sqrtthree.com/) &nbsp;&middot;&nbsp;
> GitHub [@sqrthree](https://github.com/sqrthree) &nbsp;&middot;&nbsp;
> Twitter [@sqrtthree](https://twitter.com/sqrtthree)
