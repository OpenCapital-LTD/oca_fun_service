// webpack.config.js
const {
  ModuleFederationPlugin
} = require('webpack').container;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const {
  DefinePlugin,
  ProvidePlugin
} = require('webpack')


module.exports = {
  mode: 'development',
  entry: './src/main.jsx', // or your main entry file
  output: {
    publicPath: 'auto',
    filename: '[name].bundle.js',
    // chunkFilename: "[name].[contenthash].js",
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    port: 3002, // Different port for each microfrontend
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    historyApiFallback: true,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'fe_expense_service',
      filename: 'remoteEntry.js', // Name of the remote entry file
      remotes: {
        fe_oca_fun: 'fe_oca_fun@http://localhost:3001/remoteEntry.js', // Remote module and its URL
      },
      exposes: {
        './user_setting': './src/pages/settings/settings_entry.jsx',
        './expense_app': './src/App.jsx'
      },
      shared: {
        // Share dependencies here, like React
        react: {
          singleton: true,
          eager: true,
          requiredVersion: false
        },
        "react-dom": {
          singleton: true,
          eager: true,
          requiredVersion: false
        },
        "react-router-dom": {
          singleton: true,
          eager: true,
          requiredVersion: false
        },
      },
    }),
    new DefinePlugin({
      'process.env.VITE_API_AUTH_URL': JSON.stringify(process.env.VITE_API_AUTH_URL),
      'process.env.VITE_API_KEY': JSON.stringify(process.env.VITE_API_KEY),
    }),
    new ProvidePlugin({
      React: 'react', // Auto import React wherever JSX is used
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      favicon: './oca_short_logo.png'

    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
  },
  module: {
    rules: [{
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'], // Add loaders for CSS files
      },
      {
        test: /\.(scss|sass)$/, // Add this rule to handle SCSS files
        use: [
          'style-loader', // Inject CSS into the DOM
          'css-loader', // Translates CSS into CommonJS
          'sass-loader', // Compiles Sass to CSS
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource', // Add loader for images and SVGs
      },
      {
        test: /\.(xlsx|xls|csv)$/i,
        type: 'asset/resource', // This ensures the file is bundled correctly
        generator: {
          filename: '[name][ext]',  // Retains original file name
        },
      },
    ],
  },
};