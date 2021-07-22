/**
 * generates:
 *  - dist/main.js
 *  - dist/manifest.json
 *  - dist/webpack-bundle-analyzer-report.html
 */
const webpack = require("webpack");
const WebpackAssetsManifest = require("webpack-assets-manifest");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const glob = require("glob")
const path = require("path")
const remoteComponentConfig = require("./remote-component.config").resolve;

const entry = glob.sync("src/views/**/index.js")
  .reduce((x, y) => Object.assign(x, {
    [path.basename(path.dirname(y))]: `./${y}`,
  }), {});

const externals = Object.keys(remoteComponentConfig).reduce(
  (obj, key) => ({ ...obj, [key]: key }),
  {}
);

module.exports = {
  plugins: [
    new webpack.EnvironmentPlugin({
      "process.env.NODE_ENV": process.env.NODE_ENV
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      openAnalyzer: false,
      reportFilename: "webpack-bundle-analyzer-report.html"
    }),
    new WebpackAssetsManifest()
  ],
  entry,
  output: {
    libraryTarget: "commonjs"
  },
  externals: {
    ...externals,
    "remote-component.config.js": "remote-component.config.js"
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(sass|less|css)$/,
        use: ["style-loader", "css-loader"]
      },
    ]
  }
};
