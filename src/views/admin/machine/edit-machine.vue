<template>
  <div class="max-width-500">
    <Errors
      :response-errors="responseErrors"
      v-if="responseErrors !== null"
    ></Errors>
    <Success
      :message="responseSuccess"
      v-if="responseSuccess !== null"
    ></Success>
    <h2 class="style-title">Uredi stroj</h2>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          v-model="machine.naziv"
          class="w-full"
          type="text"
          label="Naziv stroja"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-select class="w-full" label="Radno mjesto" v-model="machine.tip">
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
          v-model="machine.napomena"
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
          v-on:click="postRequest()"
          >Spremi</vs-button
        >
        <vs-button color="danger" @click="openPopup()" class="mr-3 mb-2"
          >Obriši</vs-button
        >
      </div>
    </div>
    <vs-popup
      class="holamundo"
      title="Da li ste sigurni da želite obrisat ovog stroja?"
      :active.sync="popupActive"
    >
      <vs-button
        color="danger"
        :disabled="disabled"
        v-on:click="deleteMachine()"
        class="mr-3 mb-2"
        >Da</vs-button
      >
      <vs-button @click="popupActive = false" class="mr-3 mb-2">Ne</vs-button>
    </vs-popup>
  </div>
</template>


<script>
import Errors from "../../../components/common/Errors";
import Success from "../../../components/common/Success";

export default {
  components: {
    Errors,
    Success,
  },
  data() {
    return {
      machine: {
        naziv: "",
        tip: "",
      },
      disabled: false,
      popupActive: false,
      responseErrors: null,
      responseSuccess: null,
    };
  },
  methods: {
    getData() {
      this.$axios({
        method: "GET",
        url: "/api/strojevi/show/" + this.$route.params.id
      })
        .then((res) => {
          this.machine = res.data;
        })
        .catch((err) => {
          this.responseErrors = err.response;
        });
    },
    postRequest() {
      this.disabled = true;
      this.$axios({
        method: "PUT",
        url: "/api/strojevi/update/" + this.$route.params.id,
        data: this.machine
      })
        .then((res) => {
          this.responseSuccess = res.data.message;
          this.responseErrors = null;
          this.disabled = false;
          this.getData();
        })
        .catch((err) => {
          this.disabled = false;
          this.responseErrors = err.response;
        });
    },
    deleteMachine() {
      let url = "/api/strojevi/delete/" + this.$route.params.id;
      this.disabled = true;
      this.$axios({
        method: "DELETE",
        url: url
      })
        .then(() => {
          window.location.href = "/strojevi/pregled";
        })
        .catch((err) => {
          this.$vs.notify({
            title: `Stroj nije ažuriran`,
            text: "Molimo provjerite greške.",
            position: "bottom-right",
            color: "danger",
          });
          this.disabled = false;
          this.popupActive = false;
          this.responseErrors = err.response;
        });
    },
    openPopup() {
      this.popupActive = true;
    },
  },
  beforeMount() {
    this.getData();
  },
};
</script>
