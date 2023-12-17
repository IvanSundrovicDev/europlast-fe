<template>
  <div>
    <Errors
      :response-errors="responseErrors"
      v-if="responseErrors !== null"
    ></Errors>
    <Success
      :message="responseSuccess"
      v-if="responseSuccess !== null"
    ></Success>
    <vs-table data="users">
      <template slot="thead">
        <vs-th>Pošiljatelj</vs-th>
        <vs-th>E-mail</vs-th>
        <vs-th>Poruka</vs-th>
        <vs-th>Primljeno</vs-th>
        <vs-th>Opcije</vs-th>
      </template>

      <template>
        <vs-tr v-for="item in poruke" :key="item.id">
          <vs-td>{{ item.name }}</vs-td>
          <vs-td>{{ item.email }}</vs-td>
          <vs-td style="max-width: 300px">{{ item.message }}</vs-td>
          <vs-td>{{ handleDateTime(item.created_at) }}</vs-td>
          <vs-td>
            <vs-button @click="deleteMsg(item.id)">Obriši</vs-button>
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
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
      poruke: [],
      responseErrors: null,
      responseSuccess: null,
    };
  },
  methods: {
    handleDateTime(item) {
      const date = new Date(item);
      const formattedDate = date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      });
      return formattedDate;
    },
    getData() {
      this.$axios({
        method: "GET",
        url: "/api/get_contact_form",
      })
        .then((res) => {
          this.poruke = res.data;
        })
        .catch((err) => {
          this.responseErrors = err.response;
        });
    },
    deleteMsg(id) {
      this.$axios({
        method: "DELETE",
        url: "/api/get_contact_form/" + id,
      })
        .then(() => {
          this.getData();
          this.responseSuccess = "Poruka obrisana.";
        })
        .catch((err) => {
          this.responseErrors = err.response;
        });
    },
  },
  beforeMount() {
    this.getData();
  },
};
</script>
