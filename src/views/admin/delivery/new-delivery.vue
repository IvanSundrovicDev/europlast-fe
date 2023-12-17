<template>
  <div>
    <Errors
      :response-errors="responseErrors"
      v-if="responseErrors !== null"
    ></Errors>
    <div v-if="!forward" class="max-width-500">
      <div class="vx-row mb-6">
        <div class="vx-col w-full">
          <h2 class="style-title">Unos nove isporuke</h2>
          <label class="vs-input--label" for="vs-input--label"
            >Datum isporuke</label
          >
          <datepicker
            v-model="isporuka.datum_isporuke"
            :language="hr"
            :clear-button="true"
            :monday-first="true"
          ></datepicker>
        </div>
      </div>
      <div class="vx-row">
        <div class="vx-col w-full">
          <vs-button
            class="mr-3 mb-2"
            :disabled="isDisabled"
            v-on:click="goForward"
            >Dalje</vs-button
          >
        </div>
      </div>
    </div>
    <vs-tabs v-if="forward">
      <vs-tab label="ISPORUKA">
        <div>
          <h2 class="style-title">
            Isporuka {{ handleDateTime(isporuka.datum_isporuke) }}
          </h2>
          <vs-divider />
          <div class="spacing">
            <div class="vx-row mb-6 max-width-500">
              <div class="vx-col w-full">
                <vs-select
                  class="w-full"
                  v-model="kooperant"
                  label="Kooperant"
                  v-on:input="getData()"
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
            <h4 class="style-title">Gotove Pozicije</h4>
            <vs-table data="nalozi">
              <template slot="thead">
                <vs-th>Broj narudžbe</vs-th>
                <vs-th>Korisnički račun</vs-th>
                <vs-th>Naziv pozicije</vs-th>
                <vs-th>Broj nacrta</vs-th>
                <vs-th>Datum</vs-th>
                <vs-th>Komada</vs-th>
                <vs-th>Opcije</vs-th>
              </template>

              <template>
                <vs-tr v-for="(item, index) in nalozi" :key="index">
                  <vs-td>{{ item.narudzba.broj_narudzbe }}</vs-td>
                  <vs-td>{{ item.kor_racun }}</vs-td>
                  <vs-td>{{ item.pozicija.naziv }}</vs-td>
                  <vs-td>{{ item.pozicija.broj_nacrta }}</vs-td>
                  <vs-td>{{ handleDateTime(item.rok_isporuke) }}</vs-td>
                  <vs-td>{{ item.komada }}</vs-td>
                  <vs-td
                    ><vs-button v-on:click="add(index)" class="mr-3 mb-2"
                      >Dodaj</vs-button
                    ></vs-td
                  >
                </vs-tr>
              </template>
            </vs-table>
            <br />
            <vs-button v-if="nalozi[0]" v-on:click="addAll()" class="mr-3 mb-2"
              >Dodaj sve</vs-button
            >
            <vs-divider />
            <h4 class="style-title">U isporuci</h4>
            <vs-table data="nalozi">
              <template slot="thead">
                <vs-th>Broj narudžbe</vs-th>
                <vs-th>Korisnički račun</vs-th>
                <vs-th>Naziv pozicije</vs-th>
                <vs-th>Broj nacrta</vs-th>
                <vs-th>Datum</vs-th>
                <vs-th>Komada</vs-th>
                <vs-th>Opcije</vs-th>
              </template>

              <template>
                <vs-tr v-for="(item, index) in isporuka.nalozi" :key="index">
                  <vs-td>{{ item.narudzba.broj_narudzbe }}</vs-td>
                  <vs-td>{{ item.kor_racun }}</vs-td>
                  <vs-td>{{ item.pozicija.naziv }}</vs-td>
                  <vs-td>{{ item.pozicija.broj_nacrta }}</vs-td>
                  <vs-td>{{ handleDateTime(item.rok_isporuke) }}</vs-td>
                  <vs-td>{{ item.komada }}</vs-td>
                  <vs-td
                    ><vs-button
                      v-on:click="remove(index)"
                      color="danger"
                      class="mr-3 mb-2"
                      >Ukloni</vs-button
                    ></vs-td
                  >
                </vs-tr>
              </template>
            </vs-table>
            <br />
            <vs-popup
              class="holamundo"
              title="Da li ste sigurni da želite spremiti isporuku?"
              :active.sync="popupActive"
            >
              <vs-button
                color="danger"
                :disabled="disabled"
                v-on:click="postRequest"
                class="mr-3 mb-2"
                >Da</vs-button
              >
              <vs-button @click="popupActive = false" class="mr-3 mb-2"
                >Ne</vs-button
              >
            </vs-popup>
            <div class="vx-row">
              <div class="vx-col w-full order-buttons">
                <vs-button
                  color="success"
                  v-if="isporuka.nalozi[0]"
                  @click="popupActive = true"
                  class="mr-3 mb-2"
                  >Isporuka gotova</vs-button
                >
              </div>
            </div>
          </div>
        </div>
      </vs-tab>
      <vs-tab label="PAPIRIĆI">
        <vs-button
          class="mr-3 mb-2"
          v-if="isporuka.nalozi[0]"
          v-on:click="printPapirici()"
          >Ispis</vs-button
        >
        <div id="print" v-if="isporuka.nalozi[0]">
          <table class="papirici" v-for="(item, key) in isporuka.nalozi" :key="key">
            <tbody>
              <tr>
                <th width="120px"></th>
                <th width="160px"></th>
                <th width="100px"></th>
              </tr>
              <tr>
                <td colspan="2" style="height: 45px">
                  <img
                    :src="require('@/assets/images/logo/logo.png')"
                    width="290"
                    height="45"
                  />
                </td>

                <td v-if="item.narudzba.kooperant.jezik === 'HR'">
                  Datum isporuke <br />
                  {{ handleDateTime(isporuka.datum_isporuke) }}
                </td>
                <td v-else>
                  Delivery Date <br />
                  {{ handleDateTime(isporuka.datum_isporuke) }}
                </td>
              </tr>
              <tr>
                <td v-if="item.narudzba.kooperant.jezik === 'HR'">
                  Broj narudžbe
                </td>
                <td v-else>Order number</td>
                <td colspan="2">
                  <span style="font-size: 22px">{{
                    item.narudzba.broj_narudzbe
                  }}</span>
                </td>
              </tr>
              <tr>
                <td v-if="item.narudzba.kooperant.jezik === 'HR'">
                  Korisnički račun
                </td>
                <td v-else>Account</td>
                <td colspan="2">
                  <span style="font-size: 22px">{{ item.kor_racun }}</span>
                </td>
              </tr>
              <tr>
                <td v-if="item.narudzba.kooperant.jezik === 'HR'">
                  Naziv pozicije
                </td>
                <td v-else>Position name</td>
                <td colspan="2">
                  <span style="font-size: 22px">{{ item.pozicija.naziv }}</span>
                </td>
              </tr>
              <tr>
                <td v-if="item.narudzba.kooperant.jezik === 'HR'">
                  Broj nacrta
                </td>
                <td v-else>Drawing number</td>
                <td colspan="2">
                  <span style="font-size: 22px">{{
                    item.pozicija.broj_nacrta
                  }}</span>
                </td>
              </tr>
              <tr>
                <td
                  v-if="item.narudzba.kooperant.jezik === 'HR'"
                  colspan="2"
                  style="height: 45px; text-align: left"
                >
                  Robu kontrolirao:<br />
                  <span style="font-size: 20px">Marko Kiš</span>
                </td>
                <td v-else colspan="2" style="height: 45px; text-align: left">
                  Goods controlled by:<br />
                  <span style="font-size: 20px">Marko Kiš</span>
                </td>
                <td v-if="item.narudzba.kooperant.jezik === 'HR'">
                  Količina <br />
                  <span style="font-size: 20px">{{ item.komada }}</span>
                </td>
                <td v-else>
                  Quantity <br />
                  <span style="font-size: 20px">{{ item.komada }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </vs-tab>
      <vs-tab label="PALETE">
        <div v-if="!next && isporuka.nalozi[0]">
          <vs-table data="nalozi">
            <template slot="thead">
              <vs-th>Broj narudžbe</vs-th>
              <vs-th>Korisnički račun</vs-th>
              <vs-th>Naziv pozicije</vs-th>
              <vs-th>Broj nacrta</vs-th>
              <vs-th>Komada</vs-th>
              <vs-th>Broj palete</vs-th>
            </template>

            <template>
              <vs-tr v-for="(item, index) in isporuka.nalozi" :key="index">
                <vs-td>{{ item.narudzba.broj_narudzbe }}</vs-td>
                <vs-td>{{ item.kor_racun }}</vs-td>
                <vs-td>{{ item.pozicija.naziv }}</vs-td>
                <vs-td>{{ item.pozicija.broj_nacrta }}</vs-td>
                <vs-td>{{ item.komada }}</vs-td>
                <vs-td
                  ><vs-input
                    class="inputx"
                    placeholder="Paleta"
                    type="number"
                    v-model="isporuka.nalozi[index].paleta"
                /></vs-td>
              </vs-tr>
            </template>
          </vs-table>
          <br />
          <vs-button class="mr-3 mb-2" v-on:click="goNext()">Dalje</vs-button>
        </div>

        <div v-if="next">
          <vs-button
            class="mr-3 mb-2"
            v-if="isporuka.nalozi[0]"
            v-on:click="printPalete()"
            >Ispis</vs-button
          >
          <vs-button class="mr-3 mb-2" color="danger" v-on:click="goBack()"
            >Nazad</vs-button
          >
          <div id="palete">
            <div v-for="(paleta, key) in palete" align="center" class="paletaMain" :key="key">
              <br />
              <br />
              <div class="paleta-inner">
                <table class="head">
                  <tbody>
                    <tr>
                      <td width="500px">Kooperant</td>
                      <td width="300px"><strong>EUROPLAST</strong></td>
                      <td width="100px"></td>
                      <td width="200px"></td>
                    </tr>
                    <tr>
                      <td>
                        Datum pristizanja robe u
                        {{ paleta[0].narudzba.kooperant.naziv }}
                      </td>
                      <td>{{ handleDateTime(isporuka.datum_isporuke) }}</td>
                      <td>Kontrolirao</td>
                      <td>_____________________</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <br /><br />
              <div class="paleta-inner">
                <table class="palete">
                  <tbody>
                    <tr>
                      <th width="75">Rb</th>
                      <th width="180">Projekt</th>
                      <th width="100">Serija</th>
                      <th width="180">Materijal</th>
                      <th width="250">Korisnički račun</th>
                      <th width="180">Broj nacrta</th>
                      <th width="150">Komada</th>
                    </tr>
                    <tr v-for="(nalog, key) in paleta" :key="key">
                      <td>{{ index + 1 }}</td>
                      <td>{{ nalog.projekt }}</td>
                      <td>{{ nalog.serija }}</td>
                      <td>{{ nalog.pozicija.sifra_materijala_pozicije }}</td>
                      <td>{{ nalog.kor_racun }}</td>
                      <td>{{ nalog.pozicija.broj_nacrta }}</td>
                      <td>{{ nalog.komada }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </vs-tab>
    </vs-tabs>
  </div>
</template>

<script>
import Datepicker from "vuejs-datepicker";
import { hr } from "vuejs-datepicker/dist/locale";
import Errors from "../../../components/common/Errors";

export default {
  components: {
    Datepicker,
    Errors,
  },
  data() {
    return {
      isporuka: {
        datum_isporuke: "",
        nalozi: [],
      },
      palete: [],
      disabled: false,
      displayDate: "",
      forward: false,
      nalozi: [],
      kooperant: "",
      number: 23,
      next: false,
      popupActive: false,
      hr: hr,
      responseErrors: null,
    };
  },
  computed: {
    isDisabled: function () {
      return !this.isporuka.datum_isporuke;
    },
    cooperants() {
      return this.$store.state.cooperants;
    },
  },
  methods: {
    handleDateTime(item) {
      const date = new Date(item);
      const formattedDate = date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      });
      return formattedDate;
    },
    goForward() {
      this.forward = true;
    },
    goNext() {
      let palete = this.palete;
      let punePalete = [];
      this.next = true;
      let length = 0;
      this.isporuka.nalozi.forEach((el) => {
        if (el.paleta > length) {
          length = Number(el.paleta);
        }
      });
      for (var i = 0; i < length; i++) {
        palete.push([]);
      }
      this.isporuka.nalozi.forEach((el) => {
        palete[el.paleta - 1].push(el);
      });
      palete.forEach((el) => {
        if (el[0]) {
          punePalete.push(el);
        }
      });
      this.palete = punePalete;
    },
    goBack() {
      this.next = false;
      this.palete = [];
    },
    printPalete() {
      let print = document.getElementById("palete").innerHTML;
      var mywindow = window.open("", "new div", "height=400,width=600");
      mywindow.document.write("<html><head>");
      mywindow.document.write(
        `<style>.palete, .palete th, .palete td, .palete tr{border: 2px solid black;border-collapse:collapse;font-size:20px;text-align:center;} @media print {.paletaMain{page-break-after: always; } .pagebreak {clear: both;page-break-after: always;}}</style>`
      );
      mywindow.document.write("</head><body >");
      mywindow.document.write(print);
      mywindow.document.write("</body></html>");
      mywindow.document.close();
      mywindow.focus();
      setTimeout(function () {
        mywindow.print();
        mywindow.close();
      }, 1000);

      return true;
    },
    isporukaPrint() {},
    printPapirici() {
      let print = document.getElementById("print").innerHTML;
      var mywindow = window.open("", "new div", "height=400,width=600");
      mywindow.document.write("<html><head>");
      mywindow.document.write(
        "<style>.papirici {display: inline;margin: 5px;color: black;border-spacing:0px;border-collapse:collapse;text-align:center;}.papirici tr td {border:3px solid black;height:35px;}#print{background-color: white;text-align: center;}</style>"
      );
      mywindow.document.write("</head><body >");
      mywindow.document.write(print);
      mywindow.document.write("</body></html>");
      mywindow.document.close();
      mywindow.focus();
      setTimeout(function () {
        mywindow.print();
        mywindow.close();
      }, 1000);

      return true;
    },
    add(id) {
      let item = this.nalozi.splice(id, 1);
      this.isporuka.nalozi.push(item[0]);
    },
    addAll() {
      this.isporuka.nalozi.push(...this.nalozi);
      this.nalozi = [];
    },
    remove(id) {
      let item = this.isporuka.nalozi.splice(id, 1);
      this.nalozi.push(item[0]);
    },
    getData() {
      this.$axios({
        method: "GET",
        url: "/api/isporuke/gotovi_nalozi/" + this.kooperant,
      })
        .then((res) => {
          let nalozi = res.data.nalozi;
          nalozi.forEach((el) => {
            el.paleta = 1;
          });
          this.nalozi = nalozi;
          this.isporuka.nalozi = [];
        })
        .catch((err) => {
          this.responseErrors = err.response;
        });
    },
    postRequest() {
      let narudzbe = {};
      this.isporuka.nalozi.forEach((el) => {
        if (!(el.narudzba_id in narudzbe)) {
          narudzbe[el.narudzba_id] = [];
        }
        narudzbe[el.narudzba_id].push(el);
      });
      let isporuka = {
        datum_isporuke: this.isporuka.datum_isporuke,
        narudzbe: narudzbe,
      };
      this.disabled = true;
      this.$axios({
        method: "POST",
        url: "/api/isporuke/store",
        data: isporuka,
      })
        .then(() => {
          window.location.href = "/isporuke/pregled";
        })
        .catch((err) => {
          this.$vs.notify({
            title: `Isporuka nije kreirana`,
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
    this.$store.dispatch("getCooperants");
  },
};
</script>
