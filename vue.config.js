const openAnalyzer = process.argv.includes('--analyze')
const analyzerMode = (() => {
  if (process.env.NODE_ENV === 'development') {
    return 'server'
  } else if (openAnalyzer) {
    return 'static'
  } else {
    return 'disabled'
  }
})()

module.exports = {
  css: {
    extract: false
  },
  chainWebpack: config => {
    if (process.env.LIB === 'true') {
      config.externals({ 
        '@vue/composition-api': 'vueCompositionApi',
        'fuse.js': 'Fuse',
      })
    }
  },
  pluginOptions: {
    webpackBundleAnalyzer: { analyzerMode, openAnalyzer }
  }
}