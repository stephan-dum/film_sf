<template>
  <div class="select_edge">
    <input
      type="button"
      class="opener"
    >
    <fieldset class="list">
      <ul>
        <li>
          <label>
            <input
              :name="name"
              :checked="value == 'any'"
              type="radio"
              value="any"
            >
            <div class="label">Any</div>
          </label>
        </li>
        <li>
          <label>
            <input
              :name="name"
              :checked="value == 'actors'"
              type="radio"
              value="actors"
            >
            <div class="label">Actor</div>
          </label>
        </li>
        <li>
          <label>
            <input
              :name="name"
              :checked="value == 'directors'"
              type="radio"
              value="directors"
            >
            <div class="label">Director</div>
          </label>
        </li>

        <li>
          <label>
            <input
              :name="name"
              :checked="value == 'writers'"
              type="radio"
              value="writers"
            >
            <div class="label">Writer</div>
          </label>
        </li>
        <li>
          <label>
            <input
              :name="name"
              :checked="value == 'producers'"
              type="radio"
              value="producers"
            >
            <div class="label">Producer</div>
          </label>
        </li>
        <li>
          <label>
            <input
              :name="name"
              :checked="value == 'distributors'"
              type="radio"
              value="distributors"
            >
            <div class="label">Distributor</div>
          </label>
        </li>
      </ul>
    </fieldset>
  </div>
</template>

<style lang="scss" src="./style.scss" scoped/>
<script src="./controller.js"/>
