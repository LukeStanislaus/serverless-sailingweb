const path = require('path');
const nodeExternals = require('webpack-node-externals');
const slsw = require('serverless-webpack');

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [{
      test: /\.js$/,
      use: [
        'imports-loader?graphql',
        {
          loader: 'babel-loader',
          options: {
            
              presets: [
                ["env", {
                  "targets": {
                    "browsers": ["last 2 Chrome versions"]
                  }
                }]
              ],
            
            plugins: ["syntax-object-rest-spread"],
          },
        },
      ],
    },
    {
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader'
    }
  ],
  },
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
};