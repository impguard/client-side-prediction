const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'build'),
  },
  devServer: {
    contentBase: './build',
  },
  mode: 'development',
})
