<template functional>
  <footer class="the-footer flex-wrap justify-between" :class="classes">
    <span
      >COPYRIGHT @ {{ new Date().getFullYear() }}
      <a href="mailto:ivan.sundrovic@gmail.com" rel="nofollow">Made by Ivan Šundrović</a>,
      All rights Reserved</span
    >
  </footer>
</template>

<script>
export default {
  name: "the-footer",
  props: {
    classes: {
      type: String,
    },
  },
};
</script>
