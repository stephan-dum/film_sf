# Film San Francisco

[Live Demo](https://filmsf.uber.space/movies)

## Build Stack
- [Nuxt.js](https://nuxtjs.org)
- [PouchDB](https://pouchdb.com)

## Highlights
- independent data using replication
- reduced the data to ~ 300 docs (~1600 initial)
- server side rendering
- progressive enhancement

## Kown Issues
- refactoring needed
- better data model (see ./doc/er.pdf)
- no webworker, no offline
- testing incomplete
- thumbs and images are not the same
- no srcset
- pouchdb indizes issues
- unhandeld cors errors from cloudant
- no error pages
- multi-range issues
- scrolltop for detail on seconds detail view (potential nuxt issue)

## Install
First get [Couchdb](http://docs.couchdb.org/en/stable/install/unix.html), and add the document `./couchdb/design_movies`.  Then configure the `./store/vars.js` file to fit you setup. Next open a terminal and do:

```bash
  #get the repo
  git clone git@github.com:stephan-dum/film_sf.git

  #install dependencies
  npm install

  #install rollup
  npm i rollup -g

  #build the replication
  rollup ./bin/replicate.js --file ./bin/replicate.min.js --format cjs
  rollup ./bin/picsum.js --file ./bin/picsum.min.js --format cjs

  #replicate the data
  node ./bin/replicate.min.js

  #get some images from picsum, this may take a while
  #will save to ./static/img/movies
  node ./bin/picsum.min.js

  #build
  npm run build

  #start
  npm run start

  #or for development
  npm run dev
```
## Copyright
All images from [picsum.photos](https://picsum.poto), logo and favicon from [freepik.com](https://freepik.com)

## Feedback
is always welcome :-)

## License
ISC
