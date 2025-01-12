const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const WorkerUrlPlugin = require('worker-url/plugin');

module.exports = {
    entry: './src/index.ts',
    devtool: 'inline-source-map',
    devServer: {
        static: './dist',
        // for shared array buffer
        headers: {
            'Cross-Origin-Opener-Policy': 'same-origin',
            'Cross-Origin-Embedder-Policy': 'require-corp',
        },
    },
    performance: {
        maxAssetSize: 10485760,
        maxEntrypointSize: 1048576,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|gif|glb)$/,
                use: ['file-loader'],
            },
        ],
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
        runtimeChunk: 'single',
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Three.js Planets 2',
            meta: { viewport: 'width=device-width, user-scalable=no' },
        }),
        new CleanWebpackPlugin(),
        new WorkerUrlPlugin(),
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            os: false,
            child_process: false,
            worker_threads: false,
        },
    },
    watch: true,
};
