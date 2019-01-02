import { mapGetters } from "vuex";
import MovieStore from "./store.js";
import MovieFilter from "~/components/filter/index.vue";

import { stringify } from "qs";

export default {
  asyncData(context) {
    let store = context.store;

    context.$injectStore("movies", MovieStore, store);

    return store.dispatch("init", context.query)
      .then(() => store.state.movies)
    ;
  },
  watch : {
    "filter" : {
      handler() {
        this.$store.dispatch("fetchPool");
      },
      deep : true
    },
    "$route.query.offset" : {
      handler(offset) {
        console.log("offset changed");
        let store = this.$store;

        store.commit("init", { offset });

        store.dispatch("fetch").then(() => {
          document.documentElement.scrollTop = 0;
        });
      }
    }
  },
  beforeCreate() {
    this.$injectStore("movies", MovieStore, this.$store)
  },
  computed : {
    ...mapGetters(
      Object.keys(MovieStore.getters)
    )
  },
  destroyed() {
    this.$store.unregisterModule("movies");
  },
  //watchQuery : ["offset"],
  components : {
    MovieFilter
  },
};
