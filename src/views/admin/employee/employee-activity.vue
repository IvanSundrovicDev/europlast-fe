<template>
  <div>
    <Errors
      :response-errors="responseErrors"
      v-if="responseErrors !== null"
    ></Errors>
    <vs-button v-on:click="$router.go(-1)">Natrag</vs-button>

    <div style="margin-top: 10px">
      <vs-table data="zaposlenici">
        <template slot="thead">
          <vs-th>Narudzba</vs-th>
          <vs-th>Nalog</vs-th>
          <vs-th>Operacija</vs-th>
          <vs-th>Zapoceto</vs-th>
          <vs-th>Zavrseno</vs-th>
          <vs-th>Vrijeme rada</vs-th>
          <vs-th>Komada</vs-th>
        </template>

        <template>
          <vs-tr v-for="(zaposlenik, index) in zaposlenici" :key="index">
            <vs-td
              ><a :href="'/narudzbe/pregled/' + zaposlenik.nalog.narudzba.id">{{
                zaposlenik.nalog.narudzba.broj_narudzbe
              }}</a></vs-td
            >
            <vs-td
              ><a :href="'/nalozi/pregled/' + zaposlenik.nalog.id">{{
                zaposlenik.nalog.kor_racun
              }}</a></vs-td
            >
            <vs-td>{{ zaposlenik.operacija.naziv_operacije }}</vs-td>
            <vs-td>{{ zaposlenik.zapoceto }}</vs-td>
            <vs-td>{{ zaposlenik.zavrseno }}</vs-td>
            <vs-td>{{
              getTime(zaposlenik.zapoceto, zaposlenik.zavrseno)
            }}</vs-td>
            <vs-td>{{ zaposlenik.komada }}</vs-td>
          </vs-tr>
        </template>
      </vs-table>
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
      zaposlenici: [],
      responseErrors: null,
    };
  },
  methods: {
    getActivity() {
      this.$axios
        .get(
          "/api/zaposlenici/radnje/" +
            this.$route.params.id
        )
        .then((res) => {
          this.zaposlenici = res.data;
        })
        .catch((err) => {
          this.responseErrors = err.response;
        });
    },
    getTime(zapoceto, zavrseno) {
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
    },
  },
  beforeMount() {
    this.getActivity();
  },
};
</script>
