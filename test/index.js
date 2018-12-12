function test() {
  const PouchDB = require("pouchdb");
  const db = new PouchDB("film_sf");

  replicate(db, "1970-01-01").then(() => {
    console.log("sync complete");
  }, console.warn);

}


test();
