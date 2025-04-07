// @ts-check
/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
/* eslint-enable @typescript-eslint/no-require-imports */

module.exports = {
  mode: 'production',
  entry: './index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../../dist/input-data/website'),
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'index.html', to: '' },
        { from: 'styles.css', to: '' },
      ],
    }),
  ],
}
