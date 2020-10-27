const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge')
const path = require('path');
const common = require('../../../webpack/webpack.common');

const dotenv = require('dotenv').config({path: path.resolve(__dirname, '../../../.local.env')});

module.exports = merge(common, {
    mode: 'development',
    devtool: 'eval-source-map',
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                include: [
                    path.resolve(__dirname, "../src"),
                    path.resolve(__dirname, "../../../packages")
                ],
                loader: 'babel-loader',
                options: {
                    "presets": [
                        "@babel/preset-typescript",
                        "@babel/preset-env",
                        "@babel/preset-react",
                        "@lingui/babel-preset-react"
                    ],
                    "plugins": [
                        "macros",
                        "@babel/plugin-syntax-typescript",
                        "@babel/plugin-syntax-dynamic-import",
                        [
                            "@babel/plugin-proposal-decorators",
                            {
                                "legacy": true
                            }
                        ],
                        [
                            "@babel/plugin-proposal-class-properties",
                            {
                                "loose": true
                            }
                        ]
                    ]
                }
            },
            {
                test: /\.js$/,
                enforce: "pre",
                loader: 'source-map-loader'
            },
            {
                test: /\.less$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                strictMath: true
                            }
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ]
            },
            {
                test: /\.(svg|png|jpg|jpeg|gif)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    },
    devServer: {
        historyApiFallback: true,
        port: 4550
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": JSON.stringify(dotenv.parsed)
        }),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../public", "index.html"),
            title: '[LOCAL] Monorepo Web App'
        })
    ]
})