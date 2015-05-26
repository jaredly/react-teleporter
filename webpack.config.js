var path = require('path');

var BASE = path.join(__dirname, 'node_modules')

module.exports = {
  devtool: 'eval',
  entry: {
    example: './example',
    photo: './photojump',
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
    publicPath: '/app/'
  },

  node: {
    fs: 'empty',
    net: 'empty',
  },

  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: BASE + '/babel-loader?stage=0',
      exclude: 'node_modules',
    }]
  }
};
