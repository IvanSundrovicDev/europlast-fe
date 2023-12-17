<template>
  <div>
    <Errors
      :response-errors="responseErrors"
      v-if="responseErrors !== null"
    ></Errors>
    <h2 class="style-title">Pregled pozicija</h2>
    <div class="max-width-800">
      <div class="vx-row mb-6">
        <div class="vx-col flex">
          <vs-input
            class="w-100"
            v-model="filterItem"
            type="search"
            label="Pretraži"
            v-on:search="filter()"
          />
        </div>
        <div class="vx-col flex mt-auto">
          <vs-button v-on:click="filter()" :disabled="loading"
            >Pretraži</vs-button
          >
        </div>
        <div class="vx-col flex mt-auto mb-3">
          <vs-checkbox
            class=""
            color="dark"
            v-model="bezOperacija"
            v-on:input="filterOperacije('bezOperacija')"
            >Bez operacija</vs-checkbox
          >
        </div>
        <div class="vx-col flex mt-auto mb-3">
          <vs-checkbox
            class=""
            color="dark"
            v-model="sNapomenom"
            v-on:input="filterOperacije('sNapomenom')"
            >S Napomenom</vs-checkbox
          >
        </div>
      </div>
    </div>
    <vs-table data="users">
      <template slot="thead">
        <vs-th>Naziv</vs-th>
        <vs-th>Materijal</vs-th>
        <vs-th>Broj nacrta </vs-th>
        <vs-th>Nacrt</vs-th>
        <vs-th>Nacrt #2</vs-th>
        <vs-th>Mjerni protokol</vs-th>
        <vs-th>3D model</vs-th>
        <vs-th>3D model #2</vs-th>
        <vs-th>Opcije</vs-th>
      </template>

      <template v-if="data">
        <vs-tr v-for="item in data" :key="item.id">
          <vs-td>{{ item.naziv }}</vs-td>
          <vs-td v-if="item.materijal">{{ item.materijal.naziv }}</vs-td
          ><vs-td v-else
            ><small><em>---</em></small></vs-td
          >
          <vs-td>{{ item.broj_nacrta }}</vs-td>
          <vs-td class="center"
            ><download-icon
              v-on:click="download('nacrt', item.id, item.file_name)"
              v-if="item.file_name"
              size="1.5x"
              class="icon-hover"
            ></download-icon
            ><x-icon
              v-if="!item.file_name"
              size="1.5x"
              class="custom-class"
            ></x-icon
          ></vs-td>
          <vs-td class="center"
            ><download-icon
              v-on:click="
                download('nacrt_dva', item.id, item.nacrt_dva_filename)
              "
              v-if="item.nacrt_dva_filename"
              size="1.5x"
              class="icon-hover"
            ></download-icon
            ><x-icon
              v-if="!item.nacrt_dva_filename"
              size="1.5x"
              class="custom-class"
            ></x-icon
          ></vs-td>
          <vs-td class="center"
            ><download-icon
              v-on:click="
                download(
                  'mjerni_protokol',
                  item.id,
                  item.mjerni_protokol_filename
                )
              "
              v-if="item.mjerni_protokol_filename"
              size="1.5x"
              class="icon-hover"
            ></download-icon
            ><x-icon
              v-if="!item.mjerni_protokol_filename"
              size="1.5x"
              class="custom-class"
            ></x-icon
          ></vs-td>
          <vs-td class="center"
            ><download-icon
              v-on:click="download('model3d', item.id, item.model_3d_filename)"
              v-if="item.model_3d_filename"
              size="1.5x"
              class="icon-hover"
            ></download-icon
            ><x-icon
              v-if="!item.model_3d_filename"
              size="1.5x"
              class="custom-class"
            ></x-icon
          ></vs-td>
          <vs-td class="center"
            ><download-icon
              v-on:click="
                download('model3d-dva', item.id, item.model_3d_dva_filename)
              "
              v-if="item.model_3d_dva_filename"
              size="1.5x"
              class="icon-hover"
            ></download-icon
            ><x-icon
              v-if="!item.model_3d_dva_filename"
              size="1.5x"
              class="custom-class"
            ></x-icon
          ></vs-td>
          <vs-td>
            <div class="flex">
              <vs-button v-on:click="edit(item.id)" class="mr-3 mb-2"
                >Uredi</vs-button
              >
              <DeleteButton
                class="mb-2"
                :entity="item"
                entity-name="Pozicija"
                entity-table-name="pozicije"
                @get-errors="setErrors"
                @get-success="getData"
              ></DeleteButton>
            </div>
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
    <div
      v-infinite-scroll="getData"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="10"
    ></div>
  </div>
