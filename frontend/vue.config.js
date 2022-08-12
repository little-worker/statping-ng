module.exports = {
  publicPath: '/',
  assetsDir: 'assets',
  filenameHashing: false,
  // productionTip: process.env.NODE_ENV !== 'production',
  // devtools: process.env.NODE_ENV !== 'production',
  // performance: process.env.NODE_ENV !== 'production',
  devServer: {
    disableHostCheck: true,
    proxy: {
      '/api': {
        logLevel: 'debug',
        target: 'https://status.littleworker.fr/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/oauth': {
        logLevel: 'debug',
        target: 'https://status.littleworker.fr/',
        changeOrigin: true,
        pathRewrite: {
          '^/oauth': ''
        }
      }
    }
  }
};
