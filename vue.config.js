module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'https://expense-tracker-api-9fd3.onrender.com',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}