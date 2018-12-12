#!/usr/bin/env node
"use strict";

const imageLoader = require("../couchdb/image_loader.js");
const pouchDB = require("../store/pouchDB.js");

imageLoader(pouchDB).then(
  () => { console.log("image sync complete")},
  console.warn
);
