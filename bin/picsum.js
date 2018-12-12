const imageLoader = require("../couchdb/image_loader.js");
import pouchDB from "../store/pouchDB.js";

imageLoader(pouchDB).then(
  () => { console.log("image sync complete")},
  console.warn
);
