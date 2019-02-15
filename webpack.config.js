const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const config = {
  /*
    Entry point, file where you app renders to your DOM(ReactDOM.render)
    add more [key]: [value] as many entry points you have,
    key= name of your app
    value= path of your entry point
  */
  entry: {
    app: path.join(__dirname, 'src/index.js')
  },
  /*
    Output,
    path= place to put your final files
    filename= name of your app file
  */
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: 'app.min.js'
  },
  /*
    Plugins, webpack has hundred of plugins to automate some tasks
    Check this out https://webpack.js.org/plugins/
  */
  plugins: [
    // Remove dist folder before create a new one
    new CleanWebpackPlugin(['dist']),
    // Easily create HTML files to serve your bundles, to configurate https://github.com/jantimon/html-webpack-plugin#options
    new HtmlWebpackPlugin({
      title: 'Coso'
    })
  ],

  module: {
    /*
      Rules declare witch loader it should use when a file match with test value,
      test= regex to match
      exclude= path where webpack will not watch
      loader= what webpack should use with that file
      query= extra configuration
    */
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['env', 'react'],
        plugins: ['react-hot-loader/babel']
      }
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, {
      test: /\.(jpg|png|gif|svg)$/,
      use: {
        loader: 'url-loader'
      }
    }]
  }
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    // if dev mode add a http server with desired content, more configuration https://webpack.js.org/configuration/dev-server/
    config.devServer = {
      contentBase: './dist',
      hot: true
    };
    config.plugins.push(new webpack.HotModuleReplacementPlugin())
  }
  return config;
};
