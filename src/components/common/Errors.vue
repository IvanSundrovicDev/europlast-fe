<template>
  <div>
    <div>
      <vs-alert
        color="danger"
        style="margin-bottom: 20px"
      >
        <p>{{ responseErrors.data.message }}</p>
      </vs-alert>

      <vs-alert color="danger" style="margin-bottom: 20px">
        <b>Molimo ispravite ove greške:</b>
        <ul
          v-if="
            responseErrors.data.errors instanceof Array ||
            responseErrors.data.errors instanceof Object
          "
        >
          <li
            v-for="(value, key) in responseErrors.data.errors"
            :key="key"
          >
            <span v-for="(error, key) in value" :key="key"> - {{ error }} </span>
          </li>
        </ul>

        <ul v-else>
          <li v-if="responseErrors.data.errors.includes('Duplicate entry')">
            - Narudzba ili nalog pod istim brojem vec postoji. Molimo provjerite
            podatke
          </li>
          <li
            v-else-if="
              responseErrors.data.errors.includes(
                'delete or update a parent row'
              )
            "
          >
            - Neuspješno brisanje povezanih zapisa. Molimo kontaktirajte
            administratora.
          </li>
          <li v-else>- {{ responseErrors.data.errors }}</li>
        </ul>
      </vs-alert>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    responseErrors: {
      required: true,
      status: undefined,
      data: {
        status: undefined,
        message: undefined,
        errors: undefined
      }
    },
  },
  data() {
    return {
      info: null,
    };
  },
  beforeMount() {
    if (
      this.responseErrors.status === 500 ||
      this.responseErrors.status === 400
    ) {
      let formData = new FormData();
      formData.append("status_code", this.responseErrors.status);
      formData.append("message", this.responseErrors.statusText);
      formData.append("route", this.responseErrors.config.url);
      formData.append("method", this.responseErrors.config.method);
      formData.append("error", this.responseErrors.data.message);
      formData.append(
        "trace",
        this.responseErrors.data.file +
          " on line " +
          this.responseErrors.data.line
      );

      this.$axios({
        method: "POST",
        url: "/api/report_error",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      })
        .then(() => {})
        .catch((err) => {
          console.log(err.response);
        });
    }
  },
};
</script>
