const { persistentReplication } = require("../couchdb/replicator.js");
import pouchDB from "../store/pouchDB.js";

persistentReplication(pouchDB).then((response) => {
  console.log("sync complete", response);
});
