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
    <div>
      <div class="max-width-500">
        <h2 class="style-title">Novi nalog</h2>
        <div class="vx-row mb-6">
          <div class="vx-col w-full">
            <vs-input
              class="w-full"
              v-model="nalog.racun"
              :disabled="nalog.check"
              type="number"
              label="Korisnički račun"
            />
            <br />
            <vs-checkbox
              color="dark"
              v-model="nalog.check"
              @change="checkAccount()"
              >Generiraj račun</vs-checkbox
            >
          </div>
        </div>

        <div class="vx-row mb-6">
          <div class="vx-col w-full">
            <vs-input
              class="w-full"
              type="text"
              v-model="nalog.broj_nacrta"
              :input="autoSuggestNacrt()"
              label="Broj nacrta"
            />
            <div class="auto-suggest" v-if="openSuggest">
              <ul>
                <li
                  v-for="(item, key) in this.filteredItems"
                  :key="key"
                  @click="addToNalog(item)"
                >
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="vx-row mb-6">
          <div class="vx-col w-full">
            <vs-input
              class="w-full"
              v-model="nalog.naziv_pozicije"
              disabled
              type="text"
              label="Naziv pozicije"
            />
          </div>
        </div>

        <div class="vx-row mb-6">
          <div class="vx-col w-full">
            <vs-input
              class="w-full"
              v-model="nalog.materijal"
              disabled
              type="text"
              label="Šifra materijala pozicije"
            />
          </div>
        </div>

        <div class="operacije">
          <p class="operacije-title">Operacije</p>
          <div
            v-for="(item, index) in nalog.allOperacije"
            class="vx-row mb-6"
            :key="index"
          >
            <div class="vx-col w-full">
              <vs-checkbox v-model="nalog.operacije" :vs-value="item">
                {{ item.naziv_operacije }}
              </vs-checkbox>
            </div>
          </div>
        </div>

        <div class="vx-row mb-6">
          <div class="vx-col w-full">
            <vs-input
              class="w-full"
              v-model="nalog.projekt"
              type="text"
              label="Projekt"
            />
          </div>
        </div>

        <div class="vx-row mb-6">
          <div class="vx-col w-full">
            <vs-input
              class="w-full"
              v-model="nalog.serija"
              type="text"
              label="Serija"
            />
          </div>
        </div>

        <div class="vx-row mb-6">
          <div class="vx-col w-full">
            <label class="vs-input--label">Rok pile</label>
            <datepicker
              v-model="nalog.rok_pila"
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
            <label class="vs-input--label">Rok tokari</label>
            <datepicker
              v-model="nalog.rok_tokari"
              class="logs-search-items"
              :language="hr"
              style="z-index: 1003"
              :clear-button="true"
              :monday-first="true"
            ></datepicker>
          </div>
        </div>

        <div class="vx-row mb-6">
          <div class="vx-col w-full">
            <label class="vs-input--label">Rok glodači</label>
            <datepicker
              v-model="nalog.rok_glodaci"
              class="logs-search-items"
              :language="hr"
              style="z-index: 1002"
              :clear-button="true"
              :monday-first="true"
            ></datepicker>
          </div>
        </div>

        <div class="vx-row mb-6">
          <div class="vx-col w-full">
            <label class="vs-input--label">Rok isporuke</label>
            <datepicker
              v-model="nalog.rok_isporuke"
              class="logs-search-items"
              :language="hr"
              style="z-index: 1001"
              :clear-button="true"
              :monday-first="true"
            ></datepicker>
          </div>
        </div>

        <div class="vx-row mb-6">
          <div class="vx-col w-full">
            <vs-input
              class="w-full"
              v-model="nalog.komada"
              type="text"
              label="Komada"
            />
          </div>
        </div>

        <div class="vx-row mb-6">
          <div class="vx-col w-full">
            <vs-input
              class="w-full"
              v-model="nalog.napomena"
              type="text"
              label="Napomena"
            />
          </div>
        </div>
        <div
          class="stavka"
          v-for="(stavka, index) in nalog.stavke"
          :key="index"
        >
          <div class="remove-button" v-on:click="removeItem(index)">
            <x-icon size="1.5x" class="remove_icon"></x-icon>
          </div>

          <div class="vx-row mb-6">
            <div class="vx-col w-full">
              <vs-input
                class="w-full"
                v-model="nalog.stavke[index].broj_stavke"
                type="number"
                label="Broj stavke"
              />
            </div>
          </div>
          <div class="vx-row mb-6">
            <div class="vx-col w-full">
              <vs-select
                class="w-full"
                v-model="nalog.stavke[index].ukupnaCijena"
                @change="calculate(index)"
                label="Cijena"
              >
                <vs-select-item
                  v-if="nalog.cijena_po_kom"
                  key="cijena0"
                  :value="`${nalog.cijena_po_kom}/kom`"
                  :text="`${nalog.cijena_po_kom}/kom`"
                />
                <vs-select-item
                  v-if="nalog.cijena_po_kom_2"
                  key="cijena1"
                  :value="`${nalog.cijena_po_kom_2}/kom`"
                  :text="`${nalog.cijena_po_kom_2}/kom`"
                />
                <vs-select-item
                  v-if="nalog.cijena_po_kom_3"
                  key="cijena2"
                  :value="`${nalog.cijena_po_kom_3}/kom`"
                  :text="`${nalog.cijena_po_kom_3}/kom`"
                />
                <vs-select-item
                  v-if="nalog.cijena_po_kom_4"
                  key="3"
                  :value="`${nalog.cijena_po_kom_4}/kom`"
                  :text="`${nalog.cijena_po_kom_4}/kom`"
                />
                <vs-select-item
                  v-if="nalog.cijena_po_kom_5"
                  key="cijena4"
                  :value="`${nalog.cijena_po_kom_5}/kom`"
                  :text="`${nalog.cijena_po_kom_5}/kom`"
                />
                <vs-select-item
                  v-for="price in prices"
                  :key="price.id"
                  :value="`${price.iznos}/${price.jed_mjere}`"
                  :text="`${price.iznos}/${price.jed_mjere}`"
                />
              </vs-select>
            </div>
          </div>
          <div class="vx-row mb-6">
            <div class="vx-col w-full">
              <vs-input
                class="w-full"
                v-on:input="calculate(index)"
                v-model="nalog.stavke[index].kolicina"
                type="text"
                label="Potrebna količina"
              />
            </div>
          </div>
          <div class="vx-row mb-6">
            <div class="vx-col w-full">
              <vs-input
                class="w-full"
                v-model="nalog.stavke[index].ukupno"
                type="number"
                label="Ukupno"
              />
            </div>
          </div>
        </div>

        <div class="vx-row">
          <div class="vx-col w-full order-buttons">
            <vs-button
              class="mr-3 mb-2"
              :disabled="disabled"
              v-on:click="postRequest"
              >Spremi</vs-button
            >
            <vs-button color="warning" v-on:click="addItem()" class="mr-3 mb-2"
              >Dodaj stavku</vs-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import Datepicker from "vuejs-datepicker";
