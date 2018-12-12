<template>
  <section :class="'flex column '+mainClass">
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
    },
    data() {
      return {
        mainClass : ""
      }
    },
    mounted() {
      this.mainClass = "js";
    }
  }
</script>
