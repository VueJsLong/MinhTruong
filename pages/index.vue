<template>
  <div>
    <div>{{ content }}</div>
    <button @click="refresh">Refresh</button>
  </div>
</template>

<script>
export default {
  name: "Index",
  asyncData(context) {
    if (process.client) {
      window.baseUrl = "https://google.com";
    }
    return { content: "Created at: " + new Date() };
  },
  methods: {
    refresh() {
      this.$nuxt.refresh();
    },
  },
};
</script>
