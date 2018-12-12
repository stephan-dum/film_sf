# Film San Francisco

## Build Stack
- [Nuxt.js](https://nuxtjs.org)
- [PouchDB](https://pouchdb.com)

## Highlights
- independent using replication
- server side rendering
- progressive enhancement
- offline

## Kown Issues
- refactoring needed
- better data model (see ./doc/er.pdf)
- testing incomplete
- thumbs and images are not the same
- no srcset
- multi-range flashing on load
- scrolltop for detail on seconds detail view (potential nuxt issue)

## Install
First get [Couchdb](http://docs.couchdb.org/en/stable/install/unix.html), and add the document `./couchdb/design_movies`.  Then configure the `./store/vars.js` file to fit you setup. Next open a terminal and do:

```bash
  #get the repo
  git clone git@github.com:stephan-dum/film_sf.git

  #install dependencies
  npm install

  #install rollup
  npm i rollup -D

  #build the replication
  rollup ./bin/replicate.js --file ./bin/replicate.min.js --format cjs
  rollup ./bin/picsum.js --file ./bin/picsum.min.js --format cjs

  #replicate the data
  node ./bin/replicate.min.js

  #get some images, this may take a while
  #will get save to ./static/img/movies
  node ./bin/picsum.min.js

  #build
  npm run build

  #start
  npm run start

  #or for development
  npm run dev
```
## Feedback
is always welcome :-)

## License
ISC
