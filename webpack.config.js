var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: __dirname + '/src',
  // the entry point of your library
  entry: './chart.js',
  // where 3rd-party modules can reside
  resolve: {
    modulesDirectories: ['node_modules', 'bower_components']
  },

  output: {
    // where to put standalone build file
    path: path.join(__dirname, 'dist'),
    // the name of the standalone build file
    filename: '[name].js',
    // the standalone build should be wrapped in UMD for interop
    libraryTarget: 'umd',
    // the name of your library in global scope
    library: 'Koto'
  },
  externals: {
    // Specify all libraries a user need to have in his app,
    // but which can be loaded externally, e.g. from CDN
    // or included separately with a <script> tag

    'd3': 'd3'
  },

  plugins: [
    new webpack.DefinePlugin({
      ON_DEV: process.env.NODE_ENV === 'development' || !process.env.NODE_ENV,
      ON_TEST: process.env.NODE_ENV === 'test',
      ON_PROD: process.env.NODE_ENV === 'production'
    })
  ],

  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel?stage=0&optional=runtime',
      exclude: /(node_modules|bower_components)/
    }]
  }
};
