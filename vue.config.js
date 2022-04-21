/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息
 */

const path = require('path')
const version = '1.0.7'
let settings = require('./src/api/config/settings.js').config
const port = 8080 //开发服务器端口
const outDir = 'static/dist/shop/'
const CopyPlugin = require("copy-webpack-plugin");

function resolve(dir) {
    return path.join(__dirname, dir)
}

function fmtUrl(url = '') {
    return url.replace('.[contenthash:8]', '');
}

module.exports = {
    publicPath: '/',
    assetsDir: outDir,
    filenameHashing: false,
    productionSourceMap: false,
    devServer: {
        host: '0.0.0.0',
        port: port,
        https: false,
        hotOnly: false,
        proxy: {
            '/manageApi/manage': {
                /* 目标代理服务器地址 */
                target: settings.base_url,
                /* 允许跨域 */
                pathRewrite: {'^/manageApi/manage': '/'},
                logLevel: 'debug',
                changeOrigin: true,
                // 关键部分
                cookieDomainRewrite: {
                    '*': 'localhost' // 把相应的 cookie 域都设置成 localhost，也可以配置成自己电脑的ip，或者指定的域名
                }
            },
        }
    },
    chainWebpack: config => {
        config.plugins.delete('prefetch')
        config.plugins.delete('named-chunks')
        config.plugins.delete('pwa')
        config.plugins.delete('workbox')

        let filename = fmtUrl(config.output.store.get('filename')) + '?v=' + version
        let chunkFilename =
            fmtUrl(config.output.store.get('chunkFilename')) + '?v=' + version
        config.output.store.set('filename', filename)
        config.output.store.set('chunkFilename', chunkFilename)
        config.resolve.alias.set('@', resolve('./src'))

        /* 不编译iview-pro */
        config.module
            .rule('js')
            .test(/\.jsx?$/)
            .exclude
            .add(resolve('./src/libs/iview-pro'))
            .end();

        const isProd = process.env.NODE_ENV === 'production'


        config.plugin("copy").use(
            new CopyPlugin([
                {
                    from: resolve(
                        "./public/addons/kdx_shop/public/static/dist/shop"
                    ),
                    to: resolve("./dist/static/dist/shop"),
                },
            ])
        );

        if (isProd) {
            // 调整extract-css插件配置,调整输出css文件输出名称
            config.plugin('extract-css').tap(options => {
                return [
                    {
                        filename: fmtUrl(options[0].filename) + "?v=" + version,
                        chunkFilename: fmtUrl(options[0].chunkFilename) + "?v=" + version,
                    },
                ];
            })

            config.plugin("copy").use(
                new CopyPlugin([
                    {
                        from: resolve(
                            "./public/addons/kdx_shop/public/static/dist/shop"
                        ),
                        to: resolve("./dist/static/dist/shop"),
                    },
                ])
            );
        }
    },
    css: {
        loaderOptions: {
            // 给 sass-loader 传递选项
            sass: {
                // @/ 是 src/ 的别名
                // 所以这里假设你有 `src/variables.sass` 这个文件
                // 注意：在 sass-loader v7 中，这个选项名是 "data"
                prependData: `@import "~@/assets/css/public.scss"`
            },
            // 默认情况下 `sass` 选项会同时对 `sass` 和 `scss` 语法同时生效
            // 因为 `scss` 语法在内部也是由 sass-loader 处理的
            // 但是在配置 `data` 选项的时候
            // `scss` 语法会要求语句结尾必须有分号，`sass` 则要求必须没有分号
            // 在这种情况下，我们可以使用 `scss` 选项，对 `scss` 语法进行单独配置
            scss: {
                prependData: `@import "~@/assets/css/public.scss";`
            }
        }
    },
}
