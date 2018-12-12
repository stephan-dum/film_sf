import query from "../store/index.js";
const data = require("./data");
const PouchDB = require('pouchdb-memory');
const db = PouchDB("testdb")

db.bulkDocs(data)

describe("filter", function() {
  it("should filter by title", function() {
    return query(db, { title : "180"}).then((response) => {
      let docs = response.docs;

      expect(docs.length).to.equal(2);
      expect(response[0].id.to.equal("1801"));
      expect(response[1].id.to.equal("180"));
    });
  });
  it("should match release year between two dates", function() {
    
  });

  it("should match if there is at least one location matches", function() {

  });

  it("should match if one collaborators and its roles matches", function() {

  });
})


/*replication*/
