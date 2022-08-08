<template>
  <div id="data">{{ text }}</div>
</template>

<script>
export default {
  layout: "nothing",
  async asyncData(context) {
    const text = await context.$axios.get(
      "/vietcombank/Usercontrols/TVPortal.TyGia/pXML.aspx?b=68"
    );
    return { text: text.data };
  },
  async mounted() {
    const text = await this.$axios.get(
      "/vietcombank/Usercontrols/TVPortal.TyGia/pXML.aspx?b=68"
    );
    console.log(text);
  },
};
</script>

<style></style>
