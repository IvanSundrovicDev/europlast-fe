<template>
  <div>
    <Errors
      :response-errors="responseErrors"
      v-if="responseErrors !== null"
    ></Errors>
    <h2 class="style-title">
      <span v-on:click="toggleIznoseAction">Kalendar</span>
    </h2>
    <div class="order-search w-full">
      <div class="vx-row mb-6 order-search-el">
        <div class="vx-col w-full">
          <vs-select
            class="w-full"
            label="Godina"
            v-on:input="getData()"
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
      <div class="vx-row mb-6 order-search-el" v-if="year">
        <div class="vx-col w-full">
          <vs-select
            class="w-full"
            label="Mjesec"
            v-on:input="getData()"
            v-model="month"
          >
            <vs-select-item key="1" value="1" text="Siječanj" />
            <vs-select-item key="2" value="2" text="Veljača" />
            <vs-select-item key="3" value="3" text="Ožujak" />
            <vs-select-item key="4" value="4" text="Travanj" />
            <vs-select-item key="5" value="5" text="Svibanj" />
            <vs-select-item key="6" value="6" text="Lipanj" />
            <vs-select-item key="7" value="7" text="Srpanj" />
            <vs-select-item key="8" value="8" text="Kolovoz" />
            <vs-select-item key="9" value="9" text="Rujan" />
            <vs-select-item key="10" value="10" text="Listopad" />
            <vs-select-item key="11" value="11" text="Studeni" />
            <vs-select-item key="12" value="12" text="Prosinac" />
          </vs-select>
        </div>
      </div>
      <div class="vx-row mb-6 order-search-el" v-if="month">
        <div class="vx-col w-full">
          <vs-select
            class="w-full"
            label="Rade"
            v-on:input="getData()"
            v-model="rade"
          >
            <vs-select-item key="0" value="svi" text="Svi" />
            <vs-select-item key="1" value="tokari" text="Tokari" />
            <vs-select-item key="2" value="glodaci" text="Glodači" />
          </vs-select>
        </div>
      </div>
      <div class="vx-row mb-6 order-search-el" v-if="month">
        <div class="vx-col w-full">
          <vs-select
            class="w-full"
            label="Kooperant"
            v-on:change="filterData()"
            v-model="kooperant"
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
    <div class="w-full" style="display: inline-block">
      <p style="display: inline-block; float: left; margin-right: 10px">
        Legenda:
      </p>
      <vs-chip color="#ecf206" style="color: black"> Rezanje </vs-chip>
      <vs-chip color="#e67716" style="color: black"> Tokarenje </vs-chip>
      <vs-chip color="#7e71e6" style="color: black"> Glodanje </vs-chip>
      <vs-chip color="#d1f56f" style="color: black"> Bravarski rad </vs-chip>
      <vs-chip color="#06f2e9" style="color: black">
        Površinska obrada
      </vs-chip>
      <vs-chip color="red" style="color: black"> Reklamacija </vs-chip>
      <vs-chip color="#1eca05" style="color: black"> Završeno </vs-chip>
      <vs-chip color="#9A9A9A" style="color: black"> Materijal stigao </vs-chip>
    </div>
    <br /><br />
    <vs-button class="mr-3 mb-2" v-if="data" v-on:click="print()"
      >Ispis</vs-button
    >
    <p
      v-if="(naruceniIznosEur ) && toggleIznose"
      style="display: inline"
    >
      Ukupno naručeni iznos:
      <span v-if="naruceniIznosEur">{{
        naruceniIznosEur.toLocaleString("de-DE", {
          style: "currency",
          currency: "EUR",
        })
      }}</span>
      <span v-else style="color: red"> 0 € </span>
    </p>
    <div id="printKalendar">
      <div class="order-table">
        <vs-table
          v-for="(value, name) in filteredItems"
          data="users"
          :hoverFlat="true"
          :key="name"
        >
          <template slot="thead">
            <vs-th colspan="2">{{ `${name}.${month}.${year}` }}</vs-th>
          </template>

          <template>
            <vs-tr
              v-for="item in value"
              :key="item.id"
              v-bind:style="[
                item.boja
                  ? { 'background-color': item.boja }
                  : { 'background-color': 'white' },
              ]"
            >
              <vs-td
                class="custom-table-data main-table-data"
                v-if="item.nalog_id"
                style="width: 100px"
              >
                <a :href="'/narudzbe/pregled/' + item.nalog.narudzba.id">{{
                  item.nalog.narudzba.broj_narudzbe
                }}</a>
                <a :href="'/nalozi/pregled/' + item.id">{{
                  item.nalog.kor_racun
                }}</a>
                <a
                  target="_blank"
                  :href="`/storage/pozicije/${item.nalog.pozicija.id}/nacrt/${item.nalog.pozicija.file_name}`"
                  >{{ item.nalog.pozicija.broj_nacrta }}</a
                >
                <p>{{ item.nalog.pozicija.naziv }}</p>
              </vs-td>
              <vs-td class="custom-table-data center" v-if="item.nalog_id"
                ><p>{{ item.komada }}</p></vs-td
              >

              <vs-td
                class="custom-table-data main-table-data"
                v-if="item.pozicija_id"
                style="width: 100px"
              >
                <a :href="'/narudzbe/pregled/' + item.narudzba.id">{{
                  item.narudzba.broj_narudzbe
                }}</a>
                <a :href="'/nalozi/pregled/' + item.id">{{ item.kor_racun }}</a>
                <a
                  target="_blank"
                  :href="`/storage/pozicije/${item.pozicija.id}/nacrt/${item.pozicija.file_name}`"
                  >{{ item.pozicija.broj_nacrta }}</a
                >
                <p>{{ item.pozicija.naziv }}</p>
              </vs-td>
              <vs-td class="custom-table-data center" v-if="item.pozicija_id"
                ><p>{{ item.komada }}</p></vs-td
              >
            </vs-tr>
          </template>
        </vs-table>
      </div>
    </div>
  </div>
