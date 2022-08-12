<template>
    <footer>
    </footer>
</template>

<script>
  import Dashboard from "../../pages/Dashboard";

  export default {
  name: 'Footer',
  components: {
    Dashboard
  },
  computed: {
      core() {
        return this.$store.getters.core
      },
    commit() {
      return this.$store.getters.core.commit.slice(0,8)
    },
    admin() {
      return this.$store.getters.admin
    },
  }
}
</script>

<style scoped>
.hlight {
  color: #f6cbcb;
}
</style>
