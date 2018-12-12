const axios = require("axios");
const LIMIT = 1000;

function splitField(keyString) {
  return (
    keyString
      ?keyString.trim().replace(/,\s*&/, "&").split(",")
      :[]
  );
}

function sync(db, documents) {
  let keys = new Set;

  documents = documents.filter((document) => {
    let title = document.title;

    if(keys.has(title)) {
      return false;
    }

    return keys.add(title);
  });

  return db.allDocs({
    include_docs : true,
    keys : Array.from(keys)
  }).then((response) => {
    let rows = response.rows;
    let updateDocs = [];
    let queue = [];

    documents.forEach((original, i) => {
      let {
        movie_id,
        title,
        release_year,
        fun_facts = null,
        locations,
        actor_1,
        actor_2,
        actor_3,
        production_company,
        distributor,
        director,
        writer
      } = original;

      let row = rows[i];


      let doc = Object.assign(
        row.doc || {},
        {
          _id : title,
          movie_id,
          title,
          release_year : parseInt(release_year),
          fun_facts,
          actors : [
            ...splitField(actor_1),
            ...splitField(actor_2),
            ...splitField(actor_3)
          ],
          producers : splitField(production_company),
          directors : splitField(director),
          distributors : splitField(distributor),
          locations : splitField(locations),
          writers : splitField(writer)
        }
      )

      updateDocs.push(doc);
    });

    return db.bulkDocs(updateDocs);
  }, console.warn);
}

function replicate(db, since, offset = 0) {
  return axios({
    method : "GET",
    url : "https://data.sfgov.org/resource/wwmu-gmzc.json",
    params : {
      $where : ":updated_at >= '"+since+"'",
      $limit : LIMIT,
      $select : "*,:id as movie_id, :updated_at",
      $order : " :updated_at",
      $offset : LIMIT*offset
    }
  }).then((response) => {
    let data = response.data;

    return sync(db, data).then(() => {
      if(data.length == LIMIT) {
        return replicate(db, since, ++offset);
      }

      return data[data.length-1][":updated_at"];;
    });
  });
}

function persistentReplication(db) {
  return db.allDocs({
    include_docs : true,
    key : "meta"
  }).then((response) => {
    let doc = (
      response.rows.length
        ?response.rows[0].doc
        :{}
    );

    let since = doc.since || "1970-01-01";

    return Promise.all([
      axios({
        method : "GET",
        url : "https://data.sfgov.org/resource/wwmu-gmzc.json",
        params : {
          $where : ":updated_at >= '"+since+"'",
          $select : "min(release_year) as min_year, max(release_year) as max_year"
        }
      }).then((response) => response.data[0], console.warn),
      replicate(db, since)
    ]).then(
      ([year, since]) => db.put({
        _id : "meta",
        _rev : doc._rev,
        since,
        ...year
      }).catch(console.warn)
    );
  });
}

module.exports = {
  persistentReplication,
  replicate,
  sync
}
