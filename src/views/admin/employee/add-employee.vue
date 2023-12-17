    <template>
  <div class="max-width-500">
    <Errors
      :response-errors="responseErrors"
      v-if="responseErrors !== null"
    ></Errors>
    <h2 class="style-title">Dodavanje zaposlenika</h2>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          v-model="zaposlenik.ime"
          class="w-full"
          type="text"
          label="Ime"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          v-model="zaposlenik.prezime"
          class="w-full"
          type="text"
          label="Prezime"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          v-model="zaposlenik.kontakt_broj"
          class="w-full"
          type="text"
          label="Broj telefona"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          v-model="zaposlenik.email"
          class="w-full"
          type="email"
          label="E-mail"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          v-model="zaposlenik.adresa"
          class="w-full"
          type="text"
          label="Adresa"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          v-model="zaposlenik.oib"
          class="w-full"
          type="number"
          label="OIB"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-select
          class="w-full"
          label="Radno mjesto"
          v-model="zaposlenik.pozicija"
        >
          <vs-select-item key="item" value="Tokar" text="Tokar" />
          <vs-select-item key="item2" value="Glodač" text="Glodač" />
          <vs-select-item key="item3" value="Rezač" text="Rezač" />
          <vs-select-item key="item4" value="Kontrola" text="Kontrola" />
          <vs-select-item key="item5" value="Električar" text="Električar" />
          <vs-select-item key="item6" value="Pomoćni" text="Pomoćni" />
        </vs-select>
      </div>
    </div>
    <div class="vx-row">
      <div class="vx-col w-full">
        <vs-button class="mr-3 mb-2" :disabled="disabled" @click="postRequest"
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
      zaposlenik: {
        ime: "",
        prezime: "",
        kontakt_broj: "",
        pozicija: "",
        adresa: "",
        oib: "",
        email: "",
      },
      disabled: false,
      responseErrors: null,
    };
  },
  methods: {
    postRequest() {
      this.disabled = true;
      this.$axios({
        method: "POST",
        url: "/api/zaposlenici/store",
        data: this.zaposlenik,
      })
        .then(() => {
          window.location.href = "/zaposlenici/pregled";
        })
        .catch((err) => {
          this.$vs.notify({
            title: `Zaposlenik nije kreiran.`,
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
