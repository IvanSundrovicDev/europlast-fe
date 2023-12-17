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
    <h2 class="style-title">Uredi materijal</h2>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          v-model="material.sifra_materijala"
          class="w-full"
          type="text"
          label="Šifra materijala"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          v-model="material.interna_sifra_materijala"
          disabled
          class="w-full"
          type="text"
          label="Interna šifra materijala"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-select
          class="w-full"
          label="Vrsta materijala"
          v-model="material.vrsta_materijala"
          @input="resetData()"
        >
          <vs-select-item key="item" value="Lim" text="Lim" />
          <vs-select-item key="item2" value="Šipka" text="Šipka" />
          <vs-select-item key="item3" value="Cijev" text="Cijev" />
          <vs-select-item key="item4" value="Šesterokut" text="Šesterokut" />
          <vs-select-item
            key="item5"
            value="Plosnati Čelik"
            text="Plosnati čelik"
          />
          <vs-select-item key="item6" value="Ostalo" text="Ostalo" />
        </vs-select>
      </div>
    </div>
    <div v-show="material.vrsta_materijala === 'Lim'" class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          v-model="material.debljina"
          class="w-full"
          type="number"
          label="Debljina u mm"
        />
      </div>
    </div>
    <div
      v-show="
        material.vrsta_materijala === 'Šipka' ||
        material.vrsta_materijala === 'Cijev'
      "
      class="vx-row mb-6"
    >
      <div class="vx-col w-full">
        <vs-input
          v-model="material.phi"
          class="w-full"
          type="number"
          label="ø"
        />
      </div>
    </div>
    <div v-show="material.vrsta_materijala === 'Cijev'" class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          v-model="material.debljina_stijenke"
          class="w-full"
          type="number"
          label="Debljina stijenke u mm"
        />
      </div>
    </div>
    <div
      v-show="material.vrsta_materijala === 'Šesterokutna Cijev'"
      class="vx-row mb-6"
    >
      <div class="vx-col w-full">
        <vs-input
          v-model="material.ok"
          class="w-full"
          type="number"
          label="OK"
        />
      </div>
    </div>
    <div
      v-show="material.vrsta_materijala === 'Plosnati Čelik'"
      class="vx-row mb-6"
    >
      <div class="vx-col w-full">
        <vs-input
          v-model="material.sirina_materijala"
          class="w-full"
          type="number"
          label="Širina materijala u mm"
        />
      </div>
    </div>
    <div
      v-show="material.vrsta_materijala === 'Plosnati Čelik'"
      class="vx-row mb-6"
    >
      <div class="vx-col w-full">
        <vs-input
          v-model="material.debljina_materijala"
          class="w-full"
          type="number"
          label="Debljina materijala u mm"
        />
      </div>
    </div>
    <div v-show="material.vrsta_materijala === 'Ostalo'" class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          v-model="material.ostalo_naziv"
          class="w-full"
          type="text"
          label="Naziv"
        />
      </div>
    </div>
    <div
      v-show="
        material.vrsta_materijala !== 'Ostalo' &&
        material.vrsta_materijala !== ''
      "
      class="vx-row mb-6"
    >
      <div class="vx-col w-full">
        <vs-input
          v-model="material.kvaliteta"
          class="w-full"
          type="text"
          label="Kvaliteta materijala"
        />
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
      title="Da li ste sigurni da želite obrisat ovaj materijal?"
      :active.sync="popupActive"
    >
      <vs-button
        color="danger"
        :disabled="disabled"
        v-on:click="deleteMaterial()"
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
      material: {
        sifra_materijala: "",
        interna_sifra_materijala: "",
        vrsta_materijala: "",
        debljina: "",
        phi: "",
        debljina_stijenke: "",
        ok: "",
        sirina_materijala: "",
        debljina_materijala: "",
        ostalo_naziv: "",
        kvaliteta: "",
        naziv: "",
      },
      disabled: false,
      popupActive: false,
      responseErrors: null,
      responseSuccess: null,
    };
  },
  methods: {
    resetData() {
      this.material.debljina = "";
      this.material.phi = "";
      this.material.debljina_stijenke = "";
      this.material.ok = "";
      this.material.sirina_materijala = "";
      this.material.debljina_materijala = "";
      this.material.ostalo_naziv = "";
      this.material.kvaliteta = "";
    },
    getData() {
      this.$axios({
        method: "GET",
        url: "/api/materijali/show/" + this.$route.params.id,
      })
        .then((res) => {
          this.material = res.data;
        })
        .catch((err) => {
          this.responseErrors = err.response;
        });
    },
    postRequest() {
      switch (this.material.vrsta_materijala) {
        case "Lim":
          this.material.naziv = `${this.material.vrsta_materijala} ${this.material.debljina}mm, ${this.material.kvaliteta}`;
          break;
        case "Šipka":
          this.material.naziv = `${this.material.vrsta_materijala} ø${this.material.phi}, ${this.material.kvaliteta}`;
          break;
        case "Cijev":
          this.material.naziv = `${this.material.vrsta_materijala} ${this.material.phi}x${this.material.debljina_stijenke}, ${this.material.kvaliteta}`;
          break;
        case "Šesterokutna Cijev":
          this.material.naziv = `${this.material.vrsta_materijala} OK${this.material.ok}, ${this.material.kvaliteta}`;
          break;
        case "Plosnati Čelik":
          this.material.naziv = `${this.material.vrsta_materijala} ${this.material.sirina_materijala}x${this.material.debljina_materijala}, ${this.material.kvaliteta}`;
          break;
        default:
          this.material.naziv = this.material.ostalo_naziv;
      }
      this.disabled = true;
      this.$axios({
        method: "PUT",
        url: "/api/materijali/update/" + this.$route.params.id,
        data: this.material,
      })
        .then((res) => {
          this.responseSuccess = res.data.messsage;
          this.disabled = false;
          this.responseErrors = null;
          this.getData();
          this.$vs.notify({
            title: `Materijal ${this.material.sifra_materijala} ažuriran`,
            position: "bottom-right",
            color: "primary",
          });
        })
        .catch((err) => {
          this.$vs.notify({
            title: `Materijal nije ažuriran`,
            text: "Molimo provjerite greške.",
            position: "bottom-right",
            color: "danger",
          });
          this.disabled = false;
          this.responseErrors = err.response;
        });
    },
    deleteMaterial() {
      this.disabled = true;
      this.$axios({
        method: "DELETE",
        url: "/api/materijali/delete/" + this.$route.params.id,
      })
        .then(() => {
          window.location.href = "/materijali/pregled";
        })
        .catch((err) => {
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
