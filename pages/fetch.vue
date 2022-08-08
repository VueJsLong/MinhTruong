<template>
  <div>
    <p v-if="$fetchState.pending">Fetching mountains...</p>
    <p v-else-if="$fetchState.error">An error occurred :(</p>
    <div v-else>
      <h1 class="red">Nuxt Mountains</h1>
      <ul>
        <li v-for="(mountain, index) of mountains" :key="index">
          {{ mountain.title }}
        </li>
      </ul>
      <button @click="$fetch">Refresh</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mountains: [],
    };
  },
  activated() {
    console.log("[activated]", Date.now() - this.$fetchState.timestamp);
    if (this.$fetchState.timestamp <= Date.now() - 5000) {
      console.log("[reFetch]");
      this.$fetch();
    }
  },
  async fetch() {
    this.mountains = await fetch("https://api.nuxtjs.dev/mountains").then(
      (res) => res.json()
    );
  },
};
</script>

<style lang="scss">
// npm i --save-dev sass sass-loader@10
.red {
  color: red;
}
</style>
