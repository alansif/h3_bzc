module.exports = {
    devServer: {
      // open: process.platform === 'darwin',
      // host: 'localhost',
      open: true, //配置自动启动浏览器 
      proxy: {
        '/api': {
            target: 'http://192.168.160.201:8115'
        } 
      }
     },
     transpileDependencies:[/node_modules[/\\\\]vuetify[/\\\\]/]
  }