</template>

<script>
import { XIcon, DownloadIcon } from "vue-feather-icons";
import Errors from "../../../components/common/Errors";
import DeleteButton from "../../../components/common/DeleteButton";

export default {
  components: {
    DownloadIcon,
    XIcon,
    Errors,
    DeleteButton,
  },
  data() {
    return {
      id: "",
      data: [],
      page: 0,
      lastPage: 1,
      loading: false,
      bezOperacija: false,
      sNapomenom: false,
      oldItem: "",
      filterItem: "",
      responseErrors: null,
      responseSuccess: null,
    };
  },
  methods: {
    filter() {
      if (!this.loading) {
        this.loading = true;
        this.page = 0;
        this.data = [];
        this.getData();
      }
    },
    filterOperacije(type) {
      if (type === "sNapomenom") {
        this.bezOperacija = false;
      }
      if (type === "bezOperacija") {
        this.sNapomenom = false;
      }
      if (!this.loading) {
        this.loading = true;
        this.page = 0;
        this.data = [];
        this.getData();
      }
    },
    getData() {
      if (this.filterItem) {
        if (this.page < this.lastPage) {
          this.page++;
          this.$axios({
            method: "GET",
            url:
              "/api/pozicije/search/" + this.filterItem + "?page=" + this.page,
          })
            .then((res) => {
              this.data = this.data.concat(res.data.data);
              this.lastPage = res.data.last_page;
              this.loading = false;
            })
            .catch((err) => {
              this.responseErrors = err.response;
            });
        }
      } else if (this.bezOperacija) {
        if (this.page < this.lastPage) {
          this.page++;
          this.$axios({
            method: "GET",
            url: "/api/pozicije/bez_operacija?page=" + this.page,
          })
            .then((res) => {
              this.data = this.data.concat(res.data.data);
              this.lastPage = res.data.last_page;
              this.loading = false;
            })
            .catch((err) => {
              this.responseErrors = err.response;
            });
        }
      } else if (this.sNapomenom) {
        if (this.page < this.lastPage) {
          this.page++;
          this.$axios({
            method: "GET",
            url: "/api/pozicije/s_napomenom?page=" + this.page,
          })
            .then((res) => {
              this.data = this.data.concat(res.data.data);
              this.lastPage = res.data.last_page;
              this.loading = false;
            })
            .catch((err) => {
              this.responseErrors = err.response;
            });
        }
      } else {
        if (this.page < this.lastPage) {
          this.page++;
          this.$axios({
            method: "GET",
            url: "/api/pozicije/index?page=" + this.page,
          })
            .then((res) => {
              this.data = this.data.concat(res.data.data);
              this.lastPage = res.data.last_page;
              this.loading = false;
            })
            .catch((err) => {
              this.responseErrors = err.response;
            });
        }
      }
    },
    edit(id) {
      window.location.href = "/pozicije/pregled/" + id;
    },
    download(name, id, filename) {
      const link = document.createElement("a");
      link.href = `/storage/pozicije/${id}/${name}/${filename}`;
      link.setAttribute("download", `${filename}`);
      link.click();

        // var fileURL = window.URL.createObjectURL(new Blob([`/storage/pozicije/${id}/${name}/${filename}`]));
        // var fileLink = document.createElement("a");
        //
        // fileLink.href = fileURL;
        // fileLink.setAttribute("download", filename);
        // document.body.appendChild(fileLink);
        //
        // fileLink.click();
    },
    setErrors(err) {
      this.responseErrors = err;
    },
  },
  computed: {
    isDisabled: function () {
      if (!this.filterItem2) {
        return false;
      } else {
        return true;
      }
    },
    isDisabled2: function () {
      if (!this.filterItem) {
        return false;
      } else {
        return true;
      }
    },
  },
};
</script>
