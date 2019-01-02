<template>
  <div class="multirange">
    <label
      :aria-label="ariaMin"
      class="min"
    >
      <input
        :type="type"
        :step="step"
        :min="min"
        :max="max"
        :value="minValue"
        :name="name+'_min'"
        @input="minInput"
      >
    </label>
    <label
      :aria-label="ariaMax"
      class="max"
    >
      <input
        :type="type"
        :step="step"
        :min="min"
        :max="max"
        :value="maxValue"
        :name="name+'_max'"
        @input="maxInput"
      >
      <div class="track">
        <div :style="style"/>
      </div>
    </label>
    <output :value="output"/>
  </div>
</template>
<style lang="scss" src="./style.scss" scoped/>
<script src="./controller.js"/>
