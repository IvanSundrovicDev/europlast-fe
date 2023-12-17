<template>
  <vs-button @click="openAlert()" color="danger">Ukloni</vs-button>
</template>

<script>

export default {
  name: "DeleteButton",
  props: {
    entity: {
      required: true,
    },
    entityName: {
      required: true,
      type: String,
    },
    entityTableName: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      colorAlert: "danger",
      titleAlert: "Alert",
      activeAlert: false,
      valueInput: "",
    };
  },
  methods: {
    openAlert() {
      this.$vs.dialog({
        color: this.colorAlert,
        title: `UPOZORENJE! Jeste li sigurni?`,
        text: `${this.entityName} je vjerojatno povezan s ostalim dijelovima aplikacije.
                    Iako se ${this.entityName} obriše, podaci ce biti vidljivi u povezanim podacima.`,
        accept: this.acceptAlert,
      });
    },
    async acceptAlert() {
      await this.$axios
        .delete(
          `/api/${this.entityTableName}/delete/${this.entity.id}?api_token=` +
            this.$user.api_token
        )
        .then(() => {
          this.$emit("get-success");
          this.$vs.notify({
            color: this.colorAlert,
            title: `${this.entityName} uspješno obrisan/a.`,
          });
        })
        .catch((err) => {
          this.$emit("get-errors", err);
          this.$vs.notify({
            title: `${this.entityName} nije obrisan/a.`,
            text: "Molimo kontaktirajte administratora.",
            position: "bottom-right",
            color: "danger",
          });
        });
    },
  },
};
</script>
