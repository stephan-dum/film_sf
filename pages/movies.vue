
<template>
  <main>
    <section id="movies">
      <h1>Movies made in San Francisco</h1>
      <div
        class="flex list"
      >
        <article
          v-for="(movie, key) in movies"
          :key="key"
          class="fluid"
          itemscope
          itemtype="http://schema.org/Movie"
        >
          <nuxt-link :to="'/movies/'+movie.title+querystring+offset">
            <img
              :alt="'Image of '+movie.title"
              :src="movie.img_thumb"
              width="150"
              height="150"
              itemprop="thumbnailUrl"
            >
            <h3 itemprop="name">{{ movie.title }}</h3>
          </nuxt-link>
          <ul>
            <li>
              <span
                itemprop="director"
                aria-label="Director"
              >
                {{ (movie.directors || []).join("") }}
              </span>
            </li>
            <li>
              <time
                :datetime="movie.release_year"
                itemprop="datePublished"
                aria-label="Release year"
              >
                {{ movie.release_year }}
              </time>
            </li>
          </ul>
        </article>
      </div>

      <div
        v-if="movies.length"
        class="footer flex"
      >
        <nuxt-link
          v-show="offset > 0"
          :to="querystring+(offset - 1)"
          rel="prev"
          @click.native="scrollTop"
        >
          previous page
        </nuxt-link>
        <span class="grow_1">
          Entry {{ offset*limit+1 }} to {{ (offset*limit)+movies.length }}
        </span>
        <nuxt-link
          v-show="movies.length == limit && hasNext"
          :to="querystring+(offset + 1)"
          relf="next"
          @click.native="scrollTop"
        >
          next page
        </nuxt-link>
      </div>
      <div
        v-else
        class="noEntry"
      >
        No Entry found, adjust the filter!
      </div>
    </section>

    <MovieFilter/>
    <nuxt/>
  </main>
</template>
<style lang="scss" scoped>
  colgroup > .grow {
    width:100%;
  }
  body.nojs .nojs {
    display:none;
  }

  main {
    display:flex;
    flex-direction:column;
    flex-grow:1;
  }

  #movies {
    flex-grow:1;
    position:relative;

    > h1 {
      padding: 0 0.25em;
      font-size:2em;
    }

    > .list {
      width:100%;
      flex-wrap:wrap;
    }
  }
  .fluid {
    padding:1em;
    box-sizing:border-box;
    position:relative;
    z-index:0;
    display:flex;
    flex-direction:column;


    &:before {
      content : "";
      position:absolute;
      top:0.5em;
      left:0.5em;
      right:0.5em;
      bottom:0.5em;
      background-color:$color_white;
      z-index:-1;
    }
    > h3 {
      flex-grow:1;
    }
    img {
      height: auto;
      width: 100%;
    }
  }
  .noEntry {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .footer {
    padding:1em;

    a:first-child {
      &:before {
        content : "<";
        color:$color_black;
      }
      &:hover:before {
        color:$color_main;
      }
    }
    a:last-child {
      &:after {
        content : ">";
        color:$color_black;
      }
      &:hover:after {
        color:$color_main;
      }
    }
    > span {
      text-align:center;
      font-size:0.75em;
      font-weight:bold;
    }
  }
  @media (max-width:464px) {
    .fluid {
      width:100%;
    }
  }
  @media (min-width:465px) and (max-width:599px) {
    .fluid {
      width:50%;
    }
  }
  @media (min-width:600px) and (max-width:799px) {
    .fluid {
      width:33.33%;
    }
  }

  @media (max-width:799px) {
    #movies {
      padding-top:3.5em;
    }
    h1 {
      text-align:center;
    }
  }

  @media (min-width:800px) and (max-width:949px) {
    .fluid {
      width:50%;
    }
  }

  @media (min-width:950px) and (max-width:1099px) {
    .fluid {
      width:33.33%;
    }
  }

  @media (min-width:1100px) and (max-width:1249px) {
    .fluid {
      width:25%;
    }
  }

  @media (min-width:1250px) and (max-width:1399px) {
    .fluid {
      width:20%;
    }
  }

  @media (min-width:1400px) {
    .fluid {
      width:16.66%;
    }
  }


  @media (min-width : 800px) {
    #movies {
      margin-left:300px;
      padding:0 0.5em;
      padding-left:1.5em;
      max-width:1400px;
    }
  }

</style>
<script>
  import MovieFilter from "~/components/filter/index.vue";

  export default {
    asyncData(context) {
      let store = context.store;

      let { type, name, role } = context.route.params;

      if(type) {
        let index;
        let filter = context.query;

        if(type == "locations") {
          index = filter.locations.indexOf(name);
        } else if(type == "collaborators") {
          index = filter.collaborators.findIndex((collaborator) => {
            return collaborator.name == name && collaborator.role == role;
          });
        }

        if(index >= 0) {
          filter[type].splice(index, 1);
        }
      }

      return Promise.all([
        store.dispatch("setMeta"),
        store.dispatch("setFilter", context.query)
      ]).then(() => store.state);
    },
    watchQuery : true,
    components : {
      MovieFilter
    },
    methods : {
      scrollTop(e) {
        document.documentElement.scrollTop = 0;
      }
    }
  };
</script>
