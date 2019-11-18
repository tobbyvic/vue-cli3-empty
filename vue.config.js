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
  devServer: {
    proxy: {
      '/setup/*': {
        target: 'http://yapi.demo.qunar.com/mock/38448',
        changeOrigin: true,
      },
    },
  },
};