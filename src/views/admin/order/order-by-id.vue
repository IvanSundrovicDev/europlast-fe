<template>
  <div>
    <Errors
      :response-errors="responseErrors"
      v-if="responseErrors !== null"
    ></Errors>
    <Success
      :message="responseSuccess"
      v-if="responseSuccess !== null"
    ></Success>
    <h2 class="style-title">Pregled narudžbe</h2>
    <div class="spacing">
      <div class="max-width-500">
        <div class="vx-row mb-6">
          <div class="vx-col w-full">
            <label class="vs-input--label">Datum narudžbe</label>
            <datepicker
              v-model="narudzba.datum_narudzbe"
              class="logs-search-items"
              :language="hr"
              style="z-index: 1004"
              :clear-button="true"
              :monday-first="true"
            ></datepicker>
          </div>
        </div>
        <div class="vx-row mb-6">
          <div class="vx-col w-full">
            <vs-input
              class="w-full"
              v-model="narudzba.broj_narudzbe"
              type="text"
              label="Broj narudžbe"
            />
          </div>
        </div>
        <div class="vx-row mb-6">
          <div class="vx-col w-full">
            <vs-input
              class="w-full"
              v-model="narudzba.nastavak"
              type="text"
              label="Nastavak"
            />
          </div>
        </div>
        <div class="vx-row mb-6">
          <div class="vx-col w-full">
            <vs-select
              class="w-full"
              v-model="narudzba.kooperant"
              label="Kooperant"
            >
              <vs-select-item
                v-for="kooperant in cooperants"
                :key="kooperant.id"
                :value="kooperant.id"
                :text="`${kooperant.naziv} (${kooperant.jezik}/${kooperant.valuta})`"
              />
            </vs-select>
          </div>
        </div>
        <div class="vx-row mb-6">
          <div class="vx-col w-full">
            <vs-input
              class="w-full"
              v-model="narudzba.transport"
              type="text"
              label="Cijena transporta"
            ></vs-input>
            <small style="color: red"
              ><em>Format iznosa: 100.00 ; 1000.00 itd.</em></small
            >
          </div>
        </div>
        <div class="vx-row">
          <div class="vx-col w-full order-buttons">
            <vs-button
              class="mr-3 mb-2"
              v-on:click="postRequest"
              :disabled="btnDisabled"
              >Spremi</vs-button
            >
            <vs-button
              class="mr-3 mb-2 float-r"
              color="success"
              v-on:click="addNalog()"
              >Novi nalog</vs-button
            >
          </div>
        </div>
      </div>
      <h4 class="narudzba_items mb-4">Nalozi:</h4>
      <vs-table data="users">
        <template slot="thead">
          <vs-th>Korisnički račun</vs-th>
          <vs-th>Opcije</vs-th>
        </template>

        <template>
          <vs-tr v-for="item in narudzba.nalozi" :key="item.id">
            <vs-td>{{ item.kor_racun }}</vs-td>
            <vs-td
              ><vs-button v-on:click="view(item)" class="mr-3 mb-2"
                >Pogledaj</vs-button
              ><vs-button
                v-on:click="edit(item.id)"
                v-if="!item.isporuka_id"
                color="success"
                class="mr-3 mb-2"
                >Uredi</vs-button
              ><vs-button
                v-on:click="
                  print(`/storage/nalozi/${item.id}/${item.filename}`)
                "
                color="warning"
                class="mr-3 mb-2"
                >Printaj</vs-button
              ><DeleteButton
                :entity="item"
                entity-name="Nalog"
                v-if="item.status !== 'isporuceno'"
                entity-table-name="nalozi"
                @get-errors="setErrors"
                @get-success="getData"
              ></DeleteButton
            ></vs-td>
          </vs-tr>
        </template>
      </vs-table>
      <vs-button class="mr-3 mb-2 float-r" @click="printAll('nalozi')"
        >Printaj sve naloge</vs-button
      >
      <vs-button
        color="success"
        class="mr-3 mb-2 float-r"
        @click="printAll('nacrtiNalozi')"
        >Printaj sve naloge i nacrte</vs-button
      >
      <div class="vx-row">
        <div class="vx-col w-full">
          <h4 class="narudzba_items">Potvrda narudžbe</h4>
          <vs-button v-on:click="potvrda()" class="mr-3 mb-2 narudzba_button"
            >Preuzmi</vs-button
          >
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import print from "print-js";
import Datepicker from "vuejs-datepicker";
import { hr } from "vuejs-datepicker/dist/locale";
import Errors from "../../../components/common/Errors";
import Success from "../../../components/common/Success";
import DeleteButton from "../../../components/common/DeleteButton";

