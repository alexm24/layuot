const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
const optimization = () => {
    const config = { splitChunks: { chunks: 'all' } };
    if (isProd) { config.minimizer = [new OptimizeCssAssetsPlugin(), new TerserPlugin()] };
    return config;
};
const cssLoader = extra => {
    const loaders = [{ loader: MiniCssExtractPlugin.loader, options: { hmr: isDev, reloadAll: true } }, 'css-loader'];
    if (extra) loaders.push(extra);
    return loaders;
}
const fileName = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

module.exports = {
    context: __dirname,
    entry: { script: './src/index.ts' },
    output: { filename: fileName('js'), path: path.resolve(__dirname, 'dist') },
    optimization: optimization(),
    devServer: { port: 8080, hot: isProd },
    plugins: [
        new HTMLWebpackPlugin({ template: './src/index.html', minify: { collapseWhitespace: isProd } }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({ filename: fileName('css') }),
        new ForkTsCheckerWebpackPlugin({ eslint: true })

    ],
    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'ts-loader', options: { transpileOnly: true } },
            { test: /\.css$/, use: cssLoader() },
            { test: /\.s[ac]ss$/, use: cssLoader('sass-loader') },
        ]
    }
}

