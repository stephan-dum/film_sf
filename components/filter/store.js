import MultiRangeStore from "../multi-range/store.js";

export const Dummy = {
  locations : "",
  get collaborators() {
    return {
      role : "any",
      name : "",
    };
  }
};

export function state() {
  return {
    title : "",
    release_year_min : 0,
    release_year_max : 0,
    locations : [Dummy.locations],
    collaborators : [Dummy.collaborators]
  }
}

export const FilterStore = {
  namespaced : true,
  state,
  modules : {
    release_year : MultiRangeStore
  },
  getters : {
    _release_year_min(state) {
      if(!state.release_year_min) {
        return state.min;
      }

      return Math.min(state.release_year_min, state.release_year_max);
    },
    _release_year_max(state) {
      if(!state.release_year_max) {
        return state.max;
      }

      return Math.max(state.release_year_min, state.release_year_max);
    }
  },
  mutations : {
    setItem(state, [property, value]) {
      state[property] = value;
    },
    addListItem(state, list) {
      state[list].unshift(Dummy[list]);
    },
    setListItem(state, [list, key, value, property]) {
      list = state[list];

      if(property) {
        list = list[key];
        list[property] = value;
      } else {
        list.splice(key, 1, value);
      }
    },
    removeListItem(state, [list, key]) {
      state[list].splice(key, 1);
    },
    init(state, { min_year, max_year }) {
      Object.assign(state, {
        min_year : parseInt(min_year),
        max_year : parseInt(max_year)
      });
    },
    sync(state, filter) {
      /*let {
        release_year_min,
        release_year_max
      } = filter;

      if(!release_year_min) {
        filter.release_year_min = state.min_year;
      }
      if(!release_year_max) {
        filter.release_year_max = state.max_year;
      */


      Object.assign(state, filter);
    },
    clear() {
      this.commit("filter/sync", state());
    }
  },
  actions : {
    init({ commit, state }, filter) {


      return this.db.get("meta").then((meta) => {
        this.commit("filter/init", meta);
        this.commit("filter/sync", filter);
      });
    }
  }
}

export default FilterStore;
