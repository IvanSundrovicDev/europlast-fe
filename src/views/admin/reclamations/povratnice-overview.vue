<template>
  <div>
    <Errors
      :response-errors="responseErrors"
      v-if="responseErrors !== null"
    ></Errors>
    <h2 class="style-title">Pregled povratnica</h2>
    <br /><br />
    <vs-table data="users">
      <template slot="thead">
        <vs-th>Broj povratnice</vs-th>
        <vs-th>Datum povratnice</vs-th>
        <vs-th>Reklamacije u povratnici</vs-th>
        <vs-th>Preuzimanje</vs-th>
      </template>

      <template>
        <vs-tr v-for="item in povratnice" :key="item.id">
          <vs-td>{{ item.broj_povratnice }}</vs-td>
          <vs-td>{{ handleDateTime(item.created_at) }}</vs-td>
          <vs-td>
            (
            <span v-for="(reklamacija, index) in item.reklamacije" :key="index">
              {{ reklamacija.broj_reklamacije
              }}<span v-if="index + 1 !== item.reklamacije.length"
                >,
              </span></span
            >
            )
          </vs-td>
          <vs-td>
            <vs-button
              color="primary"
              v-on:click="
                print(
                  '/storage/povratnice/' +
                    item.id +
                    '/' +
                    item.povratnica_filename
                )
              "
              >Preuzmi</vs-button
            >
          </vs-td>
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
      print: print,
      povratnice: [],
      responseErrors: null,
    };
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
    getData() {
      this.$axios({
        method: "GET",
        url: "/api/povratnice/index",
      })
        .then((res) => {
          this.povratnice = res.data;
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
