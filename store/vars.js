const host = "localhost";
const protocol = "http";

export default {
  site_name : "Film San Francisco",
  site_url : protocol+"://"+host
};
export const couchdb = {
  host : host,
  port : 5984,
  protocol : "http",
  database : "film_sf",
  reader : false,
  reader_password : "8JVkYanY2s6KMjPY"
};
