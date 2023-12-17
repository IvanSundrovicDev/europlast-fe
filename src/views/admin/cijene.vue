<template>
    <div>
      <Errors
        :response-errors="responseErrors"
        v-if="responseErrors !== null"
      ></Errors>
      <h2 class="style-title">Cijene</h2>
      <div class="mt-5 mb-8">
          <vs-button v-if="!open" v-on:click="open = true"
            >Dodaj Novu</vs-button
          >
          <div v-if="open">
            <vs-input
              class="w-96 mt-3"
              v-model="newPrice.iznos"
              type="number"
              label="Iznos"
            />
            <vs-input
              class="w-96 mt-3"
              v-model="newPrice.jed_mjere"
              type="text"
              label="Jedinica mjere"
            />
            <div class="flex">
              <vs-button class="mt-6" v-on:click="addPrice()">Dodaj</vs-button>
              <vs-button color="danger" class="mt-6 ml-5" v-on:click="open = false">Odustani</vs-button>
            </div>
          </div>
        </div>
      <vs-table data="users">
        <template slot="thead">
          <vs-th>Iznos</vs-th>
          <vs-th>Jedinica mjere</vs-th>
        </template>
  
        <template>
          <vs-tr v-for="cijena in cijene" :key="cijena.id">
            <vs-td>{{ cijena.iznos }}</vs-td>
            <vs-td>{{ cijena.jed_mjere }}</vs-td>
        </vs-tr>
        </template>
      </vs-table>
    </div>
  </template>
  
  
  <script>
  import Errors from "../../components/common/Errors";
  
  export default {
    components: {
      Errors,
    },
    data() {
      return {
        open: false,
        cijene: [],
        newPrice: {
          iznos: "",
          jed_mjere: "",
        },
        responseErrors: null,
      };
    },
    methods: {
      getData() {
        this.$axios({
          method: "GET",
          url: "/api/cijene/index"
        })
          .then((res) => {
            this.cijene = res.data;
          })
          .catch((err) => {
            this.responseErrors = err.response;
          });
      },
      addPrice() {
        this.$axios({
          method: "POST",
          url: "/api/cijene/store",
          data: this.newPrice,
        })
          .then(() => {
            this.open = false;
            this.newPrice = {
              iznos: "",
              jed_mjere: "",
            };
            this.getData();
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
  