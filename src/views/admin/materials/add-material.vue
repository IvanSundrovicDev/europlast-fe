<template>
  <div class="max-width-500">
    <Errors
      :response-errors="responseErrors"
      v-if="responseErrors !== null"
    ></Errors>
    <h2 class="style-title">Unos novog materijala</h2>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          v-model="material.sifra_materijala"
          v-on:input="checkIfExists"
          class="w-full"
          type="text"
          label="Šifra materijala"
        />
        <div style="font-size: small" v-if="exists">
          <p>Materijal/i koji sadrže tu šifu:</p>
          <ul style="list-style: circle" class="ml-5">
            <li v-for="(materijal, key) in postojeciMaterijali" :key="key">
              {{ materijal.sifra_materijala }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          v-model="material.interna_sifra_materijala"
          disabled="true"
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
          @change="resetData"
        >
          <vs-select-item key="item" value="Lim" text="Lim" />
          <vs-select-item key="item2" value="Šipka" text="Šipka" />
          <vs-select-item key="item3" value="Cijev" text="Cijev" />
          <vs-select-item key="item4" value="KV Cijev" text="KV Cijev" />
          <vs-select-item key="item5" value="Šesterokut" text="Šesterokut" />
          <vs-select-item
            key="item6"
            value="Plosnati Čelik"
            text="Plosnati čelik"
          />
          <vs-select-item key="item7" value="Ostalo" text="Ostalo" />
        </vs-select>
      </div>
    </div>
    <div v-if="material.vrsta_materijala === 'Lim'" class="vx-row mb-6">
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
      v-if="
        material.vrsta_materijala === 'Šipka' ||
        material.vrsta_materijala === 'Cijev' ||
        material.vrsta_materijala === 'KV Cijev'
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
    <div
      v-if="
        material.vrsta_materijala === 'Cijev' ||
        material.vrsta_materijala === 'KV Cijev'
      "
      class="vx-row mb-6"
    >
      <div class="vx-col w-full">
        <vs-input
          v-model="material.debljina_stijenke"
          class="w-full"
          type="number"
          label="Debljina stijenke u mm"
        />
      </div>
    </div>
    <div v-if="material.vrsta_materijala === 'Šesterokut'" class="vx-row mb-6">
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
      v-if="material.vrsta_materijala === 'Plosnati Čelik'"
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
      v-if="material.vrsta_materijala === 'Plosnati Čelik'"
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
    <div v-if="material.vrsta_materijala === 'Ostalo'" class="vx-row mb-6">
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
      v-if="
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

    <div></div>

    <div class="vx-row">
      <div class="vx-col w-full">
        <vs-button
          class="mr-3 mb-2"
          :disabled="disabled"
          v-on:click="postRequest"
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
      responseErrors: null,
      exists: false,
      postojeciMaterijali: "",
    };
  },
  methods: {
    checkIfExists(val) {
      if (val.length > 0) {
        this.$axios
          .get("/api/materijali/provjeri/" + val)
          .then((res) => {
            this.exists = res.data.exists;
            this.postojeciMaterijali = res.data.materijali;
          })
          .catch((err) => {
            this.$vs.notify({
              title: `Problem s provjerom šifre materijala`,
              text: err,
              position: "bottom-right",
              color: "danger",
            });
          });
      } else {
        this.exists = false;
      }
    },
    getInternaSira() {
      this.$axios
        .get("/api/materijali/interna_sifra_materijala")
        .then((res) => {
          this.material.interna_sifra_materijala = res.data;
        })
        .catch((err) => {
          this.$vs.notify({
            title: `Problem s dohvaćanjem interne šifre materijala`,
            text: err,
            position: "bottom-right",
            color: "danger",
          });
        });
    },
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
        case "Šesterokut":
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
        method: "POST",
        url: "/api/materijali/store",
        data: this.material,
      })
        .then(() => {
          window.location.href = "/materijali/novi";
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
  },
  beforeMount() {
    this.getInternaSira();
  },
};
</script>
