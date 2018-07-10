const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const path = require('path')

module.exports = {
  entry: ['@babel/polyfill', './web.js'],
  output: {
    path: __dirname + '/dist',
    filename: 'app.js'
  },
  devServer: {
    contentBase: './web'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['@babel/plugin-proposal-class-properties'],
            presets: ['@babel/preset-env', '@babel/react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.d.ts$/,
        use: 'raw-loader'
      }
    ]
  },
  node: {
    fs: 'empty'
  },
  plugins: [new MonacoWebpackPlugin()]
}
