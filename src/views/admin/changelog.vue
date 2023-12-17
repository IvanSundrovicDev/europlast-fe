<template>
  <div>
    <Errors
      :response-errors="responseErrors"
      v-if="responseErrors !== null"
    ></Errors>
    <vs-tabs>
      <vs-tab label="Završeno">
        <vs-table data="changelog">
          <template slot="thead">
            <vs-th>Datum</vs-th>
            <vs-th>Verzija</vs-th>
            <vs-th>Popis promjena</vs-th>
            <vs-th>Status</vs-th>
          </template>

          <template>
            <vs-tr>
              <vs-td>19.5.2021.</vs-td>
              <vs-td>1.0.1</vs-td>
              <vs-td>
                <ol style="list-style-type: disc">
                  <li>Dodana napomena u poziciju</li>
                  <li>Dodan filter po napomenu u popisu pozicija</li>
                  <li>Dodana "KV Cijev" u vrsti materijala za materijal</li>
                  <li>
                    Isporuke sada sortirane po datumu i broju racuna (zadnje
                    prvo)
                  </li>
                </ol>
              </vs-td>
              <vs-td>
                Na produkciji
                <vs-icon icon="check" color="green"></vs-icon>
              </vs-td>
            </vs-tr>

            <vs-tr>
              <vs-td>07.12.2021.</vs-td>
              <vs-td>1.0.1</vs-td>
              <vs-td>
                <ol style="list-style-type: disc">
                  <li>Pretraga naloga po barkodu sada moguca</li>
                  <li>
                    Kontrola moze zavrsiti nalog i staviti površinsku obradu
                  </li>
                  <li>
                    Radnje završenog naloga sada vidljive (onemoguceno mjenjanje
                    podataka)
                  </li>
                  <li>Isporuke sortirane po broju otpremnice</li>
                  <li>Dodan iznos isporuka u pregledu</li>
                  <li>
                    Dodana validacija za duple brojeve otpremnica i racuna
                  </li>
                </ol>
              </vs-td>
              <vs-td
                >Na produkciji <vs-icon icon="check" color="green"></vs-icon
              ></vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </vs-tab>

      <vs-tab label="Planovi">
        <div style="margin-top: 1em; margin-bottom: 1em">
          Legenda:
          <p class="mt-2">
            <span class="changelog-desc-item">
              <alert-triangle-icon
                size="1.5x"
                style="color: red"
              ></alert-triangle-icon>
            </span>
            <span class="changelog-desc-items-child"> Popravci (hitni) </span>
          </p>
          <p class="mt-2">
            <span class="changelog-desc-item">
              <alert-triangle-icon
                size="1.5x"
                style="color: #4361ee"
              ></alert-triangle-icon>
            </span>
            <span class="changelog-desc-item"> Popravci (redovni) </span>
          </p>
          <p class="mt-2">
            <span class="changelog-desc-item">
              <alert-triangle-icon
                size="1.5x"
                style="color: green"
              ></alert-triangle-icon>
            </span>
            <span class="changelog-desc-item"> Nova funkcionalnost </span>
          </p>
        </div>

        <div class="mt-5 mb-8" v-if="this.$user.email === 'admin@admin.hr'">
          <vs-button v-if="!open" v-on:click="open = true"
            >Dodaj Novi</vs-button
          >
          <vs-button class="ml-3" v-if="!open" v-on:click="release()"
          >Release Finished</vs-button
          >
          <div v-if="open">
            <vs-select
              class="w-96 mt-6"
              v-model="newChangelog.importance"
              label="Važnost"
            >
              <vs-select-item
                key="hitni"
                value="hitni_popravci"
                text="Popravci (hitni)"
              />
              <vs-select-item
                key="redovni"
                value="redovni_popravci"
                text="Popravci (redovni)"
              />
              <vs-select-item
                key="novi"
                value="nova_funkcionalnost"
                text="Nova funkcionalnost"
              />
            </vs-select>
            <vs-input
              class="w-96 mt-3"
              v-model="newChangelog.area"
              type="text"
              label="Podrucje"
            />
            <vs-textarea
              class="w-96 mt-6"
              v-model="newChangelog.description"
              type="custom"
              label="Opis"
            />
            <vs-select
              class="w-96 mt-3"
              v-model="newChangelog.status"
              label="Status"
            >
              <vs-select-item
                key="uProcesu"
                value="inProgress"
                text="U procesu"
              />
              <vs-select-item
                key="naCekanju"
                value="onHold"
                text="Na čekanju"
              />
            </vs-select>
            <div class="flex">
              <vs-button class="mt-6" v-on:click="addChangelog()">Spremi</vs-button>
              <vs-button color="danger" class="mt-6 ml-5" v-on:click="open = false">Odustani</vs-button>
            </div>
          </div>
        </div>

        <vs-table data="planovi">
          <template slot="thead">
            <vs-th>Važnost</vs-th>
            <vs-th>Područje</vs-th>
            <vs-th>Opis</vs-th>
            <vs-th>Status</vs-th>
          </template>

          <template>
            <vs-tr v-for="(changelog, i) in changelogs" :key="changelog.id">
              <vs-td style="text-align: center">
                <alert-triangle-icon
                    v-if="changelog.importance === 'hitni_popravci'"
                  size="1.5x"
                  style="color: red"
                ></alert-triangle-icon>
                <alert-triangle-icon
                    v-if="changelog.importance === 'redovni_popravci'"
                    size="1.5x"
                    style="color: #4361ee"
                ></alert-triangle-icon>
                <alert-triangle-icon
                    v-if="changelog.importance === 'nova_funkcionalnost'"
                    size="1.5x"
                    style="color: green"
                ></alert-triangle-icon>
              </vs-td>
              <vs-td>{{ changelog.area }}</vs-td>
              <vs-td>{{ changelog.description }}</vs-td>
              <vs-td v-if="$user.email === 'admin@admin.hr'">
                <vs-select
                    v-on:change="updateStatus(changelog.id, i)"
                    class="w-96"
                    v-model="changelog.status"
                >
                  <vs-select-item
                      key="uProcesu"
                      value="inProgress"
                      text="U procesu"
                  />
                  <vs-select-item
                      key="naCekanju"
                      value="onHold"
                      text="Na čekanju"
                  />
                  <vs-select-item
                      key="zavrseno"
                      value="finished"
                      text="Završeno"
                  />
                </vs-select>
              </vs-td>
              <vs-td v-else>{{changelog.status}}</vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </vs-tab>
    </vs-tabs>
  </div>
