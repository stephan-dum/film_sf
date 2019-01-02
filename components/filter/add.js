export default {
  render() {},
  data() {
    let { type } = this.$route.params;

    this.$router.replace({
      path : "/movies",
      query : this.$route.query
    }, () => {
      this.$store.commit("filter/addListItem", type);
    });

    return {};
  }
}
