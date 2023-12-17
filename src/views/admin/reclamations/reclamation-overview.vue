<template>
  <div>
    <Errors
      :response-errors="responseErrors"
      v-if="responseErrors !== null"
    ></Errors>
    <h2 class="style-title">Pregled reklamacija</h2>
    <vs-button
      :disabled="zaPovratnice.reklamacije.length < 1"
      v-on:click="requestPovratnice"
      >Izradi povratnicu za odabrane</vs-button
    >
    <br /><br />
    <vs-table data="users">
      <template slot="thead">
        <vs-th>Broj narudžbe</vs-th>
        <vs-th>Naziv</vs-th>
        <vs-th>Korisnički račun</vs-th>
        <vs-th>Datum</vs-th>
        <vs-th>Komada</vs-th>
        <vs-th>Završena</vs-th>
        <vs-th>Akcije</vs-th>
      </template>

      <template>
        <vs-tr v-for="item in reklamacije" :key="item.id">
          <vs-td>{{ item.nalog.narudzba.broj_narudzbe }}</vs-td>
          <vs-td>{{ item.nalog.pozicija.naziv }}</vs-td>
          <vs-td>{{ item.nalog.kor_racun }}</vs-td>
          <vs-td>{{ handleDateTime(item.created_at) }}</vs-td>
          <vs-td>{{ item.komada }}</vs-td>
          <vs-td>
            <vs-checkbox
              :disabled="item.povratnica_id"
              color="success"
              v-model="item.zavrseno"
              v-on:input="toggleZavrseno(item.id, item.zavrseno)"
            ></vs-checkbox>
          </vs-td>
          <vs-td v-if="!item.povratnica_id">
            <vs-checkbox
              v-if="item.zavrseno"
              v-model="zaPovratnice.reklamacije"
              :vs-value="item.id"
              >Povratnica</vs-checkbox
            >
            <vs-button
              v-else
              color="primary"
              v-on:click="
                print(
                  '/storage/reklamacije/' +
                    item.id +
                    '/nalog/' +
                    item.nalog_filename
                )
              "
              >Print Naloga</vs-button
            >
          </vs-td>
          <vs-td v-if="item.povratnica_id"
            >Isporuceno! (
            {{ handleDateTime(item.povratnica.created_at) }} )</vs-td
          >
        </vs-tr>
      </template>
    </vs-table>
  </div>
</template>

<script>
import Errors from "../../../components/common/Errors";
import print from "print-js";

export default {
  components: {
    Errors,
  },
  data() {
    return {
      zaPovratnice: {
        reklamacije: [],
      },
      print: print,
      reklamacije: [],
      responseErrors: null,
    };
  },
  methods: {
    requestPovratnice() {
      this.$axios({
        url: "/api/povratnice/store",
        method: "POST",
        data: this.zaPovratnice,
      })
        .then(() => {
          this.$vs.notify({
            title: `Zahtjev za povratnicom zatražen.`,
            text: "Molimo provjerite popis povratnica.",
            position: "bottom-right",
            color: "success",
          });
          this.getData();
        })
        .catch((err) => {
          this.responseErrors = err.response;
        });
    },
    toggleZavrseno(id, zavrseno) {
      this.$axios
        .get("/api/reklamacije/change_status/" + id + "/" + zavrseno)
        .then(() => {
          this.getData();
          if (zavrseno === true) {
            this.$vs.notify({
              title: `Reklamacija označena završenom`,
              position: "bottom-right",
              color: "success",
            });
          }
        })
        .catch((err) => {
          console.log(err);
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
    getData() {
      this.$axios({
        method: "GET",
        url: "/api/reklamacije/index",
      })
        .then((res) => {
          this.reklamacije = res.data;
        })
        .catch((err) => {
          this.responseErrors = err.response;
        });
    },
  },
  beforeMount() {
    this.getData();
  },
};
</script>
