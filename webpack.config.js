const path = require("path");
const JSON = require("json5");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const ENV_TYPE = process.env.TYPE;
const PUBLIC_URL = ENV_TYPE === 'development' ? '/' : '/bibtexparser';

/*We are basically telling webpack to take index.js from entry. Then check for all file extensions in resolve. 
After that apply all the rules in module.rules and produce the output and place it in main.js in the public folder.*/

module.exports = {
  /** "mode"
   * the environment - development, production, none. tells webpack
   * to use its built-in optimizations accordingly. default is production
   */
  mode: ENV_TYPE,
  /** "entry"
   * the entry point
   */
  entry: "./src/index.tsx",
  output: {
    /** "path"
     * the folder path of the output file
     */
    path: path.resolve(__dirname, "dist"),
    /** "filename"
     * the name of the output file
     */
    filename: "main.js",
    publicPath: PUBLIC_URL
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "public", "index.html"),
    }),
  ],
  optimization: {
    usedExports: true, // Marks unused exports
  },
  /** "target"
   * setting "node" as target app (server side), and setting it as "web" is
   * for browser (client side). Default is "web"
   */
  target: "web",
  devServer: {
    /** "port"
     * port of dev server
     */
    port: "9500",
    /** "static"
     * This property tells Webpack what static file it should serve
     */
    static: ["./public"],
    /** "open"
     * opens the browser after server is successfully started
     */
    open: [PUBLIC_URL],
    /** "hot"
     * enabling and disabling HMR. takes "true", "false" and "only".
     * "only" is used if enable Hot Module Replacement without page
     * refresh as a fallback in case of build failures
     */
    hot: true,
    /** "liveReload"
     * disable live reload on the browser. "hot" must be set to false for this to work
     */
    liveReload: true,
    historyApiFallback: true,
    proxy: [
    ],
  },
  resolve: {
    /** "extensions"
     * If multiple files share the same name but have different extensions, webpack will
     * resolve the one with the extension listed first in the array and skip the rest.
     * This is what enables users to leave off the extension when importing
     */
    extensions: [".js", ".jsx", ".json", ".css", ".tsx", ".ts"],
  },
  module: {
    /** "rules"
     * This says - "Hey webpack compiler, when you come across a path that resolves to a '.js or .jsx'
     * file inside of a require()/import statement, use the babel-loader to transform it before you
     * add it to the bundle. And in this process, kindly make sure to exclude node_modules folder from
     * being searched"
     */
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/, //kind of file extension this rule should look for and apply in test
        exclude: /node_modules/, //folder to be excluded
        use: "babel-loader", //loader which we are going to use
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: "ts-loader",
      },
      {
        test: /\.(css)$/,
        // include: path.resolve(__dirname, "src"),
        use: ["style-loader", "css-loader", 'postcss-loader'],
  },
    ],
},
};
