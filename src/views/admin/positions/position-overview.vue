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
    <h2 class="style-title">Uredi poziciju</h2>
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
          v-model="data.position.kooperant.id"
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
        <label class="typo__label">Materijal</label>
        <multiselect
          v-model="dropSelect.value"
          :options="dropSelect.options"
          :custom-label="nameWithLang"
          :placeholder="data.position.materijal"
          label="key"
          track-by="key"
        ></multiselect>
      </div>
    </div>

    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <vs-input
          class="w-full"
          v-model="data.position.sifra_mat_pozicije"
          type="text"
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
            type="string"
            label="#1"
          />
        </div>

        <div class="mt-2" v-if="showPrice2">
          <vs-input
            class="w-full"
            v-model="data.position.cijena_po_kom_2"
            type="string"
            label="#2"
          />
          <div v-on:click="removePrice(2)" style="cursor: pointer">
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
            type="string"
            label="#3"
          />
          <div v-on:click="removePrice(3)" style="cursor: pointer">
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
            type="string"
            label="#4"
          />
          <div v-on:click="removePrice(4)" style="cursor: pointer">
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
            type="string"
            label="#5"
          />
          <div v-on:click="removePrice(5)" style="cursor: pointer">
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
          v-model="data.position.broj_nacrta"
          type="text"
          label="Broj nacrta"
        />
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
    <div v-if="file_name" class="vx-row mb-6">
      <div class="vx-col w-full">
        <p class="naziv-datoteke">
          {{ `Naziv postojećeg nacrta: ${file_name}` }}
        </p>
        <p class="naziv-datoteke">
          Dodavanje nove datoteke će zamijeniti staru.
        </p>
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <label class="vs-input--label">PDF nacrta*</label>
        <input
          class="w-full"
          type="file"
          name="nacrt"
          id="nacrt"
          @change="addFile"
          label="PDF nacrta"
        />
      </div>
    </div>
    <div v-if="nacrt_dva_filename" class="vx-row mb-6">
      <div class="vx-col w-full">
        <p class="naziv-datoteke">
          {{ `Naziv postojećeg nacrta: ${nacrt_dva_filename}` }}
        </p>
        <p class="naziv-datoteke">
          Dodavanje nove datoteke će zamijeniti staru.
        </p>
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col w-full">
        <label class="vs-input--label">Nacrt #2</label>
        <input
          class="w-full"
          type="file"
          name="nacrt2"
          id="nacrt2"
          @change="addNacrt2"
          label="PDF nacrta"
        />
      </div>
    </div>
    <div v-if="mjerni_protokol_filename" class="vx-row mb-6">
      <div class="vx-col w-full">
        <p class="naziv-datoteke">
          {{
            `Naziv postojećeg mjernog protokola: ${mjerni_protokol_filename}`
          }}
        </p>
        <p class="naziv-datoteke">
          Dodavanje nove datoteke će zamijeniti staru.
        </p>
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
    <div v-if="model_3d_filename" class="vx-row mb-6">
      <div class="vx-col w-full">
        <p class="naziv-datoteke">
          {{ `Naziv postojećeg 3D modela: ${model_3d_filename}` }}
        </p>
        <p class="naziv-datoteke">
          Dodavanje nove datoteke će zamijeniti staru.
        </p>
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
    <div v-if="model_3d_dva_filename" class="vx-row mb-6">
      <div class="vx-col w-full">
        <p class="naziv-datoteke">
          {{ `Naziv postojećeg 3D modela: ${model_3d_dva_filename}` }}
        </p>
        <p class="naziv-datoteke">
          Dodavanje nove datoteke će zamijeniti staru.
        </p>
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
      <div class="remove-button">
        <x-icon
          size="1.5x"
          class="remove_icon"
          v-on:click="removeOperation(index - 1)"
        ></x-icon>
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
            type="custom"
            v-model="data.position.operacije[index - 1].napomena"
            :label="`Napomena`"
          />
        </div>
      </div>
    </div>

    <div class="vx-row">
      <div class="vx-col w-full">
        <vs-button class="mr-3 mb-2" v-on:click="postRequest">Uredi</vs-button>
        <vs-button color="warning" @click="addOperation()" class="mr-3 mb-2"
          >Dodaj operaciju</vs-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import Errors from "../../../components/common/Errors";
import Success from "../../../components/common/Success";
import { XIcon } from "vue-feather-icons";
import Multiselect from "vue-multiselect";

