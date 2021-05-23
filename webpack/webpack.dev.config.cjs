const path = require('path')

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: './src/dev.ts',
  output: {
    path: path.resolve(__dirname, '../bundle'),
    filename: 'wanilla.dev.js',
    library: {
      name: 'W',
      type: 'var',
      export: 'default'
    }
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [{ test: /\.tsx?$/, loader: 'ts-loader' }]
  }
}
