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
    <vs-tabs>
      <vs-tab label="NALOG" v-if="nalog.status !== 'isporuceno'">
        <div class="max-width-500">
          <h2 class="style-title float-left">Uredi nalog</h2>
          <vs-button v-on:click="view()" class="ml-6 mb-6 px-4 py-2"
            >Otvori PDF</vs-button
          >
          <div class="vx-row mb-6">
            <div class="vx-col w-full">
              <vs-input
                class="w-full"
                v-model="nalog.kor_racun"
                type="text"
                label="Korisnički račun"
              />
            </div>
          </div>

          <div class="vx-row mb-6">
            <div class="vx-col w-full">
              <vs-input
                class="w-full"
                v-model="nalog.broj_nacrta"
                type="text"
                disabled
                label="Broj nacrta"
              />
            </div>
          </div>

          <div class="vx-row mb-6" v-if="nalog.materijal">
            <div class="vx-col w-full">
              <vs-input
                class="w-full"
                v-model="nalog.materijal.naziv"
                type="text"
                disabled
                label="Naziv materijala"
              />
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
                v-if="nalog.materijal"
                v-model="nalog.materijal.sifra_materijala"
                disabled
                type="text"
                label="Šifra materijala pozicije"
              />
              <vs-input
                class="w-full"
                v-else
                disabled
                type="text"
                label="Šifra materijala pozicije"
                value="- Nema povezanog materijala -"
              />
            </div>
          </div>

          <div class="operacije">
            <p class="operacije-title">Operacije</p>
            <div
              v-for="(item, index) in this.allOperacije"
              class="vx-row mb-6"
              :key="index"
            >
              <div class="vx-col w-full">
                <vs-checkbox v-model="item.active">{{
                  item.naziv_operacije
                }}</vs-checkbox>
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
              <vs-select class="w-full" v-model="editStatus" label="Status">
                <vs-select-item key="1" value="isporuceno" text="Isporučeno" />
                <vs-select-item key="2" value="kreirano" text="Kreirano" />
                <vs-select-item key="3" value="zavrseno" text="Završeno" />
                <vs-select-item
                  key="4"
                  value="materijal_stigao"
                  text="Materijal stigao"
                />
                <vs-select-item
                  v-for="item in nalog.operacije"
                  :key="item.operacija_id"
                  :value="item.operacija_id"
                  :text="item.operacija.radnja + ' - ' + item.operacija.naziv_operacije"
                />
              </vs-select>
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
                    v-if="nalog.pozicija.cijena_po_kom"
                    key="cijena0"
                    :value="`${nalog.pozicija.cijena_po_kom}/kom`"
                    :text="`${nalog.pozicija.cijena_po_kom}/kom`"
                  />
                  <vs-select-item
                    v-if="nalog.pozicija.cijena_po_kom_2"
                    key="cijena1"
                    :value="`${nalog.pozicija.cijena_po_kom_2}/kom`"
                    :text="`${nalog.pozicija.cijena_po_kom_2}/kom`"
                  />
                  <vs-select-item
                    v-if="nalog.pozicija.cijena_po_kom_3"
                    key="cijena2"
                    :value="`${nalog.pozicija.cijena_po_kom_3}/kom`"
                    :text="`${nalog.pozicija.cijena_po_kom_3}/kom`"
                  />
                  <vs-select-item
                    v-if="nalog.pozicija.cijena_po_kom_4"
                    key="3"
                    :value="`${nalog.pozicija.cijena_po_kom_4}/kom`"
                    :text="`${nalog.pozicija.cijena_po_kom_4}/kom`"
                  />
                  <vs-select-item
                    v-if="nalog.pozicija.cijena_po_kom_5"
                    key="cijena4"
                    :value="`${nalog.pozicija.cijena_po_kom_5}/kom`"
                    :text="`${nalog.pozicija.cijena_po_kom_5}/kom`"
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
                  type="number"
                  label="Potrebna količina"
                />
              </div>
            </div>
            <div class="vx-row mb-6">
              <div class="vx-col w-full">
                <vs-input
                  class="w-full"
                  v-model="nalog.stavke[index].ukupno"
                  type="string"
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
              <vs-button
                color="warning"
                v-on:click="addItem()"
                class="mr-3 mb-2"
                >Dodaj stavku</vs-button
              >
            </div>
          </div>
        </div>
      </vs-tab>
      <vs-tab label="RADNJE">
        <vs-table data="users">
          <template slot="thead">
            <vs-th>Zaposlenik</vs-th>
            <vs-th>Stroj</vs-th>
            <vs-th>Operacija</vs-th>
            <vs-th>Započeto</vs-th>
            <vs-th>Završeno</vs-th>
            <vs-th>Komada</vs-th>
            <vs-th>Vrijeme rada</vs-th>
            <vs-th v-if="nalog.status !== 'isporuceno'">Opcije</vs-th>
          </template>

          <template>
            <vs-tr v-for="(radnja, index) in nalog.radnje" :key="radnja.id">
              <vs-td style="min-width: 130px">
                <div class="vx-row mb-6">
                  <div class="vx-col w-full">
                    <vs-select
                      class="w-full"
                      v-model="radnja.zaposlenik.id"
                      label="Zaposlenik"
                      :disabled="nalog.status === 'isporuceno'"
                    >
                      <vs-select-item
                        v-for="zaposlenik in zaposlenici"
                        :key="zaposlenik.id"
                        :value="zaposlenik.id"
                        :text="`${zaposlenik.ime} ${zaposlenik.prezime}`"
                      />
                    </vs-select>
                  </div>
                </div>
              </vs-td>
              <vs-td style="min-width: 130px">
                <div class="vx-row mb-6">
                  <div class="vx-col w-full">
                    <vs-select
                      class="w-full"
                      v-model="radnja.stroj.id"
                      label="Stroj"
                      :disabled="nalog.status === 'isporuceno'"
                    >
                      <vs-select-item
                        v-for="stroj in strojevi"
                        :key="stroj.id"
                        :value="stroj.id"
                        :text="stroj.naziv"
                      />
                    </vs-select>
                  </div>
                </div>
              </vs-td>
              <vs-td style="min-width: 130px">
                <div class="vx-row mb-6">
                  <div class="vx-col w-full">
                    <vs-select
                      class="w-full"
                      v-model="radnja.operacija_id"
                      label="Operacija"
                      :disabled="nalog.status === 'isporuceno'"
                    >
                      <vs-select-item
                        v-for="operacija in editOperacije"
                        :key="operacija.operacija_id"
                        :value="operacija.operacija_id"
                        :text="operacija.operacija.naziv_operacije"
                      />
                    </vs-select>
                  </div>
                </div>
              </vs-td>
              <vs-td style="min-width: 130px">
                <div class="vx-row mb-6">
                  <div class="vx-col w-full">
                    <vs-input
                      class="w-full"
                      v-model="radnja.zapoceto"
                      type="text"
                      label="Započeto"
                      :disabled="nalog.status === 'isporuceno'"
                    />
                  </div>
                </div>
              </vs-td>
              <vs-td style="min-width: 130px">
                <div class="vx-row mb-6">
                  <div class="vx-col w-full">
                    <vs-input
                      class="w-full"
                      v-model="radnja.zavrseno"
                      type="text"
                      label="Završeno"
                      :disabled="nalog.status === 'isporuceno'"
                    />
                  </div>
                </div>
              </vs-td>
              <vs-td style="min-width: 130px">
                <div class="vx-row mb-6">
                  <div class="vx-col w-full">
                    <vs-input
                      class="w-full"
                      v-model="radnja.komada"
                      type="text"
                      label="Komada"
                      :disabled="nalog.status === 'isporuceno'"
                    />
                  </div>
                </div>
              </vs-td>
              <vs-td>{{ getTime(radnja.zapoceto, radnja.zavrseno) }}</vs-td>
              <vs-td
                style="min-width: 130px"
                v-if="nalog.status !== 'isporuceno'"
              >
                <div class="vx-row">
                  <div class="vx-col w-full order-buttons">
                    <vs-button
                      class="mr-3 mb-2"
                      :disabled="disabled"
                      v-on:click="postRadnja(radnja.id, index)"
                      >Spremi</vs-button
                    >
                  </div>
                </div>
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </vs-tab>
    </vs-tabs>
  </div>
