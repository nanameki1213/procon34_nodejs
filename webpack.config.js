const path = require('path');

module.exports = {
  entry:"./front/index.ts",

  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "./front/dist")
  },

  module: {
    rules:[{
      test: /\.ts$/,
      use: 'ts-loader',
      exclude: /node_modules/
    }]
  },
  resolve: {
    extensions: ['.ts', '.js']
  }
}