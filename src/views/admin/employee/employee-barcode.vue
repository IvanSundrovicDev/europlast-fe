<template>
  <div>
    <Errors
      :response-errors="responseErrors"
      v-if="responseErrors !== null"
    ></Errors>
    <h2>Barkodovi zaposlenika</h2>
    <br />
    <vs-button class="mr-3 mb-2" v-if="zaposlenici" v-on:click="print()"
      >Ispis</vs-button
    >
    <div id="zaposlenici" class="barcode-overflow">
      <div
        class="center barcode-display"
        v-for="zaposlenik in zaposlenici"
        :key="zaposlenik.id"
      >
        <div class="barcode center">
          <h3 class="barcode-title">
            {{ zaposlenik.ime }} {{ zaposlenik.prezime }}
          </h3>
          <VueBarcode
            displayValue="false"
            heigth="100"
            width="4"
            format="code128"
            :value="zaposlenik.barkod"
          ></VueBarcode>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueBarcode from "vue-barcode";

export default {
  data() {
    return {
      zaposlenici: [],
      responseErrors: null,
    };
  },
  components: {
    VueBarcode,
  },
  methods: {
    print() {
      let print = document.getElementById("zaposlenici").innerHTML;
      var mywindow = window.open("", "new div", "height=400,width=600");
      mywindow.document.write("<html><head>");
      mywindow.document.write(
        "<style>.barcode{width: 400px; margin: 30px 0 20px;padding: 10px 0 5px;border-radius: 7px;background: white;border: 5px solid black;}.barcode-title{font-weight: bold;color: black !important;margin: 10px;}.center{text-align: center;display: inline-block;margin: 10px;}</style>"
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
    getData() {
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
  },
  beforeMount() {
    this.getData();
  },
};
</script>
