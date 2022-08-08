<template>
  <div class="defaultLayout">
    <Header></Header>
    <Nuxt keep-alive :keep-alive-props="{ max: 10 }" />
    <footer>footer</footer>
  </div>
</template>

<script>
export default {};
</script>

<style>
header,
footer {
  color: #fff;
  background-color: #770030;
}
</style>
