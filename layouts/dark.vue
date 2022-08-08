<template>
  <div class="darkLayout">
    <Header></Header>
    <Nuxt />
    <footer>footer</footer>
    <notifications group="foo" />

  </div>
</template>

<script>
export default {};
</script>

<style>
  header, footer {
    color: #fff;
    background-color: #000;
  }

</style>