<template>
  <div>
    <Errors
      :response-errors="responseErrors"
      v-if="responseErrors !== null"
    ></Errors>
    <h2 class="style-title">Pregled zaposlenika</h2>
    <vs-table data="users">
      <template slot="thead">
        <vs-th>Prezime</vs-th>
        <vs-th>Ime</vs-th>
        <vs-th>Radno mjesto</vs-th>
        <vs-th>Broj telefona</vs-th>
        <vs-th>Opcije</vs-th>
      </template>

      <template>
        <vs-tr v-for="zaposlenik in zaposlenici" :key="zaposlenik.id">
          <vs-td>{{ zaposlenik.prezime }}</vs-td>
          <vs-td>{{ zaposlenik.ime }}</vs-td>
          <vs-td>{{ zaposlenik.pozicija }}</vs-td>
          <vs-td>{{ zaposlenik.kontakt_broj }}</vs-td>
          <vs-td
            ><vs-button v-on:click="edit(zaposlenik.id)" class="mr-3 mb-2"
              >Uredi</vs-button
            ><vs-button
              class="mr-3 mb-2"
              color="success"
              v-on:click="
                $router.push({
                  path: `/zaposlenici/aktivnosti/${zaposlenik.id}`,
                })
              "
              >Aktivnosti</vs-button
            >
            <DeleteButton
              :entity="zaposlenik"
              entity-name="Zaposlenik"
              entity-table-name="zaposlenici"
              @get-error="setErrors"
              @get-success="getData"
            ></DeleteButton
          ></vs-td>
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
      zaposlenici: [],
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
        url: "/api/zaposlenici/index"
      })
        .then((res) => {
          this.$vs.notify({
            title: `Svi zaposlenici dohvaćeni`,
            text: "Ukupno zaposlenika: " + res.data.length,
            position: "bottom-right",
            color: "primary",
          });
          this.zaposlenici = res.data;
        })
        .catch((err) => {
          this.responseErrors = err.response;
        });
    },
    edit(id) {
      window.location.href = "/zaposlenici/uredi/" + id;
    },
  },
  beforeMount() {
    this.getData();
  },
};
</script>
