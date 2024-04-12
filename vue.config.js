// vue.config.js

module.exports = {
  publicPath: './',
  productionSourceMap: false,
  chainWebpack: (config) => {
    config.plugins.delete('prefetch')
    config.plugin('html').tap((args) => {
      args[0].title = '爱尔智慧管控平台'
      return args
    })
  },
  css: {
    loaderOptions: {
      less: {
        additionalData: `@import "@/assets/less/style.less";`,
      },
    },
  },
  devServer: {
    allowedHosts: ['192.168.0.162'],
    proxy: {
      '/assets/': {
        target: 'http://192.168.0.162:8000/public/',
        changeOrigin: true,
      },

      '/image/': {
        target: 'http://119.45.25.111/',
        changeOrigin: true,
      },

      '/api': {
        target: 'http://119.45.25.111:8000/', // 正式环境的目标地址
        changeOrigin: true,
      },
    },
  },
  transpileDependencies: true,
  configureWebpack: (config) => {
    config.module.rules.push({
      test: /\.glsl$/,
      use: [
        {
          loader: 'webpack-glsl-loader',
        },
      ],
    })
  },
}
