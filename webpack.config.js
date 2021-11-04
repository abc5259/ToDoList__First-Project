const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
module.exports = {
  entry: {
    main: "./src/client/js/main.js",
    createBoard: "./src/client/js/createBoard.js",
    createList: "./src/client/js/createList.js",
    createCard: "./src/client/js/createCard.js",
  },
  mode: "development",
  watch: true,
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
};