export default {
  components: {
    Errors,
    Success,
    Datepicker,
    DeleteButton,
  },
  data() {
    return {
      btnDisabled: false,
      narudzba: {
        kooperant: {},
      },
      id: "",
      print: print,
      responseErrors: null,
      responseSuccess: null,
      hr: hr,
    };
  },
  computed: {
    cooperants() {
      return this.$store.state.cooperants;
    },
  },
  methods: {
    setErrors(err) {
      this.responseErrors = err;
    },
    addNalog() {
      window.location.href = "/nalozi/novi/" + this.narudzba.id;
    },
    printAll(val) {
      if (val === "nalozi") {
        this.$axios
          .get(
            "/api/print_all_nalozi/" + this.narudzba.id
          )
          .then((res) => {
            print(`/storage/tmp/` + res.data);
          })
      } else {
        this.$axios
          .get(
            "/api/print_all_nalozi_nacrti/" +
              this.narudzba.id
          )
          .then((res) => {
            print(`/storage/tmp/` + res.data);
          })
      }
    },
    view(item) {
      window.open(`/storage/nalozi/${item.id}/${item.filename}`);
    },
    potvrda() {
      const link = document.createElement("a");
      link.href = `/storage/potvrde_narudzbe/${this.narudzba.id}/${this.narudzba.potvrda_narudzbe}`;
      link.setAttribute("download", `${this.narudzba.potvrda_narudzbe}`);
      link.click();

      // var fileURL = new Blob([`/storage/potvrde_narudzbe/${this.narudzba.id}/${this.narudzba.potvrda_narudzbe}`], { type: 'application/pdf' });
      // var fileLink = document.createElement("a");
      //
      // fileLink.href = fileURL;
      // fileLink.setAttribute("download", this.narudzba.potvrda_narudzbe);
      // document.body.appendChild(fileLink);
      //
      // fileLink.click();
    },
    postRequest() {
      this.btnDisabled = true;
      this.$axios({
        method: "PUT",
        url: "/api/narudzbe/update/" + this.narudzba.id,
        data: this.narudzba,
      })
        .then((res) => {
          this.$vs.notify({
            title: `Narudžba ${this.narudzba.broj_narudzbe} uspješno ažurirana`,
            position: "bottom-right",
            color: "primary",
          });
          this.btnDisabled = false;
          this.responseSuccess = res.data.message;
          this.responseErrors = null;
          this.getData();
        })
        .catch((err) => {
          this.$vs.notify({
            title: `Narudžba nije ažurirana`,
            text: "Molimo provjerite greške.",
            position: "bottom-right",
            color: "danger",
          });
          this.btnDisabled = false;
          this.responseErrors = err.response;
        });
    },
    getData() {
      this.$axios({
        method: "GET",
        url: "/api/narudzbe/show/" + this.$route.params.id,
      })
        .then((res) => {
          this.narudzba = res.data;
          this.narudzba.kooperant = res.data.kooperant.id;
        })
        .catch((err) => {
          this.responseErrors = err.response;
        });
    },
    edit(id) {
      window.location.href = "/nalozi/pregled/" + id;
    },
  },
  beforeMount() {
    this.getData();
    this.$store.dispatch("getCooperants");
  },
};
</script>
