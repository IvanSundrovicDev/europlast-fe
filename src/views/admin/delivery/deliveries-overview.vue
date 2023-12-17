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
      <vs-tab label="ISPORUKA">
        <h2 class="style-title mt-2">Pregled isporuka</h2>
        <small class="flex mb-2"
          ><vs-icon class="my-auto mr-2" icon="info" color="success"></vs-icon>
          Odaberite godinu i mjesec za pregled isporuka i preuzimanje
          dokumenata</small
        >
        <small class="flex"
          ><vs-icon class="my-auto mr-2" icon="info" color="success"></vs-icon>
          Odaberite dan za završavanje isporuka (kreiranje dokumenata) i ispis
          isporuke za dan</small
        >
        <div class="order-search w-full">
          <div class="vx-row mb-6 order-search-el">
            <div class="vx-col w-full">
              <vs-select
                class="w-full"
                label="Godina"
                v-on:input="
                  resetData();
                  getData();
                "
                v-model="year"
              >
                <vs-select-item
                  v-for="godina in godine"
                  :key="godina"
                  :value="godina"
                  :text="godina"
                />
              </vs-select>
            </div>
          </div>
          <div class="vx-row mb-6 order-search-el">
            <div class="vx-col w-full">
              <vs-select
                class="w-full"
                label="Mjesec"
                v-on:input="
                  resetData();
                  getData();
                "
                v-model="month"
                :disabled="!year"
              >
                <vs-select-item key="1" value="01" text="Siječanj" />
                <vs-select-item key="2" value="02" text="Veljača" />
                <vs-select-item key="3" value="03" text="Ožujak" />
                <vs-select-item key="4" value="04" text="Travanj" />
                <vs-select-item key="5" value="05" text="Svibanj" />
                <vs-select-item key="6" value="06" text="Lipanj" />
                <vs-select-item key="7" value="07" text="Srpanj" />
                <vs-select-item key="8" value="08" text="Kolovoz" />
                <vs-select-item key="9" value="09" text="Rujan" />
                <vs-select-item key="10" value="10" text="Listopad" />
                <vs-select-item key="11" value="11" text="Studeni" />
                <vs-select-item key="12" value="12" text="Prosinac" />
              </vs-select>
            </div>
          </div>
          <div class="vx-row mb-6 order-search-el">
            <div class="vx-col w-full">
              <vs-select
                class="w-full"
                label="Dan (za ispis)"
                v-on:input="
                  resetData();
                  getData();
                "
                :disabled="!month"
                v-model="day"
              >
                <vs-select-item key="1" value="01" text="01" />
                <vs-select-item key="2" value="02" text="02" />
                <vs-select-item key="3" value="03" text="03" />
                <vs-select-item key="4" value="04" text="04" />
                <vs-select-item key="5" value="05" text="05" />
                <vs-select-item key="6" value="06" text="06" />
                <vs-select-item key="7" value="07" text="07" />
                <vs-select-item key="8" value="08" text="08" />
                <vs-select-item key="9" value="09" text="09" />
                <vs-select-item key="10" value="10" text="10" />
                <vs-select-item key="11" value="11" text="11" />
                <vs-select-item key="12" value="12" text="12" />
                <vs-select-item key="13" value="13" text="13" />
                <vs-select-item key="14" value="14" text="14" />
                <vs-select-item key="15" value="15" text="15" />
                <vs-select-item key="16" value="16" text="16" />
                <vs-select-item key="17" value="17" text="17" />
                <vs-select-item key="18" value="18" text="18" />
                <vs-select-item key="19" value="19" text="19" />
                <vs-select-item key="20" value="20" text="20" />
                <vs-select-item key="21" value="21" text="21" />
                <vs-select-item key="22" value="22" text="22" />
                <vs-select-item key="23" value="23" text="23" />
                <vs-select-item key="24" value="24" text="24" />
                <vs-select-item key="25" value="25" text="25" />
                <vs-select-item key="26" value="26" text="26" />
                <vs-select-item key="27" value="27" text="27" />
                <vs-select-item key="28" value="28" text="28" />
                <vs-select-item key="29" value="29" text="29" />
                <vs-select-item key="30" value="30" text="30" />
                <vs-select-item key="31" value="31" text="31" />
              </vs-select>
            </div>
          </div>
          <div class="vx-row mb-6 order-search-el">
            <div class="vx-col w-full">
              <vs-select
                class="w-full"
                label="Kooperant"
                v-on:input="
                  resetData();
                  getData();
                "
                v-model="kooperant"
                :disabled="!year"
              >
                <vs-select-item key="0" value="svi" text="Svi" />
                <vs-select-item
                  v-for="kooperant in cooperants"
                  :key="kooperant.id"
                  :value="kooperant.id"
                  :text="`${kooperant.naziv} (${kooperant.jezik}/${kooperant.valuta})`"
                />
              </vs-select>
            </div>
          </div>
        </div>
        <div class="w-full" v-if="day && isporuke">
          <vs-button class="mr-5 mb-2" v-on:click="printSvih"
            >Print Svih</vs-button
          >
          <vs-button color="success" v-on:click="downloadOtpremnice"
            >Download otpremnica</vs-button
          >
          <span v-if="loading" class="ml-2">Pričekajte trenutak...</span>
        </div>
        <vs-table data="users" class="mt-5">
          <template slot="thead">
            <vs-th>Datum isporuke</vs-th>
            <vs-th>Broj otpremnice</vs-th>
            <vs-th>Broj računa</vs-th>
            <vs-th>Iznos</vs-th>
            <vs-th>Opcije</vs-th>
          </template>
          <template>
            <vs-tr v-for="(isporuka, index) in isporuke" :key="isporuka.id">
              <vs-td>{{ handleDateTime(isporuka.datum_isporuke) }}</vs-td>
              <vs-td>{{ isporuka.broj_otpremnice }}</vs-td>
              <vs-td>{{ isporuka.broj_racuna }}</vs-td>
              <vs-td>{{ isporuka.ukupno }}</vs-td>
              <vs-td v-if="isporuka.racun && isporuka.otpremnica">
                <vs-button
                  v-on:click.stop="getRacun(isporuka)"
                  class="mr-3 mb-2"
                  >Račun</vs-button
                >
                <vs-button
                  color="success"
                  v-on:click.stop="getOtpremnica(isporuka)"
                  class="mr-3 mb-2"
                  >Otpremnica</vs-button
                >
                <vs-button
                  v-on:click.stop="deleteIsporuka(isporuka)"
                  color="danger"
                  class="mr-3 mb-2"
                  >Storniraj</vs-button
                >
                <vs-button
                  v-if="validKooperant(isporuka)"
                  v-on:click.stop="posaljiRacunEmailom(isporuka)"
                  color="warning"
                >
                  <feather-icon icon="MailIcon" svgClasses="h-4 w-4" />
                </vs-button>
              </vs-td>
              <vs-td v-else>
                <div class="flex">
                  <p class="mr-4 my-auto">Nema dostupnih radnji</p>
                  <vs-button
                    v-on:click.stop="deleteIsporuka(isporuka)"
                    color="danger"
                    class="mr-3 mb-2"
                    >Storniraj</vs-button
                  >
                </div>
              </vs-td>
              <template
                class="expand-user"
                slot="expand"
                style="display: block !important"
              >
                <vs-table :id="index" data="users" style="width: 100%">
                  <template slot="thead">
                    <vs-th>Broj narudžbe</vs-th>
                    <vs-th>Korisnički račun</vs-th>
                    <vs-th>Naziv pozicije</vs-th>
                    <vs-th>Broj nacrta</vs-th>
                    <vs-th>Datum isporuke</vs-th>
                    <vs-th>Komada</vs-th>
                  </template>

                  <template>
                    <vs-tr v-for="item in isporuka.nalozi" :key="item.id">
                      <vs-td>{{ item.narudzba.broj_narudzbe }}</vs-td>
                      <vs-td>{{ item.kor_racun }}</vs-td>
                      <vs-td>{{ item.pozicija.naziv }}</vs-td>
                      <vs-td>{{ item.pozicija.broj_nacrta }}</vs-td>
                      <vs-td>{{
                        handleDateTime(isporuka.datum_isporuke)
                      }}</vs-td>
                      <vs-td>{{ item.komada }}</vs-td>
                    </vs-tr>
                  </template>
                </vs-table>
              </template>
            </vs-tr>
          </template>
        </vs-table>
      </vs-tab>
      <vs-tab label="NEDOVRŠENE" v-show="day">
        <h2 class="style-title">Pregled nedovršenih isporuka</h2>
        <div class="w-full" v-if="day && nedovrsene.length > 0">
          <vs-button
            class="mr-5 mb-3"
            color="success"
            v-on:click="generirajPdfove"
            :disabled="spremiDisabled"
            >Spremi</vs-button
          >
          <vs-button color="primary" v-on:click="generirajBrojeve"
            >Generiraj</vs-button
          >
          <span v-if="loading" class="ml-2">Pričekajte trenutak...</span>
        </div>
        <vs-table data="users" class="mt-5">
          <template slot="thead">
            <vs-th>Datum isporuke</vs-th>
            <vs-th>Broj otpremnice</vs-th>
            <vs-th>Opcije</vs-th>
            <vs-th>Tecaj</vs-th>
          </template>
          <template v-if="nedovrsene.length > 0">
            <vs-tr v-for="(isporuka, index) in nedovrsene" :key="isporuka.id">
              <vs-td>{{ handleDateTime(isporuka.datum_isporuke) }}</vs-td>
              <vs-td>{{ isporuka.broj_otpremnice }}</vs-td>
              <vs-td v-if="day && nedovrsene.length > 0">
                <div class="flex">
                  <vs-input
                    class="mr-2"
                    v-on:click.stop=""
                    v-model="isporuka.broj_racuna"
                    placeholder="Broj računa"
                    :disabled="index !== 0"
                    style="display: inline-block"
                  ></vs-input>
                  <vs-input
                    v-on:click.stop=""
                    v-model="isporuka.broj_otpremnice"
                    placeholder="Broj otpremnice"
                    :disabled="index !== 0"
                    style="display: inline-block"
                  ></vs-input>
                </div>
              </vs-td>
              <vs-td v-else> Nema dostupnih radnji </vs-td>
              <vs-td
                v-if="isporuka.nalozi[0].narudzba.kooperant.valuta === 'EUR'"
              >
                <vs-input
                  v-on:click.stop=""
                  v-model="isporuka.tecaj"
                  placeholder="Tecaj (format: npr. 7.52)"
                  :disabled="index !== 0"
                  style="display: inline-block"
                ></vs-input>
              </vs-td>
              <template
                class="expand-user"
                slot="expand"
                style="display: block !important"
              >
                <vs-table :id="index" data="users" style="width: 100%">
                  <template slot="thead">
                    <vs-th>Broj narudžbe</vs-th>
                    <vs-th>Korisnički račun</vs-th>
                    <vs-th>Naziv pozicije</vs-th>
                    <vs-th>Broj nacrta</vs-th>
                    <vs-th>Datum isporuke</vs-th>
                    <vs-th>Komada</vs-th>
                  </template>

                  <template>
                    <vs-tr v-for="item in isporuka.nalozi" :key="item.id">
                      <vs-td>{{ item.narudzba.broj_narudzbe }}</vs-td>
                      <vs-td>{{ item.kor_racun }}</vs-td>
                      <vs-td>{{ item.pozicija.naziv }}</vs-td>
                      <vs-td>{{ item.pozicija.broj_nacrta }}</vs-td>
                      <vs-td>{{
                        handleDateTime(isporuka.datum_isporuke)
                      }}</vs-td>
                      <vs-td>{{ item.komada }}</vs-td>
                    </vs-tr>
                  </template>
                </vs-table>
              </template>
            </vs-tr>
          </template>
          <template v-else>
            <vs-tr>
              <vs-td colspan="4" class="text-center"
                >Nema nedovšenih isporuka.</vs-td
              >
            </vs-tr>
          </template>
        </vs-table>
      </vs-tab>
      <vs-tab label="ISPIS" v-show="day && isporukeZaDan.length > 0">
        <div>
          <vs-button class="mr-3 mb-2" v-if="isporuke[0]" v-on:click="print()"
            >Ispis</vs-button
          >
          <div id="stavke">
            <div align="center" class="ispis-stavke">
              <h1>U isporuci</h1>
              <p>{{ `${day}.${month}.${year}` }}</p>
              <table class="palete">
                <tbody>
                  <tr>
                    <th width="75">Kooperant</th>
                    <th width="75">Broj narudžbe</th>
                    <th width="250">Korisnički račun</th>
                    <th width="180">Naziv pozicije</th>
                    <th width="100">Broj nacrta</th>
                    <th width="180">Datum isporuke</th>
                    <th width="150">Komada</th>
                    <th width="180">Otpremnica</th>
                  </tr>
                  <template v-for="isporuka in isporukeZaDan">
                    <tr v-for="(nalog, index) in isporuka.nalozi" :key="index">
                      <td>{{ nalog.narudzba.kooperant.sifra_kooperanta }}</td>
                      <td>{{ nalog.narudzba.broj_narudzbe }}</td>
                      <td>{{ nalog.kor_racun }}</td>
                      <td>{{ nalog.pozicija.naziv }}</td>
                      <td>{{ nalog.pozicija.broj_nacrta }}</td>
                      <td>{{ handleDateTime(isporuka.datum_isporuke) }}</td>
                      <td>{{ nalog.komada }}</td>
                      <td>{{ isporuka.broj_otpremnice }}</td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </vs-tab>
    </vs-tabs>
    <div
      v-infinite-scroll="getData"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="10"
    ></div>
  </div>
