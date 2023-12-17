<template>
  <div>
    <Errors
      :response-errors="responseErrors"
      v-if="responseErrors !== null"
    ></Errors>
    <h2 class="style-title">Pregled strojeva</h2>
    <vs-table data="users">
      <template slot="thead">
        <vs-th>Naziv</vs-th>
        <vs-th>Vrsta</vs-th>
        <vs-th>Napomena</vs-th>
        <vs-th>Opcije</vs-th>
      </template>

      <template>
        <vs-tr v-for="stroj in strojevi" :key="stroj.id">
          <vs-td>{{ stroj.naziv }}</vs-td>
          <vs-td>{{ stroj.tip }}</vs-td>
          <vs-td>{{ stroj.napomena }}</vs-td>
          <vs-td
            ><vs-button v-on:click="edit(stroj.id)" class="mr-3 mb-2"
              >Uredi</vs-button
            ></vs-td
          >
        </vs-tr>
      </template>
    </vs-table>
  </div>
</template>


<script>
import Errors from "../../../components/common/Errors";

export default {
  components: {
    Errors,
  },
  data() {
    return {
      strojevi: [],
      responseErrors: null,
    };
  },
  methods: {
    getData() {
      this.$axios({
        method: "GET",
        url: "/api/strojevi/index"
      })
        .then((res) => {
          this.strojevi = res.data;
        })
        .catch((err) => {
          this.responseErrors = err.response;
        });
    },
    edit(id) {
      window.location.href = "/strojevi/uredi/" + id;
    },
  },
  beforeMount() {
    this.getData();
  },
};
</script>
