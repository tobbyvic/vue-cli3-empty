const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('layout', resolve('src/layout'))
      .set('base', resolve('src/base'))
      .set('static', resolve('src/static'));
  },
  lintOnSave: false,
  devServer: {
    proxy: {
      '/api/*': {
        target: 'http://172.28.101.188:9806',
        changeOrigin: true,
      },
    },
  },
};
