<template>
  <section class="dialog">
    <span id="open_filter"/>
    <span id="close_filter"/>

    <nuxt-link
      class="logo"
      to="/"
    >
      <img
        src="~/assets/logo.svg"
        height="50"
      >
    </nuxt-link>

    <form
      action="/"
      class="content"
      @submit.stop.prevent
    >
      <h2>Filter Movies</h2>
      <section>
        <h3>Titel</h3>
        <Info>The title must contain this pattern</Info>
        <input
          :value="title"
          name="title"
          type="text"
          aria-label="only include movies containing this title"
          @input="setItem"
        >
      </section>
      <section>
        <h3>Release Year</h3>
        <Info>Limit the result by release year</Info>
        <MultiRange
          :min="min_year"
          :max="max_year"
          :min-value="release_year_min"
          :max-value="release_year_max"
          name="release_year"
          aria-min="minimal year"
          aria-max="maximal year"
          @input.native="setItem"

        />
      </section>


      <section>
        <h3>Collaborators</h3>
        <Info>Includes all movies where at least one collaborator was assigned to.</info>

        <fieldset class="index">
          <table v-if="collaborators.length">
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
            </thead>
            <tbody aria-label="list of all assign collaborators">
              <tr
                v-for="(collaborator, key) in collaborators"
                :key="key"
              >
                <td>
                  <RoleSelect
                    :name="'collaborators['+key+'][role]'"
                    :value="collaborator.role"
                    @change.native="setListItem($event, 'collaborators', key, 'role')"
                  />
                </td>
                <td>
                  <input
                    :value="collaborator.name"
                    :name="'collaborators['+key+'][name]'"
                    type="text"
                    @input="setListItem($event, 'collaborators', key, 'name')"
                  >
                </td>
                <td>
                  <input
                    :formaction="'/movies/filter/remove/collaborators/'+key"
                    :aria-label="'remove collaborator '+collaborator.name+' from filter'"
                    type="submit"
                    class="button remove"
                    value=" "
                    @click="removeListItem('collaborators', key)"
                  >
                </td>
              </tr>
            </tbody>
          </table>
          <label class="add_item">
            <b>Add Collaborator</b>
            <input
              :aria-label="'add new collaborator to filter'"
              formaction="/movies/filter/add/collaborators"
              type="submit"
              class="button add"
              value=" "
              @click="addListItem('collaborators')"
            >
          </label>
        </fieldset>
      </section>

      <section>
        <h3>Locations</h3>
        <Info>Includes all movies that took place in one of these locations</info>
        <fieldset class="index">
          <ul aria-label="list of all assign locations">
            <li
              v-for="(location, key) in locations"
              :key="key"
              class="filter_list"
            >
              <input
                :value="location"
                :name="'locations[]'"
                :aria-label="'edit location '+location"
                type="text"
                @input="setListItem($event, 'locations', key)"
              >
              <input
                :formaction="'/movies/filter/remove/locations/'+key"
                :aria-label="'remove location '+location+' from filter'"
                type="submit"
                class="button remove"
                value=" "
                @click="removeListItem('locations', key)"
              >
            </li>
          </ul>
          <label class="add_item">
            <b>Add Location</b>
            <input
              formaction="/movies/filter/add/locations"
              type="submit"
              class="button add"
              value=" "
              @click="addListItem('locations')"
            >
          </label>
        </fieldset>
      </section>

      <section class="footer">
        <nuxt-link
          to="/movies"
          class="button red"
          @click.stop.prevent.native="clear"
        >
          reset
        </nuxt-link>
        <input
          type="submit"
          value="filter"
          class="nojs button red"
        >
      </section>
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
  @import "./style";

  @media (min-width : 800px) {
    @import "./large";
  }

  @media (max-width : 799px) {
    @import "./small";
  }
</style>
<script src="./controller.js"/>
