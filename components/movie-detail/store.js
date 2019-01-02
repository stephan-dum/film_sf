import { url } from "~/config/site.js";

const DetailStore = {
  state() {
    return {
      share_url : null,
      return_url : null,
      actors : [],
      directors : [],
      locations : [],
      writers : [],
      producers : [],
      distributors : []
    };
  },
  mutations : {
    set(state, details) {
      state.share_url = url+'/movies/'+details.title;
      state.details = details;
    }
  },
  actions : {
    fetch({ state, commit }, title) {
      return db.get(title).then((doc) => {
        this.commit("set", doc);
      });
    },
  }
}

export default DetailStore;
