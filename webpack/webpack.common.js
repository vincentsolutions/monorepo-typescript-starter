const path = require('path');

module.exports = {
    entry: "./src/index",
    target: "web",
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "[name].js",
        publicPath: "/"
    },
    resolve: {
        extensions: [".js", ".jsx", ".json", ".ts", ".tsx"]
    }
}