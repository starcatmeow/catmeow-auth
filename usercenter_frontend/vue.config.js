module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        pathRewrite: {
          '^/api/': '/'
        }
      }
    }
  },
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'Catmeow 用户中心'
    }
  },
  "transpileDependencies": [
    "vuetify"
  ]
}