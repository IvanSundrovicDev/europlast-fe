<template>
  <div>
    <Errors
      :response-errors="responseErrors"
      v-if="responseErrors !== null"
    ></Errors>
    <h2>Barkodovi strojeva</h2>
    <br />
    <vs-button class="mr-3 mb-2" v-if="strojevi" v-on:click="print()"
      >Ispis</vs-button
    >
    <div id="strojevi" class="barcode-overflow">
      <div
        class="center barcode-display"
        v-for="stroj in strojevi"
        :key="stroj.id"
      >
        <div class="barcode center">
          <h3 class="barcode-title">{{ stroj.naziv }}</h3>
          <VueBarcode
            displayValue="false"
            heigth="100"
            width="4"
            format="code128"
            :value="stroj.barkod"
          ></VueBarcode>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueBarcode from "vue-barcode";
import Errors from "../../../components/common/Errors";

export default {
  data() {
    return {
      strojevi: [],
      responseErrors: null,
    };
  },
  components: {
    VueBarcode,
    Errors,
  },
  methods: {
    print() {
      let print = document.getElementById("strojevi").innerHTML;
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
        url: "/api/strojevi/index"
      })
        .then((res) => {
          this.strojevi = res.data;
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
