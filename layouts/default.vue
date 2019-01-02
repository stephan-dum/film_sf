<template>
  <section class="flex column ">
    <nuxt/>
    <Footer/>
  </section>
</template>

<style lang="scss">
  @font-face {
  	font-family: 'icons';
  	src: url('~/assets/fonts/FiraSans.eot');
  	src: url('~/assets/fonts/FiraSans.woff') format('woff'), url('~/assets/fonts/FiraSans.ttf') format('truetype');
  	font-weight: normal;
  	font-style: normal;
  }

  html, body {
    margin:0;
    border:0;
    display:block;
    font-family: FiraSans, sans-serif;
  }
  html, body, #__nuxt, #__layout, #__layout > * {
    min-height:100vh;
  }

  h1,h2,h3,h4 {
    font-weight:normal;
  }

  ul {
    list-style:none;
    margin:0;
    padding:0;
  }

  .relative {
    position:relative;
  }

  #__layout {
    background-color: $color_gray;
  }

  a {
    text-decoration:none;
    color:$color_black;
  }

  .js .nojs {
    display:none !important;
  }

  input[type="number"],
  input[type="text"] {
    width:100%;
    border:1px solid $color_black;
    padding:0.5em;
    box-sizing:border-box;
    outline:none;
    height:2em;
    font-size: 1em;
  }

  .page-enter-active, .page-leave-active {
    transition: opacity .5s;
  }
  .page-enter, .page-leave-to {
    opacity: 0;
  }

  .flex {
    display:flex;

    &.alignCenter {
      align-items:center;
    }

    &.column {
      flex-direction:column;
    }

    > .grow_1 {
      flex-grow:1;
    }
  }


</style>
<script>
  import Footer from '~/components/footer/index.vue';

  export default {
    components : {
      Footer
    }
  }
</script>
