import createDatebase from "./create_database.js";
import designMovies from "./design_movies.json";

import {
  protocol,
  reader as auth,
  host,
  port,
  database
} from "~/config/couchdb.js"

export const config = {
  protocol,
  auth,
  host,
  port,
  database
};

export const master = createDatebase(config);
export const slave = createDatebase(".pouchdb/"+database);

const objectToString = Object.prototype.toString;

master.normalizeRegExp = function normalizeRegExp(regExp) {

  for(let key in regExp) {
    let value = regExp[key];

    if(key == "$regex") {
      let { flags, source } = value;

      regExp[key] = "(?"+flags+")"+source;
    } else {
      let type = objectToString.call(value)

      if(
        type == "[object Object]"
        || type == "[object Array]"
      ) {
        normalizeRegExp(value);
      }
    }
  }
}

slave.normalizeRegExp = (options) => options;

let db = master;

slave.createIndex({
  index: {
    fields: designMovies.views.filter.options.def.fields,
    name : "filter",
    ddoc : "movies"
  }
}).then(
  () =>  slave.replicate.from(master)
).then(
  () => { db = slave; }
);



export default {
  //all reads from master or slave when ready
  allDocs(...options) {
    return db.allDocs(...options);
  },
  get(...options) {
    return db.get(...options);
  },
  query(...options) {
    return db.query(...options);
  },
  find(...options) {
    db.normalizeRegExp(options);

    return db.find(...options);
  },
  getAttachment(...options) {
    return db.getAttachment(...options);
  },

  //all writes to master
  bulkDocs(...options) {
    return master.bulkDocs(...options);
  },
  put(...options) {
    return master.put(...options);
  },
  removeAttachment(...options) {
    return master.removeAttachment(...options);
  },
  putAttachment(...options) {
    return master.putAttachment(...options);
  },
  close() {
    return Promise.all([
      slave.close(),
      master.close()
    ]);
  },
  RegExp : (
    process.browser
      ?RegExp
      :(pattern, modifier) => `(?${modifier})${pattern}`
  )
};
