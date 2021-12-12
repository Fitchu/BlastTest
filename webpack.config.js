const path = require("path");

module.exports = {
  mode: "development",
  entry: "./assets/Script/Area.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },

  optimization: {
    minimize: false,
  },
  resolve: {
    extensions: [".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /test\.js$/,
        use: "mocha-loader",
        exclude: /node_modules/,
        include: /tests/,
      },
      {
        test: /\.js$/,

        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
