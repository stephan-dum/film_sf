const axios = require("axios");
const fs = require("fs");
const path = require("path");
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
  queue = [
    axios({
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
    })
  ];

  if(offset == 0) {
    queue.push(
      axios({
        method : "GET",
        url : "https://data.sfgov.org/resource/wwmu-gmzc.json",
        params : {
          $where : ":updated_at >= '"+since+"'",
          $select : "min(release_year) as min_year, max(release_year) as max_year"
        }
      }).then((response) => {
        let {
          min_year,
          max_year
        } = response.data[0];

        return db.allDocs({
          key : "meta"
        }).then((response) => {
          return db.put({
            _id : "meta",
            _rev : response.rows[0].value.rev,
            min_year,
            max_year
          });
        })
      })
    );
  }


  return Promise.all(queue);
}

function persistentReplication(
  db,
  fileId = path.join(__dirname, "./curr.date")
) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileId, function(error, since) {
      if(error) {
        return reject(error);
      }

      replicate(db, since.toString().trim()).then(([lastUpdate]) => {
        fs.writeFile(fileId, lastUpdate, (error) => {
          if(error) {
            return reject(error);
          }

          resolve();
        });
      });
    });
  });
}

module.exports = {
  persistentReplication,
  replicate,
  sync
}
