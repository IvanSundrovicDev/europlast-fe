<template>
  <div
    class="h-screen flex w-full bg-img vx-row no-gutter items-center justify-center"
    id="page-login"
  >
    <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 sm:m-0 m-4">
      <vx-card>
        <div slot="no-body" class="full-page-bg-color">
          <div
            class="vx-row no-gutter justify-center items-center"
            style="border: 5px solid rgba(53, 148, 255, 0.3)"
          >
            <div class="vx-col hidden lg:block lg:w-1/2 text-center">
              <img
                src="@/assets/images/logo/logo.png"
                alt="login"
                class="mx-auto"
              />
              <p
                class="italic mt-10"
                style="color: #7abaff; font-weight: bolder"
              >
                Dobrodošli u aplikaciju tvrtke Europlast
              </p>
            </div>
            <div class="vx-col sm:w-full md:w-full lg:w-1/2 d-theme-dark-bg">
              <div class="p-8">
                <div class="vx-card__title mb-8">
                  <h4 class="mb-4">Prijava u sustav</h4>
                </div>
                <vs-input
                  icon="icon icon-user"
                  icon-pack="feather"
                  label-placeholder="Email"
                  v-model="email"
                  name="email"
                  class="w-full no-icon-border"
                />

                <vs-input
                  v-on:keyup.enter="postRequest()"
                  type="password"
                  icon="icon icon-lock"
                  icon-pack="feather"
                  label-placeholder="Lozinka"
                  name="password"
                  v-model="password"
                  class="w-full mt-6 no-icon-border"
                />

                <div class="flex flex-wrap justify-between my-5">
                  <!--<router-link to="#">Zaboravili ste lozinku?</router-link>-->
                </div>
                <vs-button @click="postRequest()">Prijavite se</vs-button>
              </div>
            </div>
          </div>
        </div>
      </vx-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    postRequest() {
      this.$axios
        .post("/api/login", {
          email: this.email,
          password: this.password,
        })
        .then((res) => {
          localStorage.setItem("token", JSON.stringify(res.data));

          this.$axios.get('/api/me').then((res) => {
            localStorage.setItem("user", JSON.stringify(res.data));
            window.location.href = "/";
          })
        })
        .catch(() => {
          this.$vs.notify({
            title: `Korisničko ime ili lozinka nisu ispravni.`,
            text: "Pokušajte ponovno, kontaktirajte administratora ili resetirajte lozinku.",
            position: "bottom-right",
            color: "danger",
          });
        });
    },
  },
};
</script>

<style lang="scss">
#page-login {
  .social-login {
    .bg-facebook {
      background-color: #1551b1;
    }
    .bg-twitter {
      background-color: #00aaff;
    }
    .bg-google {
      background-color: #4285f4;
    }
    .bg-github {
      background-color: #333;
    }
  }
}
</style>