</template>

<script>
import { AlertTriangleIcon } from "vue-feather-icons";
import Errors from "../../components/common/Errors";

export default {
  components: {
    AlertTriangleIcon,
    Errors,
  },
  data() {
    return {
      open: false,
      responseErrors: null,
      changelogs: [],
      newChangelog: {
        importance: "",
        area: "",
        description: "",
        status: "",
      },
    };
  },
  methods: {
    getChangelog() {
      this.$axios
        .get("/api/changelog/index")
        .then((res) => {
          this.changelogs = res.data;
        })
        .catch((err) => {
          this.responseErrors = err.response;
        });
    },
    addChangelog() {
      this.$axios
        .post("/api/changelog/store", this.newChangelog)
        .then(() => {
          this.open = false;
          this.newChangelog = {
            importance: "",
            area: "",
            description: "",
            status: "",
          };      
          this.getChangelog();
        })
        .catch((err) => {
          this.responseErrors = err.response;
        });
    },
    updateStatus(id, i) {
      this.$axios
          .put(`/api/changelog/change-status/${id}`, {status: this.changelogs[i].status})
          .then(() => {
            this.getChangelog();
          })
          .catch((err) => {
            this.responseErrors = err.response;
          });
    },
    release(){

    }
  },
  beforeMount() {
    this.getChangelog();
  },
};
</script>

<style scoped>
.changelog-desc-item {
  display: inline-block;
  margin-left: 5px;
  vertical-align: middle;
}
</style>
