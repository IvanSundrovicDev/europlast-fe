<template>
  <div class="max-width-500">
    <Errors
      :response-errors="responseErrors"
      v-if="responseErrors !== null"
    ></Errors>
    <h2 class="style-title">Nova reklamacija</h2>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <label class="typo__label">Broj narudžbe</label>
        <multiselect
          v-model="dropSelect.value"
          :options="dropSelect.options"
          :custom-label="nameWithLang"
          placeholder="Pretraži..."
          label="key"
          track-by="key"
          v-on:input="addValueAcc()"
        ></multiselect>
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <label class="typo__label">Nalog</label>
        <multiselect
          v-model="dropSelect2.value"
          :options="dropSelect2.options"
          :custom-label="nameWithLang"
          placeholder="Pretraži..."
          label="key"
          track-by="key"
          v-on:input="addNalog()"
        ></multiselect>
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          class="w-full"
          v-model="reclamation.broj_reklamacije"
          type="text"
          label="Broj Reklamacije"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          class="w-full"
          v-model="reclamation.komada"
          type="number"
          label="Komada"
        />
      </div>
    </div>

    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          class="w-full"
          v-model="reclamation.napomena"
          type="text"
          label="Napomena"
        />
      </div>
    </div>
    <div class="vx-row">
      <div class="vx-col w-full">
        <vs-button
          class="mr-3 mb-2"
          @click="postRequest"
          :disabled="btnDisabled"
          >Spremi</vs-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import Errors from "../../../components/common/Errors";

export default {
  components: {
    Multiselect,
    Errors,
  },
  data() {
    return {
      btnDisabled: false,
      dropSelect: {
        value: null,
        options: [],
      },
      dropSelect2: {
        value: null,
        options: [],
      },
      reclamation: {
        narudzba: "",
        nalog: "",
        komada: "",
        napomena: "",
        broj_reklamacije: "",
      },
      baseItems: [],
      responseErrors: null,
    };
  },
  methods: {
    nameWithLang({ val }) {
      return `${val}`;
    },
    addValueAcc() {
      if (this.dropSelect.value !== null) {
        this.$axios({
          method: "GET",
          url: "/api/nalozi/filter_by/narudzba_id/" + this.dropSelect.value.key,
        })
          .then((res) => {
            this.dropSelect2.options = [];
            this.reclamation.narudzba = this.dropSelect.value.key;
            res.data.nalozi.forEach((el) => {
              if (el.status === "isporuceno") {
                this.dropSelect2.options.push({
                  key: el.id,
                  val: el.kor_racun,
                });
              }
            });
          })
          .catch((err) => {
            this.responseErrors = err.response;
          });
      } else {
        this.reclamation.narudzba = "";
      }
    },
    addNalog() {
      this.reclamation.nalog = this.dropSelect2.value.key;
    },
    getAccId() {
      this.$axios({
        method: "GET",
        url: "/api/narudzbe/index",
      })
        .then((res) => {
          let items = [];
          res.data.data.forEach((el) => {
            items.push({ key: el.id, val: el.broj_narudzbe });
          });
          this.dropSelect.options = items;
        })
        .catch((err) => {
          this.responseErrors = err.response;
        });
    },
    postRequest() {
      this.btnDisabled = true;
      this.$axios({
        method: "POST",
        url: "/api/reklamacije/store",
        data: this.reclamation,
      })
        .then(() => {
          window.location.href = "/reklamacije/pregled";
        })
        .catch((err) => {
          this.$vs.notify({
            title: `Reklamacija nije kreirana`,
            text: "Molimo provjerite greške.",
            position: "bottom-right",
            color: "danger",
          });
          this.btnDisabled = false;
          this.responseErrors = err.response;
        });
    },
  },
  beforeMount() {
    this.getAccId();
  },
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
