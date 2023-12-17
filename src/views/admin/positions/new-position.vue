<template>
  <div class="max-width-500">
    <Errors
      :response-errors="responseErrors"
      v-if="responseErrors !== null"
    ></Errors>
    <h2 class="style-title">Unos nove pozicije</h2>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          class="w-full"
          v-model="data.position.broj_nacrta"
          v-on:input="checkIfExists"
          type="text"
          label="Broj nacrta"
        />
        <div style="font-size: small" v-if="exists">
          <p>Pozicija/e koji sadrže tu šifu:</p>
          <ul style="list-style: circle" class="ml-5">
            <li v-for="(pozicija, key) in postojecePozicije" :key="key">
              {{ pozicija.broj_nacrta }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          class="w-full"
          v-model="data.position.naziv"
          type="text"
          label="Naziv pozicije"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-select
          class="w-full"
          v-model="data.position.kooperant"
          label="Kooperant"
        >
          <vs-select-item
            v-for="kooperant in cooperants"
            :key="kooperant.id"
            :value="kooperant.id"
            :text="`${kooperant.naziv} (${kooperant.jezik}/${kooperant.valuta})`"
          />
        </vs-select>
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <label class="typo__label"
          >Materijal
          <vs-icon
            icon="refresh"
            color="green"
            v-bind:class="{ refreshRotate: rotateRefresh }"
            v-on:click.native="getMaterijalId"
          ></vs-icon
        ></label>
        <multiselect
          v-model="dropSelect.value"
          :options="dropSelect.options"
          :custom-label="nameWithLang"
          :placeholder="data.position.materijal"
          label="key"
          track-by="key"
          v-on:click="addValueAcc"
        ></multiselect>
      </div>
    </div>

    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          class="w-full"
          v-model="data.position.sifra_mat_pozicije"
          type="string"
          label="Šifra materijala pozicije"
        />
      </div>
    </div>

    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <p>Cijena po komadu</p>

        <div class="mt-2">
          <vs-input
            class="w-full"
            v-model="data.position.cijena_po_kom"
            type="number"
            label="#1"
          />
        </div>

        <div class="mt-2" v-if="showPrice2">
          <vs-input
            class="w-full"
            v-model="data.position.cijena_po_kom_2"
            type="number"
            label="#2"
          />
          <div class="mt-2" v-on:click="removePrice(2)" style="cursor: pointer">
            <vs-chip
              style="float: none; background-color: rgba(255, 71, 87, 0.5)"
            >
              Ukloni
            </vs-chip>
          </div>
        </div>

        <div class="mt-2" v-if="showPrice3">
          <vs-input
            class="w-full"
            v-model="data.position.cijena_po_kom_3"
            type="number"
            label="#3"
          />
          <div class="mt-2" v-on:click="removePrice(3)" style="cursor: pointer">
            <vs-chip
              style="float: none; background-color: rgba(255, 71, 87, 0.5)"
            >
              Ukloni
            </vs-chip>
          </div>
        </div>

        <div class="mt-2" v-if="showPrice4">
          <vs-input
            class="w-full"
            v-model="data.position.cijena_po_kom_4"
            type="number"
            label="#4"
          />
          <div class="mt-2" v-on:click="removePrice(4)" style="cursor: pointer">
            <vs-chip
              style="float: none; background-color: rgba(255, 71, 87, 0.5)"
            >
              Ukloni
            </vs-chip>
          </div>
        </div>

        <div class="mt-2" v-if="showPrice5">
          <vs-input
            class="w-full"
            v-model="data.position.cijena_po_kom_5"
            type="number"
            label="#5"
          />
          <div class="mt-2" v-on:click="removePrice(5)" style="cursor: pointer">
            <vs-chip
              style="float: none; background-color: rgba(255, 71, 87, 0.5)"
            >
              Ukloni
            </vs-chip>
          </div>
        </div>

        <div
          class="mt-2"
          v-on:click="addPrice"
          style="cursor: pointer"
          v-if="addPriceBtn"
        >
          <vs-chip color="primary" class="mt-2">
            <vs-icon icon="add"></vs-icon> dodaj novu
          </vs-chip>
        </div>
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          class="w-full"
          v-model="data.position.rezati_na"
          type="text"
          label="Rezati na"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          class="w-full"
          v-model="data.position.tezina_po_kom"
          type="number"
          label="Težina po komadu u gramima"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          class="w-full"
          v-model="data.position.stroj_vrij_po_kom"
          type="text"
          label="Strojno vrijeme po komadu"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          class="w-full"
          v-model="data.position.mat_po_kom"
          type="text"
          label="Materijal po komadu"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          class="w-full"
          v-model="data.position.trosak_alata_po_kom"
          type="text"
          label="Trošak alata po komadu"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-textarea
          class="w-full"
          v-model="data.position.napomena"
          type="text"
          label="Napomena"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <label class="vs-input--label">PDF nacrta</label>
        <input
          class="w-full"
          type="file"
          name="nacrt"
          id="nacrt"
          @change="addFile"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <label class="vs-input--label">Nacrt 2</label>
        <input
          class="w-full"
          type="file"
          name="nacrt2"
          id="nacrt2"
          @change="addNacrt2"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <label class="vs-input--label">Mjerni protokol</label>
        <input
          class="w-full"
          type="file"
          name="protokol"
          id="protokol"
          @change="addProtocol"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <label class="vs-input--label">3D model</label>
        <input
          class="w-full"
          type="file"
          name="model"
          id="model"
          @change="addModel"
        />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <label class="vs-input--label">3D model #2</label>
        <input
          class="w-full"
          type="file"
          name="modeldva"
          id="modeldva"
          @change="addModeldva"
        />
      </div>
    </div>
    <div v-for="(index, key) in operations" class="stavka" :key="key">
      <div class="remove-button" v-on:click="removeOperation(index - 1)">
        <x-icon size="1.5x" class="remove_icon"></x-icon>
      </div>

      <div class="vx-row mb-6">
        <div class="vx-col w-full">
          <vs-input
            class="w-full"
            v-model="data.position.operacije[index - 1].red_br"
            type="text"
            :label="`Redni broj`"
          />
        </div>
      </div>
      <div class="vx-row mb-6">
        <div class="vx-col w-full">
          <vs-input
            class="w-full"
            v-model="data.position.operacije[index - 1].naziv_operacije"
            type="text"
            :label="`Naziv operacije`"
          />
        </div>
      </div>
      <div class="vx-row mb-6">
        <div class="vx-col w-full">
          <vs-select
            class="w-full"
            v-model="data.position.operacije[index - 1].radnja"
            :label="`Radnje`"
          >
            <vs-select-item key="1" value="rezanje" text="Rezanje" />
            <vs-select-item key="2" value="tokarenje" text="Tokarenje" />
            <vs-select-item key="3" value="glodanje" text="Glodanje" />
            <vs-select-item
              key="4"
              value="bravarski_rad"
              text="Bravarski rad"
            />
            <vs-select-item
              key="5"
              value="povrsinska_obrada"
              text="Povrsinska obrada"
            />
          </vs-select>
        </div>
      </div>
      <div class="vx-row mb-6">
        <div class="vx-col w-full">
          <vs-textarea
            class="w-full"
            v-model="data.position.operacije[index - 1].napomena"
            type="custom"
            :label="`Napomena`"
          />
        </div>
      </div>
    </div>
    <div class="vx-row">
      <div class="vx-col w-full">
        <vs-button class="mr-3 mb-2" v-on:click="postRequest">Spremi</vs-button>
        <vs-button color="warning" @click="addOperation()" class="mr-3 mb-2"
          >Dodaj operaciju</vs-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import Errors from "../../../components/common/Errors";
import { XIcon } from "vue-feather-icons";
import Multiselect from "vue-multiselect";

export default {
  components: {
    Errors,
    XIcon,
    Multiselect,
  },
  data() {
    return {
      responseErrors: null,
      data: {
        position: {
          naziv: "",
          sifra_mat_pozicije: "",
          kooperant: "",
          materijal: "",
          cijena_po_kom: "",
          broj_nacrta: "",
          rezati_na: "",
          tezina_po_kom: "",
          stroj_vrij_po_kom: "",
          mat_po_kom: "",
          trosak_alata_po_kom: "",
          napomena: "",
          file: "",
          operacije: [],
          cijena_po_kom_2: "",
          cijena_po_kom_3: "",
          cijena_po_kom_4: "",
          cijena_po_kom_5: "",
        },
      },
      operations: 0,
      materijal: {
        oldValue: null,
        baseItems: [],
        suggestItems: [],
        openSuggest: false,
      },
      file: "",
      nacrt_dva: "",
      protocol: "",
      model: "",
      modeldva: "",
      dropSelect: {
        value: null,
        options: [],
      },
      exists: false,
      postojecePozicije: "",
      showPrice2: false,
      showPrice3: false,
      showPrice4: false,
      showPrice5: false,
      addPriceBtn: true,
      rotateRefresh: false,
    };
  },
  computed: {
    cooperants() {
      return this.$store.state.cooperants;
    },
  },
  methods: {
    addPrice() {
      if (this.showPrice2 === false) {
        if (this.data.position.cijena_po_kom) {
          this.showPrice2 = true;
        }
      } else if (this.showPrice3 === false) {
        if (this.data.position.cijena_po_kom_2) {
          this.showPrice3 = true;
        }
      } else if (this.showPrice4 === false) {
        if (this.data.position.cijena_po_kom_3) {
          this.showPrice4 = true;
        }
      } else if (this.showPrice5 === false) {
        if (this.data.position.cijena_po_kom_4) {
          this.showPrice5 = true;
          this.addPriceBtn = false;
        }
      } else {
        return false;
      }
    },
    removePrice(val) {
      switch (val) {
        case 2:
          if (this.showPrice5 || this.showPrice4 || this.showPrice3) {
            break;
          } else {
            this.showPrice2 = false;
            this.data.position.cijena_po_kom_2 = "";
          }
          break;
        case 3:
          if (!this.showPrice5 || !this.showPrice4) {
            this.showPrice3 = false;
            this.data.position.cijena_po_kom_3 = "";
          }
          break;
        case 4:
          if (!this.showPrice5) {
            this.showPrice4 = false;
            this.data.position.cijena_po_kom_4 = "";
          }
          break;
        case 5:
          this.showPrice5 = false;
          this.data.position.cijena_po_kom_5 = "";
          this.addPriceBtn = true;
          break;
        default:
          return true;
      }
    },
    checkIfExists(val) {
      if (val.length > 0) {
        this.$axios
          .get("/api/pozicije/provjeri/" + val)
          .then((res) => {
            this.exists = res.data.exists;
            this.postojecePozicije = res.data.pozicije;
          })
          .catch((err) => {
            this.$vs.notify({
              title: `Problem s provjerom šifre pozicije`,
              text: err,
              position: "bottom-right",
              color: "danger",
            });
          });
      } else {
        this.exists = false;
      }
    },
    addValueAcc() {
      this.data.position.materijal = this.dropSelect.value;
    },
    nameWithLang({ val }) {
      return `${val}`;
    },
    removeOperation(stavka) {
      this.data.position.operacije.splice(stavka, 1);
      this.operations = this.operations - 1;
    },
    addOperation() {
      this.data.position.operacije.push({
        naziv_operacije: "",
        radnja: "",
        napomena: "",
      });
      this.operations = this.operations + 1;
    },
    autoSuggestMaterijal() {
      if (this.data.position.materijal.length > 2) {
        if (this.materijal.oldValue !== this.data.position.materijal) {
          let items = [];
          for (var i = 0; i < this.materijal.baseItems.length; i++) {
            let item = this.materijal.baseItems[i].substring(
              0,
              this.data.position.materijal.length
            );
            if (item == this.data.position.materijal) {
              items.push(this.materijal.baseItems[i]);
            }
          }
          this.materijal.oldValue = this.data.position.materijal;
          this.materijal.suggestItems = items;
          this.materijal.openSuggest = true;
        }
      } else {
        this.materijal.openSuggest = false;
      }
    },
    addValueMaterijal(value) {
      this.data.position.materijal = value;
      this.materijal.oldValue = this.data.position.materijal;
      this.materijal.openSuggest = false;
    },
    async getMaterijalId() {
      this.rotateRefresh = true;
      await this.$axios({
        method: "GET",
        url: "/api/materijali/list",
      })
        .then((res) => {
          this.rotateRefresh = false;
          this.materijal.baseItems = res.data;
          this.materijal.suggestItems = res.data;

          for (let [key, value] of Object.entries(res.data)) {
            this.dropSelect.options.push({ key: key, val: value });
          }
        })
        .catch((err) => {
          this.rotateRefresh = false;
          this.responseErrors = err.response;
        });
    },
    postRequest() {
      let formData = new FormData();
      formData.append("naziv", this.data.position.naziv);
      formData.append("kooperant", this.data.position.kooperant);
      if (this.dropSelect.value !== null) {
        formData.append("materijal", this.dropSelect.value.val);
      } else {
        formData.append("materijal", null);
      }
      formData.append("rezati_na", this.data.position.rezati_na);
      formData.append("cijena_po_kom", this.data.position.cijena_po_kom);
      formData.append("cijena_po_kom_2", this.data.position.cijena_po_kom_2);
      formData.append("cijena_po_kom_3", this.data.position.cijena_po_kom_3);
      formData.append("cijena_po_kom_4", this.data.position.cijena_po_kom_4);
      formData.append("cijena_po_kom_5", this.data.position.cijena_po_kom_5);
      formData.append(
        "stroj_vrij_po_kom",
        this.data.position.stroj_vrij_po_kom
      );
      formData.append("mat_po_kom", this.data.position.mat_po_kom);
      formData.append(
        "trosak_alata_po_kom",
        this.data.position.trosak_alata_po_kom
      );
      formData.append("broj_nacrta", this.data.position.broj_nacrta);
      formData.append("nacrt", this.file);
      formData.append("napomena", this.data.position.napomena);
      formData.append("nacrt_dva", this.nacrt_dva);
      formData.append("tezina_po_kom", this.data.position.tezina_po_kom);
      formData.append("mjerni_protokol", this.protocol);
      formData.append("model_3d", this.model);
      formData.append("model_3d_dva", this.modeldva);
      formData.append(
        "sifra_mat_pozicije",
        this.data.position.sifra_mat_pozicije
      );
      formData.append(
        "operacije",
        JSON.stringify(this.data.position.operacije)
      );
      this.$axios({
        method: "POST",
        url: "/api/pozicije/store",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then(() => {
          window.location.href = "/pozicije/nova";
        })
        .catch((err) => {
          this.$vs.notify({
            title: `Pozicija nije kreirana`,
            text: "Molimo provjerite greške.",
            position: "bottom-right",
            color: "danger",
          });
          this.responseErrors = err.response;
        });
    },
    addFile(e) {
      this.file = e.target.files[0];
    },
    addNacrt2(e) {
      this.nacrt_dva = e.target.files[0];
    },
    addProtocol(e) {
      this.protocol = e.target.files[0];
    },
    addModel(e) {
      this.model = e.target.files[0];
    },
    addModeldva(e) {
      this.modeldva = e.target.files[0];
    },
  },
  beforeMount() {
    this.$store.dispatch("getCooperants");
    this.getMaterijalId();
  },
};
</script>
<style>
.refreshRotate {
  -webkit-animation: spin 0.6s ease-in-out;
  -moz-animation: spin 0.6s ease-in-out;
  animation: spin 0.6s infinite;
}
@-moz-keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@-webkit-keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
