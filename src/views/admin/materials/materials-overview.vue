<template>
  <div>
    <Errors
      :response-errors="responseErrors"
      v-if="responseErrors !== null"
    ></Errors>
    <h2 class="style-title">Pregled svih materijala</h2>
    <div class="max-width-500">
      <div class="vx-row mb-6">
        <div class="vx-col flex">
          <vs-input
            class="w-100"
            v-model="filterItem"
            type="search"
            v-on:search="filter()"
            label="Pretraži"
          />
        </div>
        <div class="vx-col flex mt-auto">
          <vs-button v-on:click="filter()" :disabled="loading"
            >Pretraži</vs-button
          >
        </div>
      </div>
    </div>
    <vs-table data="users">
      <template slot="thead">
        <vs-th>Interna šifra materijala</vs-th>
        <vs-th>Šifra materijala (HF)</vs-th>
        <vs-th>Naziv materijala</vs-th>
        <vs-th>Opcije</vs-th>
      </template>

      <template>
        <vs-tr v-for="material in materials" :key="material.id">
          <vs-td>{{ material.interna_sifra_materijala }}</vs-td>
          <vs-td>{{ material.sifra_materijala }}</vs-td>
          <vs-td>{{ material.naziv }}</vs-td>
          <vs-td
            ><vs-button v-on:click="edit(material.id)" class="mr-3 mb-2"
              >Detalji</vs-button
            ></vs-td
          >
        </vs-tr>
      </template>
    </vs-table>
    <div
      v-infinite-scroll="getData"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="10"
    ></div>
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
      materials: [],
      page: 0,
      lastPage: 1,
      loading: false,
      oldItem: "",
      filterItem: "",
      responseErrors: null,
    };
  },
  computed: {
    isDisabled: function () {
      if (!this.filterItem2) {
        return false;
      } else {
        return true;
      }
    },
    isDisabled2: function () {
      if (!this.filterItem) {
        return false;
      } else {
        return true;
      }
    },
  },
  methods: {
    filter() {
      if (!this.loading) {
        this.loading = true;
        this.page = 0;
        this.materials = [];
        this.getData();
      }
    },
    getData() {
      if (this.filterItem) {
        if (this.page < this.lastPage) {
          this.page++;
          this.$axios({
            method: "GET",
            url:
              "/api/materijali/search/" +
              this.filterItem +
              "?page=" +
              this.page,
          })
            .then((res) => {
              this.materials = this.materials.concat(res.data.data);
              this.lastPage = res.data.last_page;
              this.loading = false;
            })
            .catch((err) => {
              this.responseErrors = err.response;
            });
        }
      } else {
        if (this.page < this.lastPage) {
          this.page++;
          this.$axios({
            method: "GET",
            url: "/api/materijali/index?page=" + this.page,
          })
            .then((res) => {
              this.materials = this.materials.concat(res.data.data);
              this.lastPage = res.data.last_page;
              this.loading = false;
            })
            .catch((err) => {
              this.responseErrors = err.response;
            });
        }
      }
    },
    edit(id) {
      window.location.href = "/materijali/pregled/" + id;
    },
  },
  beforeMount() {
    this.getData();
  },
};
</script>
