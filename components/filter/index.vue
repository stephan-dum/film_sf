<template>
  <section class="dialog">
    <span id="open_filter"/>
    <span id="close_filter"/>

    <nuxt-link
      class="logo"
      to="/#"
    >
      <img
        src="~/assets/logo.svg"
        height="50"
      >
    </nuxt-link>

    <form
      action="/"
      class="content"
      @submit.stop.prevent="submit"
    >
      <h2>Filter Movies</h2>
      <div>
        <h3>Titel</h3>
        <input
          :value="filter.title"
          name="title"
          type="text"
          aria-label="only include movies containing this title"
          @change="syncState"
        >
      </div>
      <div @change="syncState">
        <h3>Release Year</h3>
        <MultiRange
          :min="min_year"
          :max="max_year"
          :min-value="filter.release_year_min"
          :max-value="filter.release_year_max"
          name="release_year"
          aria-label="limit movies by their release year"

        />
      </div>

      <div>
        <h3>Locations</h3>
        <p>Includes all movies that took place in one of these locations</p>

        <input
          type="text"
          name="insert_location"
          aria-label="add locations to the filter"
          @focusout="addLocation"
        >

        <ul aria-label="list of all assign locations">
          <li
            v-for="(location, key) in filter.locations"
            :key="key"
            class="filter_list"
          >
            <input
              :value="location"
              :name="'locations[]'"
              type="text"
              @change="setLocation($event, key)"
            >
            <input
              :formaction="'/movies/filter/remove/locations/'+location"
              :aria-label="'remove location '+location+' from filter'"
              type="submit"
              value="x"
              @click="removeLocation(key)"
            >
          </li>
        </ul>
      </div>

      <div>
        <h3>Collaborators</h3>
        <p>Includes all movies where at least one collaborator was assigned to.</p>

        <fieldset>
          <table>
            <colgroup>
              <col>
              <col class="grow">
              <col>
            </colgroup>
            <thead>
              <tr>
                <th>Role</th>
                <th colspan="2">Name</th>
              </tr>
              <tr>
                <td>
                  <RoleSelect
                    :value="insertRole"
                    name="insert_collaborator[role]"
                  />
                </td>
                <td colspan="2">
                  <input
                    type="text"
                    name="insert_collaborator[name]"
                    aria-label="add Collaborators to the filter"
                    @focusout="addCollaborator"
                  >
                </td>
              </tr>
            </thead>
            <tbody aria-label="list of all assign collaborators">
              <tr
                v-for="(collaborator, key) in filter.collaborators"
                :key="key"
              >
                <td>
                  <RoleSelect
                    :name="'collaborators['+key+'][role]'"
                    :value="collaborator.role"
                    @change="setCollaborator($event, key, 'role')"
                  />
                </td>
                <td>
                  <input
                    :value="collaborator.name"
                    :name="'collaborators['+key+'][name]'"
                    type="text"
                    @change="setCollaborator($event, key, 'name')"
                  >
                </td>
                <td>
                  <input
                    :formaction="'/movies/filter/remove/collaborators/'+collaborator.name+'/'+collaborator.role"
                    :aria-label="'remove collaborator '+collaborator.name+' from filter'"
                    type="submit"
                    value="x"
                    class="remove_collaborator"
                    @click="removeCollaborator(key)"
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </fieldset>
      </div>
      <div class="footer">
        <nuxt-link
          to="/movies"
          @click.native="clearFilter"
        >
          reset
        </nuxt-link>
        <input
          type="submit"
          value="filter"
          class="nojs"
        >
      </div>
    </form>

    <div class="toggler">
      <div/>
      <div/>
      <div/>
      <a
        class="close"
        href="#close_filter"
      />
      <a href="#open_filter"/>
    </div>

  </section>
</template>
<style lang="scss" scoped>


  .dialog {
    position: fixed;
    top: 1.17em;
    left: 1em;
    width: 300px;
    box-sizing: border-box;
    border: 1px solid $color_main;
    background-color:$color_white;
    z-index:1;
  }
  h2 {
    font-size:1.25em;
  }
  h3 {
    margin-bottom:0.5em;
  }

  table {
    width:100%;
    border-spacing: 0;
    border-collapse: collapse;
  }

  tr, td {
    height : 100%;
  }

  .remove_collaborator {
    height:calc(100% - 2px);
  }
  .filter_list {
    display:flex;
    padding-top:0.25em;

    > [type="submit"] {
      margin-left:0.125em;
    }
  }
  .footer {
    text-align:right;
    padding: 0.5em 0;

    input[type="submit"],
    a {
      padding: 0.5em 1em;
    }
  }

  .footer a,
  input[type="submit"] {
    border:1px solid $color_main;
    display:inline-block;
    background-color:$color_main;
    color:$color_white;
    cursor: pointer;
    font-size:1em;

    &:hover {
      background-color:$color_white;
      border-color:$color_black;
      color:$color_black;
    }
  }

  input[type="text"] {
    width:100%;
    border:1px solid $color_black;
    padding:0.5em;
    box-sizing:border-box;
    outline:none;
    height:2em;
  }

  fieldset {
    padding: 0;
    margin: 0;
    border: 0;
  }
  .logo {
    display:inline-block;
    padding:0.5em;
    box-sizing:border-box;
  }
  .content {
    padding:0.5em;
    box-sizing:border-box;
  }

  @import "./style";

  @media (min-width : 800px) {
    @import "./large";
  }

  @media (max-width : 799px) {
    @import "./small";
  }
</style>
<script>
  import MultiRange from '~/components/multi-range/index.vue';
  import RoleSelect from '~/components/role-select/index.vue';

  export default {
    components : {
      MultiRange,
      RoleSelect
    },
    data() {
      return this.$parent.$store.state;
    },
    methods : {
      submit() {
        this.$parent.$router.push({ query : this.$store.state.filter });
      },
      syncState(event) {
        let { name, value } = event.target;

        this.$store.dispatch("setFilter", { [name] : value });

        this.$parent.$router.push({
          query : {
            ...this.$store.state.filter,
            [name] : value
          }
        });
      },
      addLocation(event) {
        let name = event.target.value;

        if(name) {
          this.$store.commit("addLocation", name);
          event.target.value = "";
          this.$store.dispatch("setFilter");
        }
      },
      addCollaborator(event) {
        let name = event.target.value;

        if(name) {
          event.target.value = "";
          return this.$store.dispatch("addCollaborator", name);
        }
      },
      setLocation(event, row) {
        this.$store.commit("setLocation", [row, event.target.value]);
        this.$store.dispatch("setFilter");
      },
      setCollaborator(event, row, property) {
        this.$store.commit("setCollaborator", [row, property, event.target.value]);
        this.$store.dispatch("setFilter");
      },
      removeCollaborator(row) {
        this.$store.dispatch("removeCollaborator", row);
      },
      removeLocation(row) {
        this.$store.commit("removeLocation", row);
        this.$store.dispatch("setFilter");
      },
      clearFilter() {
        this.$store.dispatch("clearFilter");
      }
    }
  }
</script>
