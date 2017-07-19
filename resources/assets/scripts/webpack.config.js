path = require('path')
module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.dirname(path.dirname(path.dirname(__dirname)))+"/public/assets/js/",
        filename: "app.js"
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    }
};
