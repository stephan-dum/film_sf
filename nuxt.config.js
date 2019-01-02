const pkg = require('./package')

module.exports = {
  mode: 'universal',
  store : true,
  /*
  ** Headers of the page
  */
  head: {
    title: "Film San Francisco",
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    script : [
      {
        innerHTML: 'document.body.classList.add("js");',
        type: 'text/javascript',
        body : true
      }
    ],
    __dangerouslyDisableSanitizers : ["script"],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  router : {},
  /*
  ** Global CSS
  */

  css: [],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    "~/plugins/inject-store.js",
    "~/plugins/pouchdb.js"
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    [
      'nuxt-sass-resources-loader',
      ["./config/var.scss"]
    ],
    ['@nuxtjs/router', { keepDefaultRouter: true }]
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
