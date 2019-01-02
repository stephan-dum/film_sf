import { FilterStore } from "~/components/filter/store.js";
import { stringify } from "qs";
import escapeStringRegexp from "escape-string-regexp";


import {
  limit as LIMIT,
  roles as ROLES
} from "~/config/site.js";

const POOLTIMEOUT = 100;
const FILTER_PROPERTIES = [
  "title",
  "release_year_min",
  "release_year_max",
  "locations",
  "collaborators"
];

export function fetch(db, selector, offset = 0, limit = LIMIT) {
  console.log("selector", selector);

  return db.find({
    selector,
    limit : limit+1,
    skip : offset*limit
  });
}

export function state() {
  return {
    movies : [],
    min_year : 0,
    max_year : 0,
    hasNext : false,
    offset : 0,
    limit : LIMIT,
    pool : {}
  };
}

export const MovieStore = {
  state,
  getters : {
    selector(state, getters) {
      let {
        title,
        locations,
        collaborators,
        offset = 0
      } = state.filter;

      let release_year_min = getters["filter/_release_year_min"];
      let release_year_max = getters["filter/_release_year_max"]

      let selector = {};

      if(title) {
        selector.title = {
          "$regex" : new RegExp(escapeStringRegexp(title), "i")
        };
      }

      if(release_year_min || release_year_max) {
        let year = selector.release_year = {};

        if(release_year_min) {
          year["$gte"] = parseInt(release_year_min);
        }

        if(release_year_max) {
          year["$lte"] = parseInt(release_year_max);
        }
      }

      locations = locations.filter((name) => name);

      if(locations.length) {
        selector.locations = {
          "$elemMatch" : {
            "$regex" : new RegExp(locations.map(escapeStringRegexp).join("|"), "i")
          }
        }
      }

      collaborators = collaborators.filter(({ name }) => name);

      if(collaborators.length) {
        let obj = {};
        let any = [];

        collaborators.forEach(({ role, name }) => {
          if(role == "any") {
            any.push(name);
          } else if(obj[role]) {
            obj[role].push(name);
          } else {
            obj[role] = [name];
          }
        })

        let or = []

        for(let role in obj) {
          obj[role].push(...any);

          or.push({
            [role] : {
              "$elemMatch" : {
                "$regex" : new RegExp(obj[role].map(escapeStringRegexp).join("|"), "i")
              }
            }
          });
        }

        if(any.length) {
          ROLES.forEach((role) => {
            if(!obj[role]) {
              or.push({
                [role] : {
                  "$elemMatch" : {
                    "$regex" : new RegExp(any.map(escapeStringRegexp).join("|"), "i")
                  }
                }
              });
            }
          });
        }

        selector["$or"] = or;
      }

      return selector;
    },
    previous(state, getters) {
      let { offset } = state;

      if(offset > 0) {
        return getters.querystring+(offset - 1);
      }
    },
    next(state, getters, root) {
      if(root.movies.hasNext) {
        return getters.querystring+(state.offset + 1);
      }
    },
    querystring(state) {
      let filter = {};

      FILTER_PROPERTIES.forEach((property) => {
        filter[property] = state.filter[property];
      });

      let queryString = stringify(filter);

      return (
        queryString
          ?"?"+queryString
          :""
      )+"&offset=";
    },
    stats(state) {
      let {
        offset,
        limit,
        movies
      } = state;

      return `Entry ${offset*limit+1} to ${(offset*limit)+movies.length }`;
    },
  },
  modules : {
    filter : FilterStore
  },
  mutations : {
    init(state, query) {
      let { offset, limit } = query;

      if(offset) {
        state.offset = parseInt(offset);
      }
      if(limit) {
        state.limit = parseInt(limit);
      }
    },
    inject(state, movies) {
      let hasNext = movies.length > LIMIT;

      if(hasNext) {
        movies.pop();
      }


      //this.set(state, hasNext);
      state.hasNext = hasNext;
      console.log("set hasnext", hasNext);

      state.movies.splice(0);
      state.movies.push(...movies);
    },
    pool(state, pool) {
      let { timerId, callback } = state.pool;

      if(callback) {
        clearTimeout(timerId);
        callback();
      }

      state.pool = pool;
    },
    release(state) {
      state.pool.callback = null;
    }
  },
  actions : {
    init({ dispatch, commit }, query) {
      commit("init", query);

      return dispatch("filter/init", query)
        .then(() => dispatch("fetch"))
      ;
    },
    fetchPool({ state, dispatch, commit }) {
      return new Promise((resolve, reject) => {
        let timerId = setTimeout(
          () => {
            commit("release");

            this.$router.replace({ path : "/movies"+this._vm.querystring+0 }, () => {
              dispatch("fetch").then(resolve, reject);
            }, console.log);
          },
          POOLTIMEOUT
        );

        commit(
          "pool",
          {
            callback : resolve,
            timerId
          }
        );
      });
    },
    fetch({ state, commit, getters }) {
      let selector = state.selector || getters.selector;

      return fetch(
        this.db,
        selector,
        state.offset,
        state.limit
      ).then(({ docs }) => {
        commit("inject", docs);
      });
    }
  }
};

export default MovieStore;
