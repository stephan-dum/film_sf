import { stringify } from "qs";
import PouchDB from "pouchdb";
import serverDB from "./pouchDB.js";
import vars from "./vars.js";
import { couchdb } from "./vars.js";

let pouchDB = serverDB;
/*
if(process.browser) {
  const slave = new PouchDB(couchdb.database);

  slave.createIndex({
    index: {
      fields: ['title'],
      name : "title",
      ddoc : "movies"
    },
  }).then(() => {
    slave.replicate.from(pouchDB).then(
      () => { pouchDB = slave; }
    );
  })
}*/

const LIMIT = 12;
const ROLES = ["actors", "directors", "writers", "producers", "distributors"];

function getInitFilter() {
  return {
    title : "",
    release_year_min : "",
    release_year_max : "",
    locations : [],
    collaborators : [],
    insert_locations : null,
    insert_collaborators : null
  }
}

export function query(db, filter, offset) {
  let {
    title,
    release_year_min,
    release_year_max,
    locations,
    collaborators
  } = filter;

  let selector = {};

  if(title) {
    selector.title = {
      "$regex" : "(?i)"+title
    }
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

  if(locations.length) {
    selector.locations = {
      "$elemMatch" : {
        "$regex" : "(?i)"+locations.join("|")
      }
    }
  }

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
            "$regex" : "(?i)"+obj[role].join("|")
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
                "$regex" : "(?i)"+any.join("|")
              }
            }
          });
        }
      });
    }

    selector["$or"] = or;
  }

  return db.find({
    selector,
    sort : ["title"],
    limit : LIMIT+1,
    skip : offset*LIMIT,
    use_index : ["movies", "title"]
  });
}



export default {
  state() {
    return {
      insertRole : "any",
      limit : LIMIT,
      movies : [],
      offset : 0,
      min_year : null,
      max_year : null,
      querystring : null,
      share_url : null,
      hasNext : false,
      filter : getInitFilter(),
      details : {
        actors : [],
        directors : [],
        locations : [],
        writers : [],
        producers : [],
        distributors : []
      }
    };
  },
  mutations : {
    setMeta(state, meta) {
      this.state.min_year = meta.min_year;
      this.state.max_year = meta.max_year;
    },
    resetInsertRole(state) {
      state.insertRole = "any";
    },
    setInsertRole(state, role) {
      state.insertRole = role;
    },
    setMovies(state, movies) {
      this.state.movies.splice(0);
      this.state.movies.push(...movies);
    },
    setOffset(state, offset) {
      this.state.offset = offset;
    },
    setFilter(state, filter) {
      state.filter = filter;

      state.querystring = "?"+stringify(filter)+"&offset=";
    },
    setHasNext(state, hasNext) {
      this.state.hasNext = hasNext;
    },
    setDetails(state, details) {
      state.share_url = vars.site_url+'/movies/'+details.title;
      state.details = details;
    },
    addLocation(state, location) {
      state.filter.locations.push(location.trim())
    },
    addCollaborator(state, collaborator) {
      collaborator.name = collaborator.name.trim();

      state.filter.collaborators.push(collaborator);
    },
    setLocation(state, [row, value]) {
      state.filter.locations[row] = value;
    },
    setCollaborator(state, [row, property, value]) {
      state.filter.collaborators[row][property] = value;
    },
    removeCollaborator(state, row) {
      state.filter.collaborators.splice(row, 1);
    },
    removeLocation(state, row) {
      state.filter.locations.splice(row, 1);
    },
    clearFilter(state) {
      state.filter = getInitFilter();
    }
  },
  actions : {
    addCollaborator({ state, commit, dispatch }, name) {
      commit("addCollaborator", {
        name,
        role : this.state.insertRole
      });

      commit("resetInsertRole");

      return dispatch("setFilter");
    },
    removeCollaborator({ commit, dispatch }, row) {
      commit("removeCollaborator", row);

      return dispatch("setFilter");
    },
    clearFilter({ commit, dispatch }) {
      commit("clearFilter");

      return dispatch("setFilter");
    },
    setMeta({ state, commit }) {
      return pouchDB.get("meta").then((meta) => {
        commit("setMeta", meta);
      });
    },
    fetchDetails({ state, commit }, title) {
      return pouchDB.get(title).then((doc) => {
        this.commit("setDetails", doc);
      });
    },
    setFilter({ state, commit }, filter = {}) {
      let currFilter = state.filter;

      let {
        title = currFilter.title,
        release_year_min = currFilter.release_year_min,
        release_year_max = currFilter.release_year_max,
        locations = currFilter.locations,
        collaborators = currFilter.collaborators,
        offset = 0,
        insert_location,
        insert_collaborator
      } = filter;

      offset = parseInt(offset);

      commit("setFilter", {
        title,
        release_year_min,
        release_year_max,
        locations,
        collaborators
      });

      if(insert_collaborator && insert_collaborator.name) {
        commit("addCollaborator", insert_collaborator);
      }
      if(insert_location) {
        commit("addLocation", insert_location);
      }

      this.commit("setOffset", offset);



      return query(pouchDB, this.state.filter, offset).then(({ docs }) => {
        let hasNext = docs.length > LIMIT;

        if(hasNext) {
          docs.pop();
        }

        this.commit("setHasNext", hasNext);
        this.commit("setMovies", docs);
      }, console.warn);
    }
  }
}
