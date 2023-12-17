<template>
  <div class="max-width-500">
    <vs-alert
      color="danger"
      v-if="passErrorMessage"
      style="margin-bottom: 20px"
    >
      <p>{{ passErrorMessage }}</p>
    </vs-alert>
    <Errors
      :response-errors="responseErrors"
      v-if="responseErrors !== null"
    ></Errors>
    <h2 class="style-title">Dodaj novi profil</h2>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-select v-model="user.role" class="w-full" label="Rola">
          <vs-select-item
            value="administrator"
            text="Administrator"
          ></vs-select-item>
          <vs-select-item value="korisnik" text="Korisnik"></vs-select-item>
          <vs-select-item value="kontrola" text="Kontrola"></vs-select-item>
        </vs-select>
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          v-model="user.first_name"
          class="w-full"
          type="text"
          label="Ime"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          v-model="user.last_name"
          class="w-full"
          type="text"
          label="Prezime"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          v-model="user.address"
          class="w-full"
          type="text"
          label="Adresa"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          v-model="user.email"
          class="w-full"
          type="text"
          label="Email adresa"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          v-model="user.password"
          class="w-full"
          type="password"
          label="Lozinka"
          v-on:input="checkPass()"
        />
      </div>
    </div>
    <div class="vx-row mb-6" v-if="secondPass">
      <div class="vx-col w-full">
        <vs-input
          v-model="user.password_confirmation"
          class="w-full"
          type="password"
          label="Ponovite lozinku"
          v-on:input="checkPass()"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          v-model="user.contact_number"
          class="w-full"
          type="text"
          label="Broj telefona"
        />
      </div>
    </div>
    <div class="vx-row">
      <div class="vx-col w-full">
        <vs-button
          class="mr-3 mb-2"
          v-if="!passErrorMessage && passMatches"
          :disabled="disabled"
          v-on:click="postRequest"
          >Dodaj</vs-button
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
      user: {
        first_name: "",
        last_name: "",
        email: "",
        address: "",
        contact_number: "",
        role: "",
      },
      disabled: false,
      popupActive: false,
      responseErrors: null,
      passErrorMessage: null,
      passMatches: true,
      secondPass: false,
    };
  },
  methods: {
    checkPass() {
      if (this.user.password.length < 1) {
        this.passMatches = true;
        this.passErrorMessage = null;
        this.secondPass = null;
      } else {
        if (this.user.password.length < 6 || this.user.password.length > 25) {
          this.passErrorMessage =
            "Lozinka mora biti dužine između 6 i 25 slova.";
        } else {
          this.secondPass = true;
          if (this.user.password === this.user.password_confirmation) {
            this.passErrorMessage = null;
            this.passMatches = true;
          } else {
            this.passMatches = false;
            this.passErrorMessage = "Molimo unesite istu lozinku";
          }
        }
      }
    },
    postRequest() {
      this.disabled = true;
      this.$axios({
        method: "POST",
        url: "/api/users/store",
        data: this.user,
      })
        .then(() => {
          window.location.href = "/profil/edit";
        })
        .catch((err) => {
          this.$vs.notify({
            title: `User nije kreiran`,
            text: "Molimo provjerite greške.",
            position: "bottom-right",
            color: "danger",
          });
          this.disabled = false;
          this.responseErrors = err.response;
        });
    },
  },
};
</script>
