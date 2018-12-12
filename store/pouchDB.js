import { couchdb } from "./vars.js";
import Vue from "vue";
import PouchDB from "pouchdb";
import find from "pouchdb-find";

PouchDB.plugin(find);

let {
  protocol = "https",
  reader,
  reader_password,
  host,
  port,
  database
} = couchdb;

let url = protocol+"://"+reader+":"+reader_password+"@"+host;

if(port) {
  url += ":"+port;
}

const pouchDB = new PouchDB(url+"/"+database);

if(process.BROWSER_BUILD) {
  slave = new PouchDB(vars.couchdb_database);

  slave.replicate(pouchDB).then(
    () => { pouchDB = slave; }
  );
}


export default pouchDB;