</template>


<script>
import Errors from "../../../components/common/Errors";
import Success from "../../../components/common/Success";
import printJS from "print-js";

export default {
  components: {
    Errors,
    Success,
  },
  data() {
    return {
      page: 0,
      lastPage: 1,
      isporuke: [],
      isporukeOrigin: [],
      nedovrsene: [],
      isporukeZaDan: [],
      isporukeZaDanOrigin: [],
      year: "",
      month: "",
      day: "",
      dayIndex: 31,
      godine: [],
      responseErrors: null,
      responseSuccess: null,
      loading: false,
      spremiDisabled: true,
      kooperant: "svi",
    };
  },
  computed: {
    cooperants() {
      return this.$store.state.cooperants;
    },
  },
  methods: {
    resetData() {
      this.page = 0;
      this.lastPage = 1;
      this.isporuke = [];
      this.isporukeOrigin = [];
      this.nedovrsene = [];
      this.isporukeZaDan = [];
      this.isporukeZaDanOrigin = [];
    },
    getData() {
      if (this.page < this.lastPage) {
        if (this.day) {
          this.page++;
          this.sendDay();
        } else {
          this.page++;
          this.sendYMD();
        }
      }
    },
    validKooperant(isporuka) {
      let kooperanti = ["HFB", "Logstor", "INPAL", "IsoHU", "Fintherm"];
      let kooperant = isporuka.nalozi[0].narudzba.kooperant.sifra_kooperanta;
      let brojNarudzbe = isporuka.nalozi[0].narudzba.broj_narudzbe;

      if (kooperanti.includes(kooperant)) {
        if (kooperant === "HFB") {
          if (["450", "480", "950"].includes(brojNarudzbe.substring(0, 3))) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      }
      return false;
    },
    generirajPdfove() {
      this.loading = true;
      this.$axios({
        url: "/api/isporuke/generiraj_racun_otpremnicu",
        method: "POST",
        data: {
          isporuke: this.nedovrsene,
        },
      })
        .then((res) => {
          this.loading = false;
          this.responseSuccess = res.data.message;
          this.sendDay();
        })
        .catch((err) => {
          this.loading = false;
          this.responseErrors = err.response;
        });
    },
    generirajBrojeve() {
      this.$axios({
        url: "/api/isporuke/dohvati_zadnje_brojeve",
        method: "GET",
      }).then((res) => {
        this.spremiDisabled = false;

        let formatRacun;
        let formatOtpremnica;

        if (
          this.nedovrsene[0].broj_racuna &&
          this.nedovrsene[0].broj_otpremnice
        ) {
          formatRacun = this.nedovrsene[0].broj_racuna;
          formatOtpremnica = this.nedovrsene[0].broj_otpremnice;
        } else {
          formatRacun = res.data.racun;
          formatOtpremnica = res.data.otpremnica;
        }

        for (const [_i, isporuka] of this.nedovrsene.entries()) {
          let fractalRacun = formatRacun.split("-");
          let fractalOtpremnica = formatOtpremnica.split("/");

          if (_i === 0) {
            formatOtpremnica =
              fractalOtpremnica[0] + "/" + fractalOtpremnica[1];
            formatRacun = fractalRacun[0] + "-" + fractalRacun[1] + "-1-1";
          } else {
            fractalOtpremnica[0]++;
            formatOtpremnica =
              fractalOtpremnica[0] + "/" + fractalOtpremnica[1];

            fractalRacun[1]++;
            formatRacun = fractalRacun[0] + "-" + fractalRacun[1] + "-1-1";
          }

          isporuka.broj_racuna = formatRacun;
          isporuka.broj_otpremnice = formatOtpremnica;
        }
      });
    },
    printSvih() {
      this.loading = true;
      this.$axios
        .get(
          "/api/isporuke/print_svih_za_dan/" +
            this.year +
            "-" +
            this.month +
            "-" +
            this.day +
            "/" +
            this.kooperant
        )
        .then((res) => {
          this.loading = false;
          printJS("/storage/tmp/" + res.data);
        })
        .catch((err) => {
          this.loading = false;
          this.responseErrors = err.response;
        });
    },
    async downloadOtpremnice() {
      this.loading = true;
      await this.$axios
        .get(
          "/api/isporuke/download_otpremnica_za_dan/" +
            this.year +
            "-" +
            this.month +
            "-" +
            this.day +
            "/" +
            this.kooperant
        )
        .then((res) => {
          this.loading = false;
          const link = document.createElement("a");
          link.href = `/storage/tmp/${res.data}`;
          link.setAttribute("download", `${res.data}`);
          link.click();

          // var fileURL = window.URL.createObjectURL(
          //   new Blob([`/storage/tmp/${res.data}`])
          // );
          // var fileLink = document.createElement("a");
          //
          // fileLink.href = fileURL;
          // fileLink.setAttribute("download", res.data);
          // document.body.appendChild(fileLink);
          //
          // fileLink.click();

          this.$axios({
            url: "/api/isporuke/brisi_tmp_file",
            method: "post",
            data: res.data,
          });
        })
        .catch((err) => {
          this.loading = false;
          this.responseErrors = err.response;
        });
    },
    handleDateTime(item) {
      const date = new Date(item);
      const formattedDate = date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      });
      return formattedDate;
    },
    getRacun(item) {
      window.open(`/storage/isporuke/${item.id}/racuni/${item.racun}`);
    },
    getOtpremnica(item) {
      window.open(`/storage/isporuke/${item.id}/otpremnice/${item.otpremnica}`);
    },
    print() {
      let print = document.getElementById("stavke").innerHTML;
      var mywindow = window.open("", "new div", "height=400,width=600");
      mywindow.document.write("<html><head>");
      mywindow.document.write(
        "<style>.ispis-stavke{padding: 20px;}.ispis-stavke h1{font-weight: 700;}.palete, .palete th, .palete td, .palete tr{border: 2px solid black;border-collapse:collapse;font-size:20px;text-align:center;}.ispis-stavke p {margin: 10px; font-weight:800;}</style>"
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
    deleteIsporuka(isporuka) {
      this.$axios({
        method: "delete",
        url: "/api/isporuke/delete/" + isporuka.id,
      })
        .then((res) => {
          this.responseSuccess = res.data.message;

          // Fix for expanded table rows stay expanded after reload
          const elementsToRemove =
            document.querySelectorAll(".content-tr-expand");
          elementsToRemove.forEach((element) => {
            element.remove();
          });
          if (this.day) {
            this.sendDay();
          } else if (this.month) {
            this.sendYMD();
          }
        })
        .catch((err) => {
          this.responseErrors = err.response;
        });
    },
    posaljiRacunEmailom(isporuka) {
      this.$axios({
        method: "post",
        url: "/api/isporuke/sendInvoiceViaEmail/" + isporuka.id,
        data: {
          isporuka: isporuka,
        },
      })
        .then((res) => {
          this.responseSuccess = res.data.message;
        })
        .catch((err) => {
          this.reponseErrors = err.response;
        });
    },
    getYears() {
      this.$axios({
        method: "GET",
        url: "/api/get_years/isporuke",
      })
        .then((res) => {
          this.godine = res.data;
        })
        .catch((err) => {
          this.responseErrors = err.response;
        });
    },
    sendYMD() {
      if (this.year) {
        const url = this.month
          ? `/api/isporuke/index/${this.kooperant}/${this.year}/${this.month}?page=${this.page}`
          : `/api/isporuke/index/${this.kooperant}/${this.year}?page=${this.page}`;
        this.$axios({
          method: "GET",
          url: url,
        })
          .then((res) => {
            this.isporuke = this.isporuke.concat(res.data.data);
            this.isporukeOrigin = this.isporukeOrigin.concat(res.data.data);
            this.lastPage = res.data.last_page;
            this.page = res.data.current_page;
          })
          .catch((err) => {
            this.responseErrors = err.response;
          });
      }
    },
    sendDay() {
      this.$axios({
        method: "GET",
        url: `/api/isporuke/index/${this.kooperant}/${this.year}/${this.month}/${this.day}?page=${this.page}`,
      })
        .then((res) => {
          this.isporukeZaDan = this.isporukeZaDan.concat(res.data.data);
          this.isporukeZaDanOrigin = this.isporukeZaDanOrigin.concat(res.data.data);
          this.isporuke = this.isporuke.concat(res.data.data);
          this.isporukeOrigin = this.isporukeOrigin.concat(res.data.data);
          this.lastPage = res.data.last_page;
          this.page = res.data.current_page;
          for (const [_i, isporuka] of res.data.data.entries()) {
            if (!isporuka.broj_racuna) {
              this.nedovrsene.push(isporuka);
            }
          }
        })
        .catch((err) => {
          this.responseErrors = err.response;
        });
    },
    edit(id) {
      window.location.href = "/zaposlenici/uredi/" + id;
    },
  },
  beforeMount() {
    this.getYears();
    this.$store.dispatch("getCooperants");
  },
};
</script>
