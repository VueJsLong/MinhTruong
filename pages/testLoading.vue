<template>
  <div>
    <h1>[testLoading page]</h1>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
      setTimeout(() => this.$nuxt.$loading.finish(), 500)
    })
  }
};
</script>

<style>
</style>