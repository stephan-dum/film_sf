
import query from "../store/index.js";
const PouchDB = require('pouchdb-memory');
const db = PouchDB("testdb")

db.bulkDocs([
  {
    "_id": "180",
    "_rev": "2-548f5c3ce2f8eeb2a73cf4bedbd959fd",
    "movie_id": "row-m99r~gea6_qnzc",
    "title": "180",
    "release_year": 2011,
    "fun_facts": null,
    "actors": [
      "Siddarth",
      "Nithya Menon",
      "Priya Anand"
    ],
    "producers": [
      "SPI Cinemas"
    ],
    "directors": [
      "Jayendra"
    ],
    "distributors": [],
    "locations": [
      "Epic Roasthouse (399 Embarcadero)"
    ],
    "writers": [
      "Umarji Anuradha",
      " Jayendra",
      " Aarthi Sriram& Suba"
    ],
    "img": "/img/movies/row-m99r~gea6_qnzc.jpg",
    "img_thumb": "/img/movies/row-m99r~gea6_qnzc_thumb.jpg"
  }, {
    "_id": "1801",
    "title": "1801",
  }
])

describe("filter", function() {
  it("should filter title", function(resolve) {
    query(db, { title : "1"}).then((response) => {
      let docs = response.docs;

      expect(docs.length).to.equal(2);
      expect(response)
    })
  })
})
