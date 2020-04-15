const HTMLWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

/**
 * @type {import('webpack').Configuration[]}
 */
const basicConfig = (isBrowser = false) => ({
  mode: 'development',

  devtool: 'cheap-module-source-map',

  resolve: {
    alias: {
      'vue-server-renderer': 'vue-server-renderer/basic.js',
    }
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.styl(us)?$/,
        use: [
          {
            loader: 'vue-style-loader',
            options: {
              shadowMode: !isBrowser
            }
          },
          'css-loader',
          'stylus-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'vue-style-loader',
            options: {
              shadowMode: !isBrowser
            }
          },
          'css-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
        use: [
          'file-loader',
        ],
      },
    ]
  }
})

/**
 * @type {import('webpack').Configuration[]}
 */
module.exports = [{
  entry: './src/index.js',
  target: 'web',
  plugins: [
    new HTMLWebpackPlugin({
      template: './index.html'
    }),
    new VueLoaderPlugin(),
  ],
  ...basicConfig(true),
}, {
  entry: './src/sw.js',
  target: 'webworker',
  output: {
    filename: 'sw.js'
  },
  devServer: {
    liveReload: false,
    injectClient: false,
    injectHot: false,
    hot: false,
    inline: false
  },
  plugins: [
    new VueLoaderPlugin(),
  ],
  ...basicConfig(),
}]
