<template>
  <div>
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
      <Success
        :message="responseSuccess"
        v-if="responseSuccess !== null"
      ></Success>
      <h2 class="style-title">Uredi profil</h2>
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
            label="Nova lozinka"
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
      <div class="vx-row mb-6">
        <div class="vx-col w-full">
          <vs-checkbox color="dark" v-model="user.dark_mode"
            >Tamna tema</vs-checkbox
          >
        </div>
      </div>
      <div class="vx-row">
        <div class="vx-col w-full">
          <vs-button
            class="mr-3 mb-2"
            v-if="!passErrorMessage && passMatches"
            :disabled="disabled"
            v-on:click="postRequest"
            >Spremi</vs-button
          >
          <vs-button
            v-if="this.$user.role === 'administrator'"
            class="mr-3 mb-2"
            color="success"
            v-on:click="redirect"
            >Dodaj novog korisnika</vs-button
          >
        </div>
      </div>
    </div>
    <div class="users w-full mt-10" v-if="this.$user.role === 'administrator'">
      <h3>Popis korisnika aplikacije:</h3>

      <vs-table data="users" v-if="users" class="mt-5">
        <template slot="thead">
          <vs-th>Ime</vs-th>
          <vs-th>Prezime</vs-th>
          <vs-th>E-mail</vs-th>
          <vs-th>Kontakt broj</vs-th>
          <vs-th>Dopuštenja</vs-th>
        </template>

        <template>
          <vs-tr v-for="user in users" :key="user.id">
            <vs-td>{{ user.first_name }}</vs-td>
            <vs-td>{{ user.last_name }}</vs-td>
            <vs-td>{{ user.email }}</vs-td>
            <vs-td>{{ user.contact_number }}</vs-td>
            <vs-td>{{ user.role }}</vs-td>
          </vs-tr>
        </template>
      </vs-table>
      <p v-else>Nema podataka.</p>
    </div>
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
      user: {
        first_name: "",
        last_name: "",
        email: "",
        address: "",
        contact_number: "",
        dark_mode: false,
      },
      disabled: false,
      popupActive: false,
      passErrorMessage: null,
      passMatches: true,
      secondPass: false,
      responseErrors: null,
      responseSuccess: null,
      users: "",
    };
  },
  methods: {
    getAllUsers() {
      this.$axios({
        method: "GET",
        url: "/api/users/index",
      })
        .then((res) => {
          this.users = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    checkPass() {
      if (this.user.password.length < 1) {
        this.passMatches = true;
        this.passErrorMessage = null;
        this.secondPass = null;
      } else {
        if (this.user.password.length < 6 || this.user.password.length > 25) {
          this.passErrorMessage =
            "Lozinka mora biti između 6 i 25 slova dugačka";
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
    redirect() {
      window.location.href = "/profil/novi";
    },
    getData() {
      this.$axios({
        method: "GET",
        url: `/api/users/get-user/${this.$user.id}`,
      })
        .then((res) => {
          this.user = res.data;
        })
        .catch((err) => {
          this.responseErrors = err.response;
        });
    },
    postRequest() {
      this.disabled = true;
      this.$axios({
        method: "PUT",
        url: "/api/users/update/" + this.user.id,
        data: this.user,
      })
        .then((res) => {
          this.responseSuccess = res.data.message;
          this.responseErrors = null;
          this.user = res.data.user;
          localStorage.setItem("user", JSON.stringify(res.data.user));
          this.$vs.notify({
            title: `Profil uspješno ažuriran`,
            position: "bottom-right",
            color: "primary",
          });
        })
        .catch((err) => {
          this.$vs.notify({
            title: `Profil nije ažuriran`,
            text: "Molimo provjerite greške.",
            position: "bottom-right",
            color: "danger",
          });
          this.disabled = false;
          this.responseErrors = err.response;
        });
    },
  },
  beforeMount() {
    this.getData();
    this.getAllUsers();
  },
};
</script>
