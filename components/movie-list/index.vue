<template>
  <main>
    <section id="movies">
      <h1>Movies made in San Francisco</h1>
      <div
        class="flex list"
      >
        <article
          v-for="(movie, key) in movies"
          :key="key"
          class="fluid"
          itemscope
          itemtype="http://schema.org/Movie"
        >
          <nuxt-link :to="'/movies/'+movie.title+querystring+offset">
            <img
              :alt="'Image of '+movie.title"
              :src="movie.img_thumb"
              width="150"
              height="150"
              itemprop="thumbnailUrl"
            >
            <h3 itemprop="name">{{ movie.title }}</h3>
          </nuxt-link>
          <ul>
            <li>
              <span
                itemprop="director"
                aria-label="Director"
              >
                {{ (movie.directors || []).join("") }}
              </span>
            </li>
            <li>
              <time
                :datetime="movie.release_year"
                itemprop="datePublished"
                aria-label="Release year"
              >
                {{ movie.release_year }}
              </time>
            </li>
          </ul>
        </article>
      </div>

      <div
        v-if="movies.length"
        class="footer flex"
      >
        <span>
          <nuxt-link
            v-if="previous"
            :to="previous"
            rel="prev"
          >
            previous page
          </nuxt-link>
        </span>
        <span id="stats">
          {{ stats }}
        </span>
        <span>
          <nuxt-link
            v-if="next"
            :to="next"
            rel="next"
          >
            next page
          </nuxt-link>
        </span>
      </div>
      <div
        v-else
        class="noEntry"
      >
        No Entry found, adjust the filter!
      </div>
    </section>

    <MovieFilter/>
    <nuxt/>
  </main>
</template>
<style lang="scss" src="./style.scss" scoped/>
<script src="./controller.js"/>
