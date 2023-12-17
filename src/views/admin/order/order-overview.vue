<template>
  <div>
    <Errors
      :response-errors="responseErrors"
      v-if="responseErrors !== null"
    ></Errors>
    <h2 class="style-title">Pregled svih narudžbi</h2>
    <div class="max-width-500">
      <div class="vx-row mb-6">
        <div class="vx-col flex">
          <vs-input
            class="w-100"
            v-model="filterItem"
            type="search"
            label="Pretraži"
            v-on:search="filter()"
          />
        </div>
        <div class="vx-col flex mt-auto">
          <vs-button v-on:click="filter()" :disabled="loading" class="mr-3"
            >Pretraži</vs-button
          >
        </div>
      </div>
    </div>
    <vs-table data="users">
      <template slot="thead">
        <vs-th>Broj narudžbe</vs-th>
        <vs-th>Kooperant</vs-th>
        <vs-th>Nastavak</vs-th>
        <vs-th>Opcije</vs-th>
      </template>

      <template>
        <vs-tr v-for="narudzba in narudzbe" :key="narudzba.id">
          <vs-td>{{ narudzba.broj_narudzbe }}</vs-td>
          <vs-td>{{ narudzba.kooperant.naziv }}</vs-td>
          <vs-td>{{ narudzba.nastavak }}</vs-td>
          <vs-td
            ><vs-button v-on:click="edit(narudzba.id)" class="mr-3 mb-2"
              >Detalji</vs-button
            >
            <DeleteButton
              :entity="narudzba"
              entity-name="Narudzba"
              entity-table-name="narudzbe"
              @get-errors="setErrors"
              @get-success="getData"
            ></DeleteButton
          ></vs-td>
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
import DeleteButton from "../../../components/common/DeleteButton";

export default {
  components: {
    Errors,
    DeleteButton,
  },
  data() {
    return {
      narudzbe: [],
      page: 0,
      lastPage: 1,
      loading: false,
      oldItem: "",
      filterItem: "",
      responseErrors: null,
    };
  },
  methods: {
    setErrors(err) {
      this.responseErrors = err;
    },
    filter() {
      if (!this.loading) {
        this.loading = true;
        this.page = 0;
        this.narudzbe = [];
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
              "/api/narudzbe/search/" + this.filterItem + "?page=" + this.page,
          })
            .then((res) => {
              this.narudzbe = this.narudzbe.concat(res.data.data);
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
            url: "/api/narudzbe/index?page=" + this.page,
          })
            .then((res) => {
              this.narudzbe = this.narudzbe.concat(res.data.data);
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
      window.location.href = "/narudzbe/pregled/" + id;
    },
  },
};
</script>
