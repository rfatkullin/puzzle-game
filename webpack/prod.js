const merge = require('webpack-merge');
const common = require('./base.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  optimization: {
    minimize: true,
  }
});