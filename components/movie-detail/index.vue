<template>

  <section
    id="detail"
    itemscope
    itemtype="http://schema.org/Movie"
  >
    <nuxt-link
      :to="'/movies'+querystring+offset"
      class="backClose"
    />
    <div class="content">
      <nuxt-link
        :to="'/movies'+querystring+offset"
        class="close"
      >x</nuxt-link>

      <h1 itemprop="name">{{ details.title }}</h1>

      <img
        :src="details.img"
        :alt="'Image of the movie '+ details.title"
        height="200"
        width="650"
        itemprop="image"
      >

      <ul class="filter_list">
        <li v-if="details.directors.length">
          <h2>Director</h2>
          <ul>
            <li
              v-for="(director, key) in details.directors"
              :key="key"
              itemprop="director"
            >
              {{ director }}
            </li>
          </ul>
        </li>

        <li>
          <h2>Release Year</h2>
          <time
            :datetime="details.release_year"
            itemprop="datePublished"
          >
            {{ details.release_year }}
          </time>
        </li>

        <li v-if="details.actors.length">
          <h2>Actors</h2>
          <ul>
            <li
              v-for="(actor, key) in details.actors"
              :key="key"
            >
              {{ actor }}
            </li>
          </ul>
        </li>

        <li v-if="details.locations.length">
          <h2>Locations</h2>
          <ul>
            <li
              v-for="(location, key) in details.locations"
              :key="key"
            >
              {{ location }}
            </li>
          </ul>
        </li>


        <li v-if="details.writers.length">
          <h2>Writers</h2>
          <ul>
            <li
              v-for="(writer, key) in details.writers"
              :key="key"
            >
              {{ writer }}
            </li>
          </ul>
        </li>

        <li v-if="details.producers.length">
          <h2>Producers</h2>
          <ul>
            <li
              v-for="(producer, key) in details.producers"
              :key="key"
            >
              {{ producer }}
            </li>
          </ul>
        </li>

        <li v-if="details.distributors.length">
          <h2>Distributors</h2>
          <ul>
            <li
              v-for="(distributor, key) in details.distributors"
              :key="key"
            >
              {{ distributor }}
            </li>
          </ul>
        </li>

        <li v-if="details.fun_facts">
          <h2>Fun Facts</h2>
          <p>{{ details.fun_facts }}</p>
        </li>

      </ul>

      <div class="footer">

        <form
          action="https://www.facebook.com/sharer/sharer.php"
          target="_blank"
          method="GET"
        >
          <input
            type="hidden"
            name="display"
            value="popup"
          >
          <input
            :value="share_url"
            type="hidden"
            name="u"
          >
          <input
            type="image"
            src="/img/facebook.png"
          >
        </form>

        <form
          action="https://plus.google.com/share"
          target="_blank"
          method="GET"
        >
          <input
            :value="share_url"
            type="hidden"
            name="url"
          >
          <input
            type="image"
            src="/img/google.png"
          >
        </form>


        <form
          action="https://twitter.com/intent/tweet"
          target="_blank"
          method="GET"
        >
          <input
            type="hidden"
            name="via"
            value="Film SF"
          >
          <input
            :value="share_url"
            type="hidden"
            name="url"
          >
          <input
            type="hidden"
            name="text"
            value="Say something about it"
          >
          <input
            type="hidden"
            name="hashtags"
            value="movies, film. San Francisco"
          >

          <input
            type="image"
            src="/img/twitter.png"
          >
        </form>

      </div>
    </div>


  </section>
</template>

<script src="./controller.js"/>
<style lang="scss" src="./style.scss" scoped>