</template>


<script>
import Vue from "vue";
import Datepicker from "vuejs-datepicker";
import { hr } from "vuejs-datepicker/dist/locale";
import Errors from "../../../components/common/Errors";
import Success from "../../../components/common/Success";

import { XIcon } from "vue-feather-icons";

export default {
  data() {
    return {
      nalog: {
        radnje: [],
        operacije: [],
        pozicija: [],
        materijal: [],
        status: "isporuceno",
        broj_nacrta: "",
        stavke: [],
        items: 0,
      },
      editStatus: null,
      nacrt: {
        suggestItems: [],
        oldValue: null,
        openSuggest: false,
      },
      disabled: false,
      baseItems: [],
      strojevi: [],
      zaposlenici: [],
      check: false,
      popupActive: false,
      editOperacije: [],
      hr: hr,
      responseErrors: null,
      responseSuccess: null,
      allOperacije: [],
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
    addItem() {
      this.nalog.items = this.nalog.items + 1;
      let brojStavke = this.nalog.items * 10;
      let value = ("000" + brojStavke).slice(-4);

      this.nalog.stavke.push({
        ukupno: "",
        kolicina: "",
        broj_stavke: value,
        ukupnaCijena: "",
        cijena: "",
        jed_mjere: "",
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
    setJedMjere(cijena) {
      if (cijena === "0.24" || cijena === "0.32" || cijena === "0.53") {
        return "min";
      } else if (cijena === "0.23") {
        return "kg";
      } else if (
        cijena === "14.60" ||
        cijena === "19.11" ||
        cijena === "31.85" ||
        cijena === "15.50"
      ) {
        return "sat";
      } else {
        return "kom";
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
    getData() {
      this.$axios({
        method: "GET",
        url: "/api/nalozi/show/" + this.$route.params.id,
      })
        .then((res) => {
          this.allOperacije = res.data.nalog.pozicija.operacije.map((el) => {
            const isActive = res.data.nalog.operacije.some((item) => item.operacija_id === el.id);
            return { ...el, active: isActive };
          });
          this.nalog = res.data.nalog;
          this.editOperacije = res.data.nalog.operacije;
          this.editOperacije.forEach((el) => {
            el.operacija.active = true;
          });
          if (res.data.nalog.aktivna_operacija) {
            const aktivna_operacija = res.data.nalog.operacije.find((el) => el.operacija_id === res.data.nalog.aktivna_operacija);
            this.editStatus = aktivna_operacija.operacija_id;
          }
          else {
            this.editStatus = res.data.nalog.status;
          }
          this.nalog.broj_nacrta = res.data.nalog.pozicija.broj_nacrta;
          this.nalog.naziv_pozicije = res.data.nalog.pozicija.naziv;
          this.nalog.materijal = res.data.nalog.pozicija.materijal;
          this.nalog.items = res.data.nalog.stavke.length;
          this.nalog.status = res.data.nalog.status;
          this.nalog.stavke.forEach((el) => {
            Vue.set(el, "ukupnaCijena", `${el.cijena}/${el.jed_mjere}`);
          });
        })
        .catch((err) => {
          this.responseErrors = err.response;
        });
    },
    getStrojevi() {
      this.$axios({
        method: "GET",
        url: "/api/strojevi/index",
      })
        .then((res) => {
          this.strojevi = res.data;
        })
        .catch((err) => {
          this.responseErrors = err.response;
        });
    },
    getZaposlenici() {
      this.$axios({
        method: "GET",
        url: "/api/zaposlenici/index",
      })
        .then((res) => {
          this.zaposlenici = res.data;
        })
        .catch((err) => {
          this.responseErrors = err.response;
        });
    },
    getTime(zapoceto, zavrseno) {
      if (zapoceto && zavrseno) {
        let millisec = Math.abs(new Date(zavrseno) - new Date(zapoceto));
        let seconds = (millisec / 1000).toFixed(0);
        let minutes = Math.floor(seconds / 60);
        let hours = "";
        if (minutes > 59) {
          hours = Math.floor(minutes / 60);
          hours = hours >= 10 ? hours : "0" + hours;
          minutes = minutes - hours * 60;
          minutes = minutes >= 10 ? minutes : "0" + minutes;
        }

        seconds = Math.floor(seconds % 60);
        seconds = seconds >= 10 ? seconds : "0" + seconds;
        if (hours != "") {
          return hours + ":" + minutes + ":" + seconds;
        }
        return minutes + ":" + seconds;
      } else {
        return "";
      }
    },
    postRadnja(id, index) {
      this.disabled = true;
      this.$axios({
        method: "PUT",
        url: "/api/nalozi/radnje/" + id,
        data: this.nalog.radnje[index],
      })
        .then((res) => {
          this.responseSuccess = res.data.message;
          this.disabled = false;
          this.getData();
        })
        .catch((err) => {
          this.disabled = false;
          this.responseErrors = err.response;
        });
    },
    view() {
      window.open(`/storage/nalozi/${this.nalog.id}/${this.nalog.filename}`);
    },
    postRequest() {
      this.disabled = true;
      this.nalog.operacije = this.allOperacije
        .filter((el) => el.active)
        .map((el) => {
          return {id: el.id}
        });
      this.nalog.status = this.editStatus;
      this.$axios({
        method: "PUT",
        url: "/api/nalozi/edit/" + this.$route.params.id,
        data: this.nalog,
      })
        .then(() => {
          this.$router.go(-1);
        })
        .catch((err) => {
          this.$vs.notify({
            title: `Nalog ${this.nalog.kor_racun} nije ažuriran`,
            text: "Molimo provjerite greške.",
            position: "bottom-right",
            color: "danger",
          });
          this.disabled = false;
          this.responseErrors = err.response;
        });
    },
    openPopup() {
      this.popupActive = true;
    },
  },
  mounted() {
    this.$store.dispatch("getPrices");
    this.getStrojevi();
    this.getZaposlenici();
    this.getData();
  },
};
</script>
