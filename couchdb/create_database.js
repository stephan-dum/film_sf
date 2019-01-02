import PouchDB from "pouchdb";
import find from "pouchdb-find";
PouchDB.plugin(find);

const objectToString = Object.prototype.toString;

export default function createDatebase(options) {
  if(objectToString.call(options) == "[object String]") {
    options = {
      database : options
    };
  }

  let {
    protocol,
    auth,
    host,
    port,
    database
  } = options;

  let url = [];

  if(protocol) {
    url.push(protocol+"://");
  }
  if(auth && auth.reader) {
    url.push(auth.reader+":"+(auth.password || "")+"@");
  }

  if(host) {
    url.push(host);
  }

  if(port) {
    url.push(":"+port);
  }

  if(url.length) {
    url.push("/");
  }

  url.push(database);

  return new PouchDB(url.join(""), {
    ajax : {
      fetch: function (url, options) {
        options.headers.set('Access-Control-Allow-Origin', '*');
        options.headers.set('Strict-Origin-When-Cross-Origin', 'no-referrer-when-downgrade');
        return PouchDB.fetch(url, options);
      }
    }
  });
}
