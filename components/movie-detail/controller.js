import MovieDetailStore from "./store.js";

export default {
  head() {
    return {
      title : this.title,
      meta : [
        {
          property : "og:url",
          contents : this.url
        }, {
          property : "type",
          content : "article"
        }, {
          property : "title",
          content : this.title
        }, {
          property : "description",
          content : "Say something about it..."
        }, {
          property : "image",
          content : this.img_thumb
        }
      ]
    };
  },
  store : MovieDetailStore,
  asyncData(context) {
    let store = context.store;

    return store.dispatch("fetch", context.params._id).then(() => {
      return store.state;
    });
  },
  /*data() {
    //console.log("data in child", this.$parent.$store.state);
    return this.$parent.$store.state;
  }*/
}
