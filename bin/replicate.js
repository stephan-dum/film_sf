#!/usr/bin/env node
"use strict";

const { persistentReplication } = require("../couchdb/replicator.js");
const pouchDB = require("../store/pouchDB.js");

persistentReplication(pouchDB).then((response) => {
  console.log("sync complete", response);
});
