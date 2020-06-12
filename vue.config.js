module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                assets: "@/assets",
                common: "@/common",
                network: "@/network",
                views: "@/views",
                components: "@/components",
            }
        }
    },
    transpileDependencies: [
        'vue-echarts',
        'resize-detector'
    ]
}