{
  "_id": "_design/movies",
  "language": "query",
  "views": {
    "title": {
      "map": {
        "fields": {
          "title": "asc"
        },
        "partial_filter_selector": {}
      },
      "reduce": "_count",
      "options": {
        "def": {
          "fields": [
            "title"
          ]
        }
      }
    }
  }
}
