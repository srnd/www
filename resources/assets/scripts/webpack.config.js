path = require('path')
webpack = require('webpack')
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
    },
    /**/plugins: [
        new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production')
        }
        }),
        new webpack.optimize.UglifyJsPlugin()
    ]/**/
};