</template>

<script>
import Errors from "../../components/common/Errors";

export default {
  components: {
    Errors,
  },
  data() {
    return {
      data: {},
      filteredItems: {},
      rade: "svi",
      year: "",
      month: "",
      kooperant: "svi",
      godine: [],
      responseErrors: null,
      naruceniIznosEur: "",
      toggleIznose: false,
    };
  },
  computed: {
    cooperants() {
      return this.$store.state.cooperants;
    },
  },
  methods: {
    toggleIznoseAction() {
      if (this.$user.role === "administrator") {
        this.toggleIznose = this.toggleIznose === false;
      } else {
        this.toggleIznose = false;
      }
    },
    getYears() {
      let date = new Date();
      let month = date.getMonth();
      let year = date.getFullYear();
      this.$axios({
        method: "GET",
        url: "/api/get_years/kalendar",
      })
        .then((res) => {
          this.godine = res.data;
          this.year = year;
          this.month = month + 1;
          this.getData();
        })
        .catch((err) => {
          this.responseErrors = err.response;
        });
    },
    print() {
      let print = document.getElementById("printKalendar").innerHTML;
      var mywindow = window.open("", "new div", "height=400,width=600");
      mywindow.document.write("<html><head>");
      mywindow.document.write(
        "<style>.order-table{display:flex}.vs-table--tbody-table{min-width: 150px !important;}vs-con-table{margin-right: 5px !important;}.vs-con-table .vs-con-tbody{overflow: initial;margin: 5px;}.custom-table-data{border: 2px solid black !important;color: black;}.custom-table-data span{display: inline-grid;}.custom-table-data a{margin:2px; text-decoration:none; color: black;display: inline;font-size: 12px;font-weight: 500;}.custom-table-data p{margin: 2px;color: black;font-size: 12px;font-weight: 500;}</style>"
      );
      mywindow.document.write("</head><body >");
      mywindow.document.write(print);
      mywindow.document.write("</body></html>");
      mywindow.document.close();
      mywindow.focus();
      //setTimeout(function(){mywindow.print(); mywindow.close();},1000);

      return true;
    },
    filterData() {
      if (this.kooperant === "svi") {
        this.filteredItems = this.data;
      } else {
        let filteredData = {};
        for (const datum in this.data) {
          let datumArray = this.data[datum].filter(
            (item) => item.narudzba.kooperant.id === Number(this.kooperant)
          );
          if (datumArray.length) {
            filteredData[datum] = datumArray;
          }
        }
        this.filteredItems = filteredData;
      }
    },
    getData() {
      this.$axios({
        method: "GET",
        url: `/api/kalendar/${this.year}/${this.month}/${this.rade}`,
      })
        .then((res) => {
          this.data = res.data;
          this.filteredItems = res.data;
          this.kooperant = "svi";
          this.calculateSumForMonth();
        })
        .catch((err) => {
          this.responseErrors = err.response;
        });
    },
    calculateSumForMonth() {
      let sumEur = 0;
      let nalozi = this.data;
      for (const value of Object.entries(nalozi)) {
        if (value[1].length) {
          value[1].forEach(function (el) {
            if (el.stavke !== undefined) {
              el.stavke.forEach(function (stavka) {
                if (stavka.ukupno !== "NaN") {
                  sumEur = sumEur + parseFloat(stavka.ukupno);
                }
              });
            }
          });
        }
      }
      this.naruceniIznosEur = sumEur;
    },
  },
  beforeMount() {
    this.getYears();
    this.$store.dispatch("getCooperants");
  },
};
</script>
