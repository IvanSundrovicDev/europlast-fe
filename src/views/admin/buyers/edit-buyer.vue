<template>
  <div class="max-width-500">
    <Errors
      :response-errors="responseErrors"
      v-if="responseErrors !== null"
    ></Errors>
    <Success
      :message="responseSuccess"
      v-if="responseSuccess !== null"
    ></Success>
    <h2 class="style-title">Uredi kooperanta</h2>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          v-model="cooperant.naziv"
          class="w-full"
          type="text"
          label="Naziv kooperanta"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          v-model="cooperant.sifra_kooperanta"
          class="w-full"
          type="text"
          label="Šifra kooperanta"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          v-model="cooperant.adresa"
          class="w-full"
          type="text"
          label="Adresa"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          v-model="cooperant.oib"
          class="w-full"
          type="text"
          label="OIB"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          v-model="cooperant.pdv_id"
          class="w-full"
          type="text"
          label="PDV ID"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          v-model="cooperant.uvjeti_placanja"
          class="w-full"
          type="text"
          label="Uvjeti plaćanja"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-select class="w-full" label="Jezik" v-model="cooperant.jezik">
          <vs-select-item key="1" value="HR" text="Hrvatski" />
          <vs-select-item key="2" value="ENG" text="Engleski" />
        </vs-select>
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <span>Prikazi na vrhu popisa kooperanata?</span>
        <vs-checkbox color="dark" class="inline-block" v-model="cooperant.favorit"/>
      </div>
    </div>
    <div class="vx-row">
      <div class="vx-col w-full">
        <vs-button
          class="mr-3 mb-2"
          :disabled="disabled"
          v-on:click="postRequest()"
          >Spremi</vs-button
        >
        <vs-button color="danger" @click="openPopup()" class="mr-3 mb-2"
          >Obriši</vs-button
        >
      </div>
    </div>
    <vs-popup
      class="holamundo"
      title="Da li ste sigurni da želite obrisat ovog kooperanta?"
      :active.sync="popupActive"
    >
      <vs-button
        color="danger"
        :disabled="disabled"
        v-on:click="deleteBuyer()"
        class="mr-3 mb-2"
        >Da</vs-button
      >
      <vs-button @click="popupActive = false" class="mr-3 mb-2">Ne</vs-button>
    </vs-popup>
  </div>
</template>


<script>
import Errors from "../../../components/common/Errors";
import Success from "../../../components/common/Success";

export default {
  components: {
    Errors,
    Success,
  },
  data() {
    return {
      cooperant: {
        naziv: "",
        sifra_kooperanta: "",
        adresa: "",
        oib: "",
        pdv_id: "",
        jezik: "",
        valuta: "",
        uvjeti_placanja: "",
      },
      disabled: false,
      popupActive: false,
      responseErrors: null,
      responseSuccess: null,
    };
  },
  methods: {
    getData() {
      this.$axios({
        method: "GET",
        url: "/api/kooperanti/show/" + this.$route.params.id,
      })
        .then((res) => {
          this.cooperant = res.data;
        })
        .catch((err) => {
          this.disabled = false;
          this.responseErrors = err.response;
        });
    },
    postRequest() {
      this.disabled = true;
      this.$axios({
        method: "PUT",
        url: "/api/kooperanti/update/" + this.$route.params.id,
        data: this.cooperant,
      })
        .then((res) => {
          this.responseErrors = null;
          this.responseSuccess = res.data.message;
          this.disabled = false;
          this.getData();
        })
        .catch((err) => {
          this.disabled = false;
          this.responseErrors = err.response;
        });
    },
    deleteBuyer() {
      let url = "/api/kooperanti/delete/" + this.$route.params.id;
      this.disabled = true;
      this.$axios({
        method: "DELETE",
        url: url,
      })
        .then(() => {
          window.location.href = "/kooperanti/pregled";
        })
        .catch((err) => {
          this.$vs.notify({
            title: `Kooperant nije ažuriran`,
            text: "Molimo provjerite greške.",
            position: "bottom-right",
            color: "danger",
          });
          this.popupActive = false;
          this.disabled = false;
          this.responseErrors = err.response;
        });
    },
    openPopup() {
      this.popupActive = true;
    },
  },
  beforeMount() {
    this.getData();
  },
};
</script>
