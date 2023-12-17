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
    <h2 class="style-title">Uredi zaposlenika</h2>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          v-model="zaposlenik.ime"
          class="w-full"
          type="text"
          label="Ime"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          v-model="zaposlenik.prezime"
          class="w-full"
          type="text"
          label="Prezime"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          v-model="zaposlenik.kontakt_broj"
          class="w-full"
          type="text"
          label="Broj telefona"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          v-model="zaposlenik.email"
          class="w-full"
          type="text"
          label="E-mail"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          v-model="zaposlenik.adresa"
          class="w-full"
          type="text"
          label="Adresa"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          v-model="zaposlenik.oib"
          class="w-full"
          type="number"
          label="OIB"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-select
          class="w-full"
          label="Radno mjesto"
          v-model="zaposlenik.pozicija"
        >
          <vs-select-item key="item" value="Tokar" text="Tokar" />
          <vs-select-item key="item2" value="Glodač" text="Glodač" />
          <vs-select-item key="item3" value="Rezač" text="Rezač" />
          <vs-select-item key="item4" value="Kontrola" text="Kontrola" />
          <vs-select-item key="item5" value="Električar" text="Električar" />
          <vs-select-item key="item6" value="Pomoćni" text="Pomoćni" />
        </vs-select>
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
      title="Da li ste sigurni da želite obrisat ovog zaposlenika?"
      :active.sync="popupActive"
    >
      <vs-button
        color="danger"
        :disabled="disabled"
        v-on:click="deleteEmployee"
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
      zaposlenik: {
        ime: "",
        prezime: "",
        kontakt_broj: "",
        pozicija: "",
        adresa: "",
        oib: "",
        email: "",
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
        url: "/api/zaposlenici/show/" + this.$route.params.id,
      })
        .then((res) => {
          this.zaposlenik = res.data;
        })
        .catch((err) => {
          this.responseErrors = err.response;
        });
    },
    postRequest() {
      this.disabled = true;
      this.$axios({
        method: "PUT",
        url: "/api/zaposlenici/update/" + this.$route.params.id,
        data: this.zaposlenik
      })
        .then((res) => {
          this.responseSuccess = res.data.message;
          this.responseErrors = null;
          this.disabled = false;
          this.getData();
        })
        .catch((err) => {
          this.disabled = false;
          this.responseErrors = err.response;
        });
    },
    deleteEmployee() {
      this.disabled = true;
      this.$axios({
        method: "DELETE",
        url: "/api/zaposlenici/delete/" + this.$route.params.id
      })
        .then(() => {
          window.location.href = "/zaposlenici/pregled";
        })
        .catch((err) => {
          this.$vs.notify({
            title: `Zaposlenik nije ažuriran`,
            text: "Molimo provjerite greške.",
            position: "bottom-right",
            color: "danger",
          });
          this.disabled = false;
          this.popupActive = false;
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
