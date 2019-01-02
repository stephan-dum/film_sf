import { mapGetters } from "vuex";
import MultiRange from '~/components/multi-range/index.vue';
import RoleSelect from '~/components/role-select/index.vue';
import Info from '~/components/info/index.vue';

import escapeStringRegexp from "escape-string-regexp";

export default {
  components : {
    MultiRange,
    RoleSelect,
    Info
  },
  data() {
    return this.$parent.filter;
  },
  methods : {
    addListItem(list) {
      this.$store.commit("filter/addListItem", list);
    },
    setListItem(event, list, key, property) {
      this.$store.commit("filter/setListItem", [
        list,
        key,
        event.target.value,
        property
      ]);
    },
    removeListItem(list, key) {
      this.$store.commit("filter/removeListItem", [list, key]);
    },
    setItem(event) {
      let { name, value } = event.target;

      this.$store.commit("filter/setItem", [name, value]);
    },
    clear(event) {
      this.$store.commit("filter/clear");
    }
  }
}
