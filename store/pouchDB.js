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

let url = protocol+"://";

if(reader) {
  url += reader+":"+reader_password+"@";
}

url += host;

if(port) {
  url += ":"+port;
}

const pouchDB = new PouchDB(url+"/"+database, {
  ajax : {
    headers : {
      'Access-Control-Allow-Origin' : "*"
      //Header set Access-ControlAllow-Methods  "GET, POST, PATCH, PUT, DELETE, OPTIONS"
      //Access-Control-Allow-Headers: "Origin, Content-Type, X-Auth-Token"
    },
    fetch: function (url, opts) {
      opts.headers.set('Access-Control-Allow-Origin', '*');
      return PouchDB.fetch(url, opts);
    }
  }
});

export default pouchDB;
