export default {
  render() {},
  data() {
    let { type, key } = this.$route.params;

    this.$router.replace({
      path : "/movies",
      query : this.$route.query
    }, () => {
      this.$store.commit("filter/removeListItem", [type, key]);
    });

    return {};
  }
}
