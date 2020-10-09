const path = require('path')

const resolve = dir => {
  return path.join(__dirname, dir)
}

// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
// iview-admin线上演示打包路径： https://file.iviewui.com/admin-dist/
const BASE_URL = process.env.NODE_ENV === 'production' ?
  '/' :
  '/'

module.exports = {
  // Project deployment base
  // By default we assume your app will be deployed at the root of a domain,
  // e.g. https://www.my-app.com/
  // If your app is deployed at a sub-path, you will need to specify that
  // sub-path here. For example, if your app is deployed at
  // https://www.foobar.com/my-app/
  // then change this to '/my-app/'
  publicPath: BASE_URL,
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  //   lintOnSave: true,
  lintOnSave: false,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))

    // 加载iview-loader
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use('iview-loader')
      .loader('iview-loader')
      .tap(options => {
        return {
          prefix: true,
          ...options
        }
      })
      .end()

  },

  //   css: {
  //     // // 是否使用css分离插件 ExtractTextPlugin
  //     // // css热更新需要变更为false
  //     // extract: process.env.NODE_ENV === 'production' ? true : false,
  //     // // 开启 CSS source maps?
  //     // sourceMap: process.env.NODE_ENV === 'production' ? true : false,
  //     // css预设器配置项
  //     loaderOptions: {
  //       //   sass: {
  //       //     // V9版本
  //       //     // data: `@import "@/assets/scss/_variable.scss";`
  //       //     // V8版本
  //       //     prependData: `@import "@/assets/scss/_variable.scss"; @import "@/assets/scss/_mixins.scss";`
  //       //   }
  //       // less:{
  //       //     javascriptEnabled:true  //less版本兼容配置
  //       // }
  //     },

  //   },

  // 设为false打包时不生成.map文件
  productionSourceMap: false
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  // devServer: {
  //   proxy: 'localhost:3000'
  // }
}
