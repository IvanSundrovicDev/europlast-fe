<template>
  <div class="max-width-500">
    <Errors
      :response-errors="responseErrors"
      v-if="responseErrors !== null"
    ></Errors>
    <h2 class="style-title">Dodavanje stroja</h2>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          v-model="stroj.naziv"
          class="w-full"
          type="text"
          label="Naziv stroja"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-select class="w-full" label="Vrsta stroja" v-model="stroj.tip">
          <vs-select-item key="item" value="Tokarilica" text="Tokarilica" />
          <vs-select-item key="item2" value="Glodalica" text="Glodalica" />
          <vs-select-item key="item3" value="Pila" text="Pila" />
          <vs-select-item key="item4" value="Brusilica" text="Brusilica" />
        </vs-select>
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-textarea
          class="w-full"
          v-model="stroj.napomena"
          type="custom"
          label="Napomena"
        />
      </div>
    </div>
    <div class="vx-row">
      <div class="vx-col w-full">
        <vs-button
          class="mr-3 mb-2"
          :disabled="disabled"
          v-on:click="uploadMachine()"
          >Spremi</vs-button
        >
      </div>
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
      stroj: {
        naziv: "",
        tip: "",
        napomena: "",
      },
      disabled: false,
      backgroundLoading: "primary",
      colorLoading: "#fff",
      responseErrors: null,
    };
  },
  methods: {
    uploadMachine() {
      this.disabled = true;
      this.$axios({
        method: "POST",
        url: "/api/strojevi/store",
        data: this.stroj
      })
        .then(() => {
          window.location.href = "/strojevi/pregled";
        })
        .catch((err) => {
          this.disabled = false;
          this.responseErrors = err.response;
        });
    },
  }
};
</script>
