
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
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  router : {
    extendRoutes(routes, resolve) {
      routes.push({
        path : "/",
        redirect : { name : "movies" }
      }, {
        path : "/movies/filter/remove/:type/:name/:role?",
        redirect : { name : "movies" }
      });
    },
    parseQuery(query) {
      return require('qs').parse(query);
    },
    stringifyQuery(query) {
      let result = require('qs').stringify(query);

      return result ? ('?' + result) : '';
    }
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    "~/assets/main.css"
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    [
      'nuxt-sass-resources-loader',
      ["./assets/var.scss"]
    ]
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