import { hr } from "vuejs-datepicker/dist/locale";
import Errors from "../../../components/common/Errors";
import Success from "../../../components/common/Success";

import { XIcon } from "vue-feather-icons";

export default {
  data() {
    return {
      nalog: {
        radnja: {},
        racun: "",
        naziv_pozicije: "",
        valuta: "",
        cijena_po_kom: "",
        materijal: "",
        allOperacije: "",
        broj_nacrta: "",
        operacije: [],
        stavke: [],
        items: 0,
        serija: "",
        projekt: "",
        rok_pila: "",
        rok_glodaci: "",
        rok_tokari: "",
        rok_isporuke: "",
        komada: "",
      },
      nacrt: {
        suggestItems: [],
        oldValue: null,
        openSuggest: false,
      },
      oldValue: "",
      filteredItems: [],
      openSuggest: false,
      disabled: false,
      baseItems: [],
      check: false,
      hr: hr,
      responseErrors: null,
      responseSuccess: null,
    };
  },
  components: {
    Datepicker,
    XIcon,
    Errors,
    Success,
  },
  computed: {
    prices() {
      return this.$store.state.prices;
    },
  },
  methods: {
    checkAccount() {
      if (this.nalog.check) {
        this.$axios({
          method: "GET",
          url: "/api/narudzbe/generate_korisnicki_racun",
        })
          .then((res) => {
            this.nalog.racun = res.data;
          })
          .catch((err) => {
            this.responseErrors = err.response;
            this.nalog.racun = "";
            this.nalog.check = false;
          });
      } else {
        this.nalog.racun = "";
      }
    },
    addValueNacrt(value) {
      this.nalog.broj_nacrta = value;
      this.$axios({
        method: "GET",
        url: "/api/pozicije/get_pozicija_by_nacrt/" + value,
      })
        .then((res) => {
          this.nalog.naziv_pozicije = res.data.naziv;
          this.nalog.valuta = res.data.kooperant.valuta;
          this.nalog.cijena_po_kom = res.data.cijena_po_kom;
          this.nalog.cijena_po_kom_2 = res.data.cijena_po_kom_2;
          this.nalog.cijena_po_kom_3 = res.data.cijena_po_kom_3;
          this.nalog.cijena_po_kom_4 = res.data.cijena_po_kom_4;
          this.nalog.cijena_po_kom_5 = res.data.cijena_po_kom_5;
          this.nalog.materijal = res.data.sifra_materijala_pozicije;
          this.nalog.allOperacije = res.data.operacije;
        })
        .catch((err) => {
          this.responseErrors = err.response;
        });
    },
    autoSuggestNacrt() {
      if (this.nalog.broj_nacrta > 2) {
        if(this.nalog.broj_nacrta != this.oldValue) {
          console.log(this.nalog.broj_nacrta, this.oldValue);
          this.filteredItems = this.baseItems.filter((nacrt) => {
            return nacrt.toLowerCase().startsWith(this.nalog.broj_nacrta.toLowerCase());
          });
          if (this.filteredItems.length > 0) {
            this.openSuggest = true;
          } else {
            this.openSuggest = false;
          }
          this.oldValue = this.nalog.broj_nacrta;
        }
      } else {
        this.openSuggest = false;
      }
      console.log("finished")
    },
    addToNalog(item) {
      this.openSuggest = false;
      this.nalog.broj_nacrta = item;
      this.oldValue = item;
      this.addValueNacrt(item);
    },
    getNacrtId(id) {
      this.$axios({
        method: "GET",
        url: "/api/nacrti/list/" + id,
      })
        .then((res) => {
          this.baseItems = res.data;
        })
        .catch((err) => {
          this.responseErrors = err.reponse;
        });
    },
    addItem() {
      this.nalog.items = this.nalog.items + 1;
      let brojStavke = this.nalog.items * 10;
      let value = ("000" + brojStavke).slice(-4);

      this.nalog.stavke.push({
        ukupno: "",
        kolicina: "",
        broj_stavke: value,
        cijena: "",
        jed_mjere: "",
      });
    },
    getNarudzba() {
      this.$axios({
        method: "GET",
        url: "/api/narudzbe/show/" + this.$route.params.id,
      })
        .then((res) => {
          this.getNacrtId(res.data.kooperant_id);
        })
        .catch((err) => {
          this.responseErrors = err.response;
        });
    },
    removeItem(stavkaIndex) {
      this.nalog.stavke.splice(stavkaIndex, 1);
      this.nalog.items = this.nalog.items - 1;
    },
    calculate(stavkaIndex) {
      const ukupnaCijena = this.nalog.stavke[stavkaIndex].ukupnaCijena.split("/");
      let suma = ukupnaCijena[0] * this.nalog.stavke[stavkaIndex].kolicina
      let rounded = Math.round(suma * 100) / 100
      this.nalog.stavke[stavkaIndex].ukupno = rounded.toFixed(2)
      this.nalog.stavke[stavkaIndex].cijena = ukupnaCijena[0];
      this.nalog.stavke[stavkaIndex].jed_mjere = ukupnaCijena[1];
    },
    postRequest() {
      this.disabled = true;
      this.$axios({
        method: "POST",
        url: "/api/nalozi/nalog_narudzbe/" + this.$route.params.id,
        data: this.nalog,
      })
        .then((res) => {
          this.responseSuccess = res.data.message;
          this.disabled = false;
          this.$router.go(-1);
        })
        .catch((err) => {
          this.$vs.notify({
            title: `Nalog nije kreiran.`,
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
    this.getNarudzba();
    this.$store.dispatch("getPrices");
  },
};
</script>

<style>
.autocomplete-input {
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  width: 100%;
  padding: 12px 12px 12px 48px;
  box-sizing: border-box;
  position: relative;
  font-size: 16px;
  line-height: 1;
  flex: 1;
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNjY2IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PGNpcmNsZSBjeD0iMTEiIGN5PSIxMSIgcj0iOCIvPjxwYXRoIGQ9Ik0yMSAyMWwtNC00Ii8+PC9zdmc+");
  background-repeat: no-repeat;
  background-position: 12px;
}
.autocomplete-input:focus,
.autocomplete-input[aria-expanded="true"] {
  border: 1px solid rgba(0, 0, 0, 0.2);
  background-color: #fff;
  outline: none;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.16);
}
[data-position="below"] .autocomplete-input[aria-expanded="true"] {
  border-radius: 5px;
}
[data-position="above"] .autocomplete-input[aria-expanded="true"] {
  border: 1px solid rgba(0, 0, 0, 0.2);
  z-index: 2;
}
.autocomplete[data-loading="true"]:after {
  content: "";
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-right-color: rgba(0, 0, 0, 0.48);
  border-radius: 100%;
  width: 20px;
  height: 20px;
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  animation: rotate 1s linear infinite;
}
.autocomplete-result-list {
  margin: 0;
  border: 1px solid rgba(0, 0, 0, 0.2);
  padding: 0;
  box-sizing: border-box;
  max-height: 296px;
  overflow-y: auto;
  background: #fff;
  list-style: none;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.16);
}
[data-position="below"] .autocomplete-result-list {
  margin-top: -1px;
  border-top-color: transparent;
  border-radius: 0 0 8px 8px;
  padding-bottom: 8px;
}
[data-position="above"] .autocomplete-result-list {
  margin-bottom: -1px;
  border-bottom-color: transparent;
  border-radius: 8px 8px 0 0;
  padding-top: 8px;
}
.autocomplete-result {
  cursor: default;
  padding: 12px 12px 12px 48px;
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjY2NjIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PGNpcmNsZSBjeD0iMTEiIGN5PSIxMSIgcj0iOCIvPjxwYXRoIGQ9Ik0yMSAyMWwtNC00Ii8+PC9zdmc+");
  background-repeat: no-repeat;
  background-position: 12px;
}
.autocomplete-result:hover,
.autocomplete-result[aria-selected="true"] {
  background-color: rgba(0, 0, 0, 0.06);
}
@keyframes rotate {
  0% {
    transform: translateY(-50%) rotate(0deg);
  }
  to {
    transform: translateY(-50%) rotate(359deg);
  }
}
</style>