export default {
  components: {
    Errors,
    Success,
    XIcon,
    Multiselect,
  },
  data() {
    return {
      data: {
        position: {
          naziv: "",
          kooperant: "",
          sifra_mat_pozicije: "",
          materijal: "",
          cijena_po_kom: "",
          broj_nacrta: "",
          rezati_na: "",
          tezina_po_kom: "",
          stroj_vrij_po_kom: "",
          napomena: "",
          mat_po_kom: "",
          trosak_alata_po_kom: "",
          file: "",
          operacije: [],
          cijena_po_kom_2: "",
          cijena_po_kom_3: "",
          cijena_po_kom_4: "",
          cijena_po_kom_5: "",
        },
      },
      operations: 0,
      file_name: "",
      mjerni_protokol_filename: "",
      model_3d_filename: "",
      nacrt_dva_filename: "",
      model_3d_dva_filename: "",
      materijal: {
        oldValue: null,
        baseItems: [],
        suggestItems: [],
        openSuggest: false,
      },
      file: "",
      protocol: "",
      nacrt_dva: "",
      model: "",
      modeldva: "",
      responseErrors: null,
      responseSuccess: null,
      dropSelect: {
        value: null,
        options: [],
      },
      showPrice2: false,
      showPrice3: false,
      showPrice4: false,
      showPrice5: false,
      addPriceBtn: true,
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
    nameWithLang({ val }) {
      return `${val}`;
    },
    removeOperation(stavka) {
      this.data.position.operacije.splice(stavka, 1);
      this.operations = this.operations - 1;
      /*if (this.data.originalOperations.includes(stavke)) {
                        this.$axios.get('/api/pozicije/delete_operacija/')
                    }*/
    },
    getData() {
      this.$axios({
        method: "GET",
        url: "/api/pozicije/show/" + this.$route.params.id,
      })
        .then((res) => {
          this.file_name = res.data.file_name;
          this.nacrt_dva_filename = res.data.nacrt_dva_filename;
          this.mjerni_protokol_filename = res.data.mjerni_protokol_filename;
          this.model_3d_filename = res.data.model_3d_filename;
          this.operations = res.data.operacije.length;
          this.data.position.naziv = res.data.naziv;
          this.data.position.napomena = res.data.napomena;
          this.data.position.rezati_na = res.data.rezati_na;
          this.data.position.kooperant = res.data.kooperant;
          this.data.position.stroj_vrij_po_kom = res.data.stroj_vrij_po_kom;
          this.data.position.mat_po_kom = res.data.mat_po_kom;
          this.data.position.trosak_alata_po_kom = res.data.trosak_alata_po_kom;
          this.model_3d_dva_filename = res.data.model_3d_dva_filename;
          if (res.data.materijal !== null) {
            this.data.position.materijal = res.data.materijal.sifra_materijala;
          } else {
            this.data.position.materijal = "";
          }
          this.data.position.cijena_po_kom = res.data.cijena_po_kom;
          this.data.position.cijena_po_kom_2 = res.data.cijena_po_kom_2;
          this.data.position.cijena_po_kom_3 = res.data.cijena_po_kom_3;
          this.data.position.cijena_po_kom_4 = res.data.cijena_po_kom_4;
          this.data.position.cijena_po_kom_5 = res.data.cijena_po_kom_5;
          this.data.position.broj_nacrta = res.data.broj_nacrta;
          this.data.position.operacije = res.data.operacije;
          //this.data.originalOperations = res.data.operacije
          this.data.position.tezina_po_kom = res.data.tezina_po_kom;
          this.data.position.sifra_mat_pozicije =
            res.data.sifra_materijala_pozicije;

          if (this.data.position.cijena_po_kom_2) {
            this.showPrice2 = true;
          }
          if (this.data.position.cijena_po_kom_3) {
            this.showPrice3 = true;
          }
          if (this.data.position.cijena_po_kom_4) {
            this.showPrice4 = true;
          }
          if (this.data.position.cijena_po_kom_5) {
            this.showPrice5 = true;
          }
        })
        .catch((err) => {
          this.responseErrors = err.response;
        });
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
            if (item === this.data.position.materijal) {
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
    getMaterijalId() {
      this.$axios({
        method: "GET",
        url: "/api/materijali/list",
      })
        .then((res) => {
          if (res.data) {
            this.materijal.baseItems = res.data;
            this.materijal.suggestItems = res.data;

            for (let [key, value] of Object.entries(res.data)) {
              this.dropSelect.options.push({ key: key, val: value });
            }
          } else {
            this.materijal.baseItems = null;
            this.materijal.suggestItems = null;
          }
        })
        .catch((err) => {
          this.responseErrors = err.response;
        });
    },
    postRequest() {
      if (this.dropSelect.value !== null) {
        this.data.position.materijal = this.dropSelect.value.val;
      }
      let formData = new FormData();
      formData.append("naziv", this.data.position.naziv);
      formData.append("kooperant", this.data.position.kooperant.id);
      formData.append("materijal", this.data.position.materijal);
      formData.append("cijena_po_kom", this.data.position.cijena_po_kom);
      formData.append("cijena_po_kom_2", this.data.position.cijena_po_kom_2);
      formData.append("cijena_po_kom_3", this.data.position.cijena_po_kom_3);
      formData.append("cijena_po_kom_4", this.data.position.cijena_po_kom_4);
      formData.append("cijena_po_kom_5", this.data.position.cijena_po_kom_5);
      formData.append("broj_nacrta", this.data.position.broj_nacrta);
      formData.append("rezati_na", this.data.position.rezati_na);
      formData.append(
        "stroj_vrij_po_kom",
        this.data.position.stroj_vrij_po_kom
      );
      formData.append("mat_po_kom", this.data.position.mat_po_kom);
      formData.append(
        "trosak_alata_po_kom",
        this.data.position.trosak_alata_po_kom
      );
      formData.append("napomena", this.data.position.napomena);
      formData.append("nacrt", this.file);
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
        url: "/api/pozicije/update/" + this.$route.params.id,
        data: formData,
        params: {
          _method: "PUT",
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          this.$vs.notify({
            title: `Pozicija uspješno ažurirana`,
            position: "bottom-right",
            color: "primary",
          });
          this.responseSuccess = res.data.message;
          this.responseErrors = null;
          this.getData();
        })
        .catch((err) => {
          this.$vs.notify({
            title: `Pozicija nije ažurirana`,
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
    this.getData();
    this.$store.dispatch("getCooperants");
    this.getMaterijalId();
  },
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
