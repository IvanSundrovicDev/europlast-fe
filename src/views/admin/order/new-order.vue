<template>
  <div class="max-width-500">
    <Errors
      :response-errors="responseErrors"
      v-if="responseErrors !== null"
    ></Errors>
    <h2 class="style-title">Unos nove narudžbe</h2>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <label class="vs-input--label">Datum narudžbe</label>
        <datepicker
          v-model="order.datum_narudzbe"
          class="logs-search-items"
          :language="hr"
          style="z-index: 1010"
          :clear-button="true"
          :monday-first="true"
        ></datepicker>
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-select
          class="w-full"
          v-model="order.kooperant"
          label="Kooperant"
          v-on:input="getNacrtId"
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
          v-model="order.broj_narudzbe"
          type="text"
          label="Broj narudžbe"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          class="w-full"
          v-model="order.nastavak"
          type="text"
          label="Nastavak"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          class="w-full"
          v-model="order.transport"
          type="text"
          label="Cijena transporta"
        />
        <small style="color: red"
          ><em>Format iznosa: 100.00 ; 1000.00 itd.</em></small
        >
      </div>
    </div>
    <div class="racun" v-for="racun in racuni" :key="racun">
      <div class="remove-button" v-on:click="removeAccount(racun - 1)">
        <x-icon size="1.5x" class="remove_icon"></x-icon>
      </div>

      <div class="vx-row mb-6">
        <div class="vx-col w-full">
          <vs-input
            class="w-full"
            v-model="order.korisnicki_racuni[racun - 1].racun"
            type="text"
            label="Korisnički račun"
          />
          <br />
          <vs-checkbox
            color="dark"
            v-model="order.korisnicki_racuni[racun - 1].check"
            @change="checkAccount(racun - 1)"
            >Generiraj račun</vs-checkbox
          >
          <vs-chip
            color="primary"
            style="margin-top: 2em; cursor: pointer"
            v-on:click.native="getNacrtId"
          >
            Ponovno dohvaćanje pozicija
          </vs-chip>
        </div>
      </div>

      <div class="vx-row mb-6">
        <div class="vx-col w-full">
          <vs-input
            class="w-full"
            v-model="order.korisnicki_racuni[racun - 1].sifra_nacrta"
            type="text"
            :input="autoSuggestNacrt(racun - 1)"
            label="Broj nacrta"
            :disabled="!order.kooperant"
          />
          <div
            class="auto-suggest"
            v-if="order.korisnicki_racuni[racun - 1].nacrt.openSuggest"
          >
            <ul>
              <li
                v-for="(item, key) in order.korisnicki_racuni[racun - 1].nacrt
                  .suggestItems"
                :key="key"
                @click="addValueNacrt(item, racun - 1)"
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
            v-model="order.korisnicki_racuni[racun - 1].naziv_pozicije"
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
            v-model="order.korisnicki_racuni[racun - 1].materijal"
            disabled
            type="text"
            label="Šifra materijala pozicije"
          />
        </div>
      </div>

      <div class="operacije">
        <p class="operacije-title">Operacije</p>
        <div class="vx-row mb-6">
          <div class="vx-col w-full">
            <vs-chip
              color="success"
              style="margin-top: 2em; cursor: pointer"
              v-show="
                order.korisnicki_racuni[racun - 1].allOperacije[0] &&
                !order.korisnicki_racuni[racun - 1].operacije[0]
              "
              v-on:click.native="addAllOperations(racun - 1)"
              >Dodaj sve operacije</vs-chip
            >
            <vs-chip
              color="danger"
              style="margin-top: 2em; cursor: pointer"
              v-show="order.korisnicki_racuni[racun - 1].operacije[0]"
              v-on:click.native="removeAllOperations(racun - 1)"
              >Ukloni sve operacije</vs-chip
            >
          </div>
        </div>
        <div
          v-for="(item, index) in order.korisnicki_racuni[racun - 1]
            .allOperacije"
          class="vx-row mb-6"
          :key="index"
        >
          <div class="vx-col w-full">
            <vs-checkbox
              v-model="order.korisnicki_racuni[racun - 1].operacije"
              :vs-value="item"
              >{{ item.naziv_operacije }}</vs-checkbox
            >
          </div>
        </div>
      </div>

      <div class="vx-row mb-6">
        <div class="vx-col w-full">
          <vs-input
            class="w-full"
            v-model="order.korisnicki_racuni[racun - 1].projekt"
            type="text"
            label="Projekt"
          />
        </div>
      </div>

      <div class="vx-row mb-6">
        <div class="vx-col w-full">
          <vs-input
            class="w-full"
            v-model="order.korisnicki_racuni[racun - 1].serija"
            type="text"
            label="Serija"
          />
        </div>
      </div>

      <div class="vx-row mb-6">
        <div class="vx-col w-full">
          <label class="vs-input--label">Rok pile</label>
          <datepicker
            v-model="order.korisnicki_racuni[racun - 1].rok_pila"
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
            v-model="order.korisnicki_racuni[racun - 1].rok_tokari"
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
            v-model="order.korisnicki_racuni[racun - 1].rok_glodaci"
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
            v-model="order.korisnicki_racuni[racun - 1].rok_isporuke"
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
            v-model="order.korisnicki_racuni[racun - 1].komada"
            type="text"
            label="Komada"
          />
        </div>
      </div>

      <div class="vx-row mb-6">
        <div class="vx-col w-full">
          <vs-input
            class="w-full"
            v-model="order.korisnicki_racuni[racun - 1].napomena"
            type="text"
            label="Napomena"
          />
        </div>
      </div>

      <div
        class="stavka"
        v-for="index in order.korisnicki_racuni[racun - 1].items"
        :key="index"
      >
        <div
          class="remove-button"
          v-on:click="removeItem(racun - 1, index - 1)"
        >
          <x-icon size="1.5x" class="remove_icon"></x-icon>
        </div>

        <div class="vx-row mb-6">
          <div class="vx-col w-full">
            <vs-input
              class="w-full"
              v-model="
                order.korisnicki_racuni[racun - 1].stavke[index - 1].broj_stavke
              "
              type="number"
              label="Broj stavke"
            />
          </div>
        </div>
        <div class="vx-row mb-6">
          <div class="vx-col w-full">
            <vs-select
              class="w-full"
              v-model="
                order.korisnicki_racuni[racun - 1].stavke[index - 1].ukupnaCijena
              "
              @change="calculate(racun - 1, index - 1)"
              label="Cijena"
            >
              <vs-select-item
                v-if="order.korisnicki_racuni[racun - 1].cijena_po_kom"
                key="cijena0"
                :value="`${order.korisnicki_racuni[racun - 1].cijena_po_kom}/kom`"
                :text="`${
                  order.korisnicki_racuni[racun - 1].cijena_po_kom
                }${order.korisnicki_racuni[
                  racun - 1
                ].valuta.toLowerCase()}/kom`"
              />
              <vs-select-item
                v-if="order.korisnicki_racuni[racun - 1].cijena_po_kom_2"
                key="cijena1"
                :value="`${order.korisnicki_racuni[racun - 1].cijena_po_kom_2}/kom`"
                :text="`${
                  order.korisnicki_racuni[racun - 1].cijena_po_kom_2
                }/kom`"
              />
              <vs-select-item
                v-if="order.korisnicki_racuni[racun - 1].cijena_po_kom_3"
                key="cijena2"
                :value="`${order.korisnicki_racuni[racun - 1].cijena_po_kom_3}/kom`"
                :text="`${
                  order.korisnicki_racuni[racun - 1].cijena_po_kom_3
                }${order.korisnicki_racuni[
                  racun - 1
                ].valuta.toLowerCase()}/kom`"
              />
              <vs-select-item
                v-if="order.korisnicki_racuni[racun - 1].cijena_po_kom_4"
                key="cijena3"
                :value="`${order.korisnicki_racuni[racun - 1].cijena_po_kom_4}/kom`"
                :text="`${
                  order.korisnicki_racuni[racun - 1].cijena_po_kom_4
                }${order.korisnicki_racuni[
                  racun - 1
                ].valuta.toLowerCase()}/kom`"
              />
              <vs-select-item
                v-if="order.korisnicki_racuni[racun - 1].cijena_po_kom_5"
                key="cijena4"
                :value="`${order.korisnicki_racuni[racun - 1].cijena_po_kom_5}/kom`"
                :text="`${
                  order.korisnicki_racuni[racun - 1].cijena_po_kom_5
                }${order.korisnicki_racuni[
                  racun - 1
                ].valuta.toLowerCase()}/kom`"
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
              v-on:input="calculate(racun - 1, index - 1)"
              v-model="
                order.korisnicki_racuni[racun - 1].stavke[index - 1].kolicina
              "
              type="text"
              label="Potrebna količina"
            />
          </div>
        </div>
        <div class="vx-row mb-6">
          <div class="vx-col w-full">
            <vs-input
              class="w-full"
              v-model="
                order.korisnicki_racuni[racun - 1].stavke[index - 1].ukupno
              "
              type="text"
              label="Ukupno"
            />
          </div>
        </div>
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
          color="warning"
          v-if="racuni"
          v-on:click="addItem()"
          class="mr-3 mb-2"
          >Dodaj stavku</vs-button
        >
        <vs-button
          color="success"
          v-on:click="addAccount()"
          :disabled="disableDodajRacun"
          class="mr-3 mb-2"
          >Dodaj račun</vs-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import Datepicker from "vuejs-datepicker";
import { hr } from "vuejs-datepicker/dist/locale";
import Errors from "../../../components/common/Errors";

import { XIcon } from "vue-feather-icons";

export default {
  data() {
    return {
      btnDisabled: false,
      order: {
        kooperant: "",
        broj_narudzbe: "",
        nastavak: "",
        datum_narudzbe: "",
        transport: "",
        korisnicki_racuni: [
          {
            items: 0,
            check: false,
            racun: "",
            operacije: [],
            allOperacije: [],
            nacrt: {
              suggestItems: [],
              oldValue: null,
              openSuggest: false,
            },
            sifra_nacrta: "",
            naziv_pozicije: "",
            materijal: "",
            projekt: "",
            serija: "",
            rok_pila: "",
            rok_tokari: "",
            rok_glodaci: "",
            rok_isporuke: "",
            komada: "",
            napomena: "",
            stavke: [],
          },
        ],
      },
      baseItems: [],
      racuni: 1,
      responseErrors: null,
      stavke: 0,
      hr: hr,
    };
  },
  components: {
    Datepicker,
    XIcon,
    Errors,
  },
  computed: {
    cooperants() {
      return this.$store.state.cooperants;
    },
    prices() {
      return this.$store.state.prices;
    },
    disableDodajRacun() {
      return this.order.korisnicki_racuni.forEach(
        (element) => element.racun === ""
      );
    },
  },
  methods: {
    removeAccount(index) {
      this.order.korisnicki_racuni.splice(index, 1);
      this.racuni = this.racuni - 1;
    },
    removeItem(index, stavkaIndex) {
      this.order.korisnicki_racuni[index].stavke.splice(stavkaIndex, 1);
      this.order.korisnicki_racuni[index].items =
        this.order.korisnicki_racuni[index].items - 1;
    },
    checkAccount(index) {
      let korRac = this.order.korisnicki_racuni[0];

      if (this.order.korisnicki_racuni[index].check) {
        if (
          this.order.korisnicki_racuni[index].racun === korRac.racun &&
          this.order.korisnicki_racuni.length === 1
        ) {
          this.$axios({
            method: "GET",
            url: "/api/narudzbe/generate_korisnicki_racun",
          })
            .then((res) => {
              this.order.korisnicki_racuni[index].racun = res.data;
              this.order.korisnicki_racuni[index].hasRacun = true;
            })
            .catch((err) => {
              this.responseErrors = err.response;
              this.order.korisnicki_racuni[index].racun = "";
              this.order.korisnicki_racuni[index].check = false;
              this.order.korisnicki_racuni[index].hasRacun = false;
            });
        } else {
          if (this.order.korisnicki_racuni[index - 1].racun === "") {
            this.$axios({
              method: "GET",
              url: "/api/narudzbe/generate_korisnicki_racun",
            })
              .then((res) => {
                this.order.korisnicki_racuni[index].racun = res.data;
              })
              .catch((err) => {
                this.responseErrors = err.response;
                this.order.korisnicki_racuni[index].racun = "";
                this.order.korisnicki_racuni[index].check = false;
              });
          } else {
            this.order.korisnicki_racuni[index].racun =
              parseInt(this.order.korisnicki_racuni[index - 1].racun) + 1;
          }
        }
      } else {
        this.$axios({
          method: "GET",
          url: "/api/narudzbe/korisnicki_racun_reset",
        }).then(() => {
          this.order.korisnicki_racuni[index].racun = "";
          this.order.korisnicki_racuni[index].check = false;
        });
      }
    },
    customFormatter(item) {
      const date = new Date(item);
      const formattedDate = date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      });
      return formattedDate;
    },
    calculate(index, stavkaIndex) {
      const ukupnaCijena = this.order.korisnicki_racuni[index].stavke[stavkaIndex].ukupnaCijena.split('/');
      let suma = ukupnaCijena[0] * this.order.korisnicki_racuni[index].stavke[stavkaIndex].kolicina
      let rounded = Math.round(suma * 100) / 100
      this.order.korisnicki_racuni[index].stavke[stavkaIndex].ukupno = rounded.toFixed(2)
      this.order.korisnicki_racuni[index].stavke[stavkaIndex].cijena = ukupnaCijena[0];
      this.order.korisnicki_racuni[index].stavke[stavkaIndex].jed_mjere = ukupnaCijena[1];
    },
    autoSuggestNacrt(index) {
      if (this.order.korisnicki_racuni[index].sifra_nacrta.length > 2) {
        if (
          this.order.korisnicki_racuni[index].nacrt.oldValue !==
          this.order.korisnicki_racuni[index].sifra_nacrta
        ) {
          let items = [];
          for (var i = 0; i < this.baseItems.length; i++) {
            let item = this.baseItems[i].substring(
              0,
              this.order.korisnicki_racuni[index].sifra_nacrta.length
            );
            if (item == this.order.korisnicki_racuni[index].sifra_nacrta) {
              items.push(this.baseItems[i]);
            }
          }
          this.order.korisnicki_racuni[index].nacrt.oldValue =
            this.order.korisnicki_racuni[index].sifra_nacrta;
          this.order.korisnicki_racuni[index].nacrt.suggestItems = items;
          this.order.korisnicki_racuni[index].nacrt.openSuggest = true;
        }
      } else {
        this.order.korisnicki_racuni[index].nacrt.openSuggest = false;
      }
    },
    addValueNacrt(value, index) {
      this.order.korisnicki_racuni[index].nacrt.openSuggest = false;
      this.order.korisnicki_racuni[index].sifra_nacrta = value;
      this.order.korisnicki_racuni[index].nacrt.oldValue = value;

      this.$axios({
        method: "GET",
        url: "/api/pozicije/get_pozicija_by_nacrt/" + value,
      })
        .then((res) => {
          this.order.korisnicki_racuni[index].naziv_pozicije = res.data.naziv;
          this.order.korisnicki_racuni[index].valuta =
            res.data.kooperant.valuta;
          this.order.korisnicki_racuni[index].cijena_po_kom =
            res.data.cijena_po_kom;
          this.order.korisnicki_racuni[index].cijena_po_kom_2 =
            res.data.cijena_po_kom_2;
          this.order.korisnicki_racuni[index].cijena_po_kom_3 =
            res.data.cijena_po_kom_3;
          this.order.korisnicki_racuni[index].cijena_po_kom_4 =
            res.data.cijena_po_kom_4;
          this.order.korisnicki_racuni[index].cijena_po_kom_5 =
            res.data.cijena_po_kom_5;
          this.order.korisnicki_racuni[index].materijal =
            res.data.sifra_materijala_pozicije;
          this.order.korisnicki_racuni[index].allOperacije = res.data.operacije;
        })
        .catch((err) => {
          console.log(err);
          this.responseErrors = err.response;
        });
    },
    getNacrtId() {
      this.$axios({
        method: "GET",
        url: "/api/nacrti/list/" + this.order.kooperant,
      })
        .then((res) => {
          this.baseItems = res.data;
        })
        .catch((err) => {
          this.responseErrors = err.response;
        });
    },
    addItem() {
      this.order.korisnicki_racuni[this.racuni - 1].items =
        this.order.korisnicki_racuni[this.racuni - 1].items + 1;
      this.stavke = this.stavke + 10;
      let value = ("000" + this.stavke).slice(-4);

      this.order.korisnicki_racuni[this.racuni - 1].stavke.push({
        ukupno: "",
        kolicina: "",
        broj_stavke: value,
        ukupnaCijena: "",
        cijena: "",
        jed_mjere: "",
      });
    },
    addAccount() {
      this.racuni = this.racuni + 1;
      this.order.korisnicki_racuni.push({
        items: 0,
        racun: "",
        nacrt: {
          suggestItems: [],
          oldValue: null,
          openSuggest: false,
        },
        sifra_nacrta: "",
        naziv_pozicije: "",
        materijal: "",
        operacije: [],
        allOperacije: [],
        check: false,
        projekt: "",
        serija: "",
        rok_pila: "",
        rok_tokari: "",
        rok_glodaci: "",
        rok_isporuke: "",
        komada: "",
        stavke: [],
      });
    },
    addAllOperations(index) {
      this.order.korisnicki_racuni[index].operacije =
        this.order.korisnicki_racuni[index].allOperacije;
    },
    removeAllOperations(index) {
      this.order.korisnicki_racuni[index].operacije = [];
    },
    postRequest() {
      this.btnDisabled = true;
      this.$axios({
        method: "POST",
        url: "/api/narudzbe/store",
        data: this.order,
      })
        .then((res) => {
          window.location.href = "/narudzbe/pregled/" + res.data.narudzba_id;
        })
        .catch((err) => {
          this.btnDisabled = false;
          this.responseErrors = err.response;
          this.$vs.notify({
            title: `Neuspješno dodavanje narudžbe`,
            text:
              "Greška: " + err.response.data.message + " Provjerite podatke.",
            position: "bottom-right",
            color: "danger",
          });
        });
    },
  },
  beforeMount() {
    this.$store.dispatch("getCooperants");
    this.$store.dispatch("getPrices");
  },
  beforeDestroy() {
    this.$axios({
      method: "GET",
      url: "/api/narudzbe/korisnicki_racun_reset",
    });
  },
  beforeRouteLeave(to, from, next) {
    const answer = window.confirm(
      "Jeste li sigurni da želite odbaciti narudžbu!"
    );
    if (answer) {
      next();
    } else {
      next(false);
    }
  },
};
</script>
