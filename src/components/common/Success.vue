<template>
  <vs-alert color="success" v-if="message" style="margin-bottom: 20px">
    {{ message }}
  </vs-alert>
</template>

<script>
export default {
  props: {
    message: {
      required: true,
    },
  },
};
</script>
