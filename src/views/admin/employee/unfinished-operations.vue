<template>
  <div>
    <Errors
      :response-errors="responseErrors"
      v-if="responseErrors !== null"
    ></Errors>
    <h2 class="style-title">Nedovršene operacije</h2>
    <vs-table data="users">
      <template slot="thead">
        <vs-th>Zaposlenik</vs-th>
        <vs-th>Narudužba</vs-th>
        <vs-th>Nalog</vs-th>
        <vs-th>Operacija</vs-th>
        <vs-th>Započeto</vs-th>
      </template>

      <template>
        <vs-tr v-for="radnja in radnje" :key="radnja.id">
          <vs-td v-if="radnja.zaposlenik != null">
            {{ radnja.zaposlenik.prezime }} {{ radnja.zaposlenik.ime }}
          </vs-td>
          <vs-td v-else></vs-td>
          <vs-td
            ><a :href="'/narudzbe/pregled/' + radnja.nalog.narudzba.id">{{
              radnja.nalog.narudzba.broj_narudzbe
            }}</a></vs-td
          >
          <vs-td
            ><a :href="'/nalozi/pregled/' + radnja.nalog.id">{{
              radnja.nalog.kor_racun
            }}</a></vs-td
          >
          <vs-td>{{ radnja.operacija.naziv_operacije }}</vs-td>
          <vs-td>{{ radnja.zapoceto }}</vs-td>
        </vs-tr>
      </template>
    </vs-table>
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
      radnje: [],
      responseErrors: null,
    };
  },
  methods: {
    setErrors(err) {
      this.responseErrors = err;
    },
    getData() {
      this.$axios({
        method: "GET",
        url: "/api/zaposlenici/nedovrsene_operacije"
      })
        .then((res) => {
          this.$vs.notify({
            title: `Sve nedovršene operacije dohvaćene`,
            text: "Ukupno nedovršenih operacija: " + Object.keys(res.data).length,
            position: "bottom-right",
            color: "primary",
          });
          this.radnje = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    edit(id) {
      window.location.href = "/zaposlenici/uredi/" + id;
    },
  },
  beforeMount() {
    this.getData();
  },
};
</script>
