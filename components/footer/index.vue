<template>
  <footer>
    <div>
      <p>Legal</p>
      <ul>
        <li>
          <a>impressum</a>
        </li>
      </ul>
    </div>
    <div>
      contact
    </div>
  </footer>
</template>

<style lang="scss">
  footer {
    position:relative;
    min-height: 200px;

    &:after {
      content:"";
      display:block;
      position:absolute;
      top:0;
      height:100%;
      width:100%;
      background: url("~assets/footer.jpg") 90% 50%;
      background-size: cover;
    }
  }
</style>
