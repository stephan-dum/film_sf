const axios = require("axios");
const fs = require("fs");
const path = require("path");

const PUBLIC_FOLDER = "https://filmsf.uber.space/img/movies/";
const STATIC_FOLDER = path.join(__dirname, "../static/img/movies");
const LIMIT = 5;

function getImage(dest, w, h = w) {
  return new Promise(
    (resolve, reject) => axios({
      method: 'GET',
      url: `https://picsum.photos/${w}/${h}?random`,
      responseType: 'stream'
    }).then(
      (response) => {
        let stream = fs.createWriteStream(dest)
          .on("end", resolve)
          .on("error", reject)
          .on("finish", resolve)
        ;

        response.data.pipe(stream);
      },
      reject
    )
  );
}

function imageLoader(db) {
  return db.find({
    limit : LIMIT,
    selector : {
      "$not" : {
        "_id" : "meta"
      },
      "img" : {
        "$exists" : false
      }
    }
  }).then((response) => {
    let queue = [];

    let updateDocs = response.docs.map((doc) => {
        let movie_id = doc.movie_id;

        doc.img = PUBLIC_FOLDER+movie_id+".jpg";
        doc.img_thumb = PUBLIC_FOLDER+movie_id+"_thumb.jpg";

        queue.push(
          getImage(path.join(STATIC_FOLDER, movie_id+".jpg"), 650, 200),
          getImage(path.join(STATIC_FOLDER, movie_id+"_thumb.jpg"), 150)
        );

        return doc;
    });

    return Promise.all(queue).then(
      () => db.bulkDocs(updateDocs),
      (error) => {
        console.log("connection gone bad lets wait 3 seconds");
        //Origin Connection Limit Reached
        if(error.response.status == 531) {
          return new Promise((resolve) => {
            setTimeout(resolve, 3000);
          });
        }
      }
    ).then(() => {
      if(updateDocs.length == LIMIT) {
        return imageLoader(db);
      }
    });
  });
}

module.exports = imageLoader;
