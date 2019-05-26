const EnvInfoPlugin = require('../index')

module.exports = {
  mode: 'development',
  entry: './index.js',
  output: {
    path: __dirname,
    filename: 'dist.js',
  },
  target: 'node',
  plugins: [
    new EnvInfoPlugin({
      persistent: true,
    }),
  ],
}
