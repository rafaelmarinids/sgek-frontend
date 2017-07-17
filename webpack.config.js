var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    main: './src/main.js',
    vendor: ['jquery', 'underscore', 'backbone', 'jstorage', 'bootstrap']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    //filename: 'bundle.js',
    //filename: '[name].[hash].js',
    filename: '[name].bundle.js',
    //publicPath: '/',
    sourceMapFilename: '[name].map'
  },
  module: {
    rules: [
      { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] },
      //{ test: /\.css$/, use: ExtractTextPlugin.extract({ fallback: "style-loader", use: "css-loader" }) },
      { test: /\.(png|svg|jpg|gif)$/, use: [ 'file-loader' ] },
      { test: /\.(woff|woff2|eot|ttf|otf)$/, use: [ 'file-loader' ] },
      { test: /\.html$/, use: [ { loader: 'html-loader', options: { minimize: true } } ] },
      { test: /\.hbs$/, loader: 'handlebars-loader' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ // Gera o arquivo HTML de saída
      title: 'SGEK - Sistema de Gestão de Entrega de Kits',
      //favicon: './src/assets/images/favicon.ico',
      template: './src/assets/templates/index.hbs'
    }),
    new webpack.HotModuleReplacementPlugin(), // Enable HMR
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.$': 'jquery', // Necessário par o jStorage e Angular
      'window.jQuery': 'jquery',
      _: 'underscore',
      Backbone: 'backbone'
    }),
    /*new webpack.optimize.CommonsChunkPlugin({ // Separa as bibliotecas denpendentes para um arquivo separado.
      names: ['vendor', 'manifest'], // Specify the common bundle's name.
      minChunks: function (module) {
         // this assumes your vendor imports exist in the node_modules directory
         return module.context && module.context.indexOf('node_modules') !== -1;
      }
    }),
    new ExtractTextPlugin('styles.css'), // Separa o CSS em um arquivo separado*/
  ],
  devtool: 'cheap-eval-source-map',
  devServer: {
    hot: true, // Tell the dev-server we're using HMR
    contentBase: path.resolve(__dirname, 'dist'),
    port: 8080,
    publicPath: '/'
  }
};
