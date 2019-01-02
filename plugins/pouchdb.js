import db from "~/couchdb/index.js";

export default function(context, inject) {
  context.store.db = db;
}
