<template>
  <div>
    <Errors
      :response-errors="responseErrors"
      v-if="responseErrors !== null"
    ></Errors>
    <Success :message="responseSuccess"></Success>
    <h2 class="style-title">Pregled svih naloga</h2>
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
    <vs-table data="nalozi">
      <template slot="thead">
        <vs-th>Broj narudžbe</vs-th>
        <vs-th>Korisnički račun</vs-th>
        <vs-th>Komada</vs-th>
        <vs-th>Broj nacrta</vs-th>
        <vs-th>Naziv pozicije</vs-th>
        <vs-th>Rok isporuke</vs-th>
        <vs-th>Status</vs-th>
        <vs-th v-if="!kontrola">Opcije</vs-th>
        <vs-th v-else>Materijal stigao?</vs-th>
        <vs-th v-if="kontrola">Završi nalog?</vs-th>
        <vs-th v-if="kontrola">Površinska obrada?</vs-th>
      </template>

      <template>
        <vs-tr v-for="item in nalozi" :key="item.id">
          <vs-td
            ><a :href="'/narudzbe/pregled/' + item.narudzba.id">{{
              item.narudzba.broj_narudzbe
            }}</a></vs-td
          >
          <vs-td>{{ item.kor_racun }}</vs-td>
          <vs-td>{{ item.komada }}</vs-td>
          <vs-td
            ><a
              target="_blank"
              :href="`/storage/pozicije/${item.pozicija.id}/nacrt/${item.pozicija.file_name}`"
              >{{ item.pozicija.broj_nacrta }}</a
            ></vs-td
          >
          <vs-td>{{ item.pozicija.naziv }}</vs-td>
          <vs-td>{{ handleDateTime(item.rok_isporuke) }}</vs-td>
          <vs-td>{{ setItemStatus(item) }}</vs-td>
          <vs-td v-if="!kontrola">
            <vs-button v-on:click="view(item)" class="mr-3 mb-2"
              >Pogledaj</vs-button
            >
            <vs-button
              v-on:click="edit(item.id)"
              color="success"
              class="mr-3 mb-2"
              >Uredi</vs-button
            >
            <vs-button
              v-on:click="print(`/storage/nalozi/${item.id}/${item.filename}`)"
              color="warning"
              class="mr-3 mb-2"
              >Printaj</vs-button
            >
            <DeleteButton
              :entity="item"
              entity-name="Nalog"
              v-if="item.status !== 'isporuceno'"
              entity-table-name="nalozi"
              @get-errors="setErrors"
              @get-success="getData"
            ></DeleteButton>
          </vs-td>
          <vs-td v-else>
            <vs-checkbox
              v-on:input="materijalStigao(item.id)"
              :disabled="canCheck(item)"
              :checked="checkNalogForMaterijal(item)"
            ></vs-checkbox>
          </vs-td>
          <vs-td v-if="kontrola">
            <vs-button
              v-on:click="zavrsiNalog(item.id)"
              :disabled="item.status === 'isporuceno' || item.status === 'zavrseno'"
              class="mr-3"
              >Završi nalog</vs-button
            >
          </vs-td>
          <vs-td v-if="kontrola">
            <vs-button
              v-on:click="setPovrsinskaObrada(item.id)"
              :disabled="
                item.status === 'povrsinska_obrada' ||
                item.status === 'isporuceno' ||
                item.status === 'zavrseno'
              "
              class="mr-3"
              >Površinska obrada</vs-button
            >
          </vs-td>
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
import print from "print-js";
import Errors from "../../../components/common/Errors";
import Success from "../../../components/common/Success";
import DeleteButton from "../../../components/common/DeleteButton";

export default {
  components: {
    Errors,
    Success,
    DeleteButton,
  },
  data() {
    return {
      nalozi: [],
      loading: false,
      page: 0,
      lastPage: 1,
      oldItem: "",
      id: "",
      filterItem: "",
      errors: null,
      errorMessage: null,
      message: null,
      print: print,
      responseErrors: null,
      responseSuccess: null,
      materijal: "",
    };
  },
  computed: {
    kontrola: function () {
      return this.$user.role === "kontrola";
    },
    isDisabled: function () {
      if (!this.filterItem2 && !this.filterItem3) {
        return false;
      } else {
        return true;
      }
    },
    isDisabled2: function () {
      if (!this.filterItem && !this.filterItem3) {
        return false;
      } else {
        return true;
      }
    },
    isDisabled3: function () {
      if (!this.filterItem2 && !this.filterItem) {
        return false;
      } else {
        return true;
      }
    },
  },
  methods: {
    zavrsiNalog(nalogId) {
      this.$axios
        .post("/api/nalozi/zavrsi_nalog/" + nalogId)
        .then((res) => {
          this.getData();
          this.responseSuccess = res.data.message;
        })
        .catch((err) => {
          this.responseErrors = err.message;
          this.loading = false;
        });
    },
    setPovrsinskaObrada(nalogId) {
      this.$axios
        .post("/api/nalozi/set_povrsinska_obrada/" + nalogId)
        .then((res) => {
          this.getData();
          this.responseSuccess = res.data.message;
        })
        .catch((err) => {
          this.responseErrors = err.message;
          this.loading = false;
        });
    },
    handleDateTime(item) {
      const date = new Date(item);
      const formattedDate = date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      });
      return formattedDate;
    },
    checkNalogForMaterijal(item) {
      return item.status !== "kreirano";
    },
    canCheck: function (item) {
      return item.status !== "kreirano";
    },
    materijalStigao(id) {
      console.log(id);
      this.$axios
        .get("/api/nalozi/materijal_stigao/" + id)
        .then((res) => {
          this.getData();
          this.responseSuccess = res.data.message;
        });
    },
    setItemStatus(item) {
      if (item.status === "isporuceno" && item.isporuka) {
        const date = new Date(item.isporuka.datum_isporuke);
        const formattedDate = date.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
        });

        return item.status + " (" + formattedDate + ")";
      } else {
        return item.status
      }
    },
    setErrors(err) {
      this.responseErrors = err;
    },
    openPopup(id) {
      this.id = id;
      this.popupActive = true;
    },
    filter() {
      if (!this.loading) {
        this.loading = true;
        this.page = 0;
        this.nalozi = [];
        this.getData();
      }
    },
    getData() {
      if (this.filterItem) {
        if (this.page < this.lastPage) {
          this.page++;
          this.$axios({
            method: "GET",
            url: "/api/nalozi/search/" + this.filterItem + "?page=" + this.page,
          })
            .then((res) => {
              this.nalozi = this.nalozi.concat(res.data.data);
              this.lastPage = res.data.last_page;
              this.loading = false;
            })
            .catch((err) => {
              this.responseErrors = err.response;
              this.loading = false;
            });
        }
      } else {
        if (this.page < this.lastPage) {
          this.page++;
          this.$axios({
            method: "GET",
            url: "/api/nalozi/index?page=" + this.page,
          })
            .then((res) => {
              this.nalozi = this.nalozi.concat(res.data.data);
              this.lastPage = res.data.last_page;
              this.loading = false;
            })
            .catch((err) => {
              this.responseErrors = err.response;
              this.loading = false;
            });
        }
      }
    },
    view(item) {
      window.open(`/storage/nalozi/${item.id}/${item.filename}`);
    },
    edit(id) {
      window.location.href = "/nalozi/pregled/" + id;
    },
  },
};
</script>
