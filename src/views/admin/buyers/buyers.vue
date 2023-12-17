<template>
  <div>
    <Errors
      :response-errors="responseErrors"
      v-if="responseErrors !== null"
    ></Errors>
    <h2 class="style-title">Pregled kooperanata</h2>
    <vs-table data="users">
      <template slot="thead">
        <vs-th>Naziv</vs-th>
        <vs-th>Adresa</vs-th>
        <vs-th>Jezik</vs-th>
        <vs-th>Opcije</vs-th>
      </template>

      <template>
        <vs-tr v-for="kooperant in kooperanti" :key="kooperant.id">
          <vs-td>{{ kooperant.naziv }}</vs-td>
          <vs-td>{{ kooperant.adresa }}</vs-td>
          <vs-td>{{ kooperant.jezik }}</vs-td>
          <vs-td
            >
            <div class="flex">
              <vs-button v-on:click="edit(kooperant.id)" class="mr-3 mb-2"
                >Uredi</vs-button
              >
              <DeleteButton
              class="mb-2"
                :entity="kooperant"
                entity-name="Kooperant"
                entity-table-name="kooperanti"
                @get-errors="setErrors"
                @get-success="getData"
              ></DeleteButton>
            </div>
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
  </div>
</template>

<script>
import Errors from "../../../components/common/Errors";
import DeleteButton from "../../../components/common/DeleteButton";

export default {
  components: {
    Errors,
    DeleteButton,
  },
  data() {
    return {
      kooperanti: [],
      responseErrors: null,
    };
  },
  methods: {
    setErrors(err) {
      this.responseErrors = err;
    },
    getData() {
      this.$axios({
        method: "GET",
        url: "/api/kooperanti/index",
      })
        .then((res) => {
          this.kooperanti = res.data;
        })
        .catch((err) => {
          this.responseErrors = err.response;
        });
    },
    edit(id) {
      window.location.href = "/kooperanti/uredi/" + id;
    },
  },
  beforeMount() {
    this.getData();
  },
};
</script>
