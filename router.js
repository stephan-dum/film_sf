import Router from 'vue-router';

import { createRouter as createDefaultRouter } from './defaultRouter'
import { parse, stringify } from 'qs';

import MovieList from "~/components/movie-list/index.vue";
import MovieDetail from "~/components/movie-detail/index.vue";
import FilterAdd from "~/components/filter/add.js";
import FilterRemove from "~/components/filter/remove.js";


export const routes = [
  {
    path: "/",
    redirect: {"path":"/movies"}
  }, {
    path : "/movies",
    component : MovieList,
    children : [{
      path : "filter/add/:type",
      component : FilterAdd
    }, {
      path: "filter/remove/:type/:name/:role?",
      component : FilterRemove
    }]
  }, {
    path : "movies/:title",
    component : MovieDetail
  }
];

export function createRouter(context) {
  const defaultRouter = createDefaultRouter(context)

  defaultRouter.options.routes.push(...routes);

  return new Router({
    ...defaultRouter.options,
    parseQuery: parse,
    stringifyQuery: function(query) {
      let result = stringify(query);

      return result ? ('?' + result) : '';
    },
  })
}
