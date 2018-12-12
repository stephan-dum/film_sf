<template>
  <select
    :name="name"
    :value="value"
    @change="setValue"
  >
    <option value="any">Any</option>
    <option value="actors">Actor</option>
    <option value="directors">Director</option>
    <option value="writers">Writer</option>
    <option value="producers">Producer</option>
    <option value="distributor">Distributor</option>
  </select>
</template>

<style lang="scss" scoped>
  select {
    height:2em;
  }
</style>

<script>
  export default {
    props : {
      name : {
        type : String,
        required : true
      },
      value : {
        type : String,
        default : "any"
      }
    },
    methods : {
      setValue(event) {
        this.$store.commit("setInsertRole", event.target.value);
      }
    }
  }
</script>
