<template>
  <div class="max-width-500">
    <Errors
      :response-errors="responseErrors"
      v-if="responseErrors !== null"
    ></Errors>
    <h2 class="style-title">Dodavanje kooperanta</h2>
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
          label="Šifra kooperanta / Skraćeni naziv"
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
          v-on:click="uploadCooperant()"
          >Spremi</vs-button
        >
      </div>
    </div>
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
      cooperant: {
        naziv: "",
        sifra_kooperanta: "",
        adresa: "",
        oib: "",
        pdv_id: "",
        jezik: "",
        valuta: "",
        uvjeti_placanja: "",
        favorit: false
      },
      disabled: false,
      responseErrors: null,
    };
  },
  methods: {
    uploadCooperant() {
      this.disabled = true;
      this.$axios({
        method: "POST",
        url: "/api/kooperanti/store",
        data: this.cooperant,
      })
        .then(() => {
          window.location.href = "/kooperanti/pregled";
        })
        .catch((err) => {
          this.$vs.notify({
            title: `Kooperant nije kreiran`,
            text: "Molimo provjerite greške.",
            position: "bottom-right",
            color: "danger",
          });
          this.disabled = false;
          this.responseErrors = err.response;
        });
    },
  },
};
</script>
