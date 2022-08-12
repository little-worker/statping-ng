<template>
    <div class="head-wrapper">
        <a class="logo" href="/"><img src="https://tickets.littleworker.fr/logo-bl.svg" class="logoKW" alt="logo"></a>
        <div class="nav">
        </div>
    </div>
</template>

<script>
export default {
  name: 'Header',
    computed: {
      core() {
          return this.$store.getters.core
      }
    }
}
</script>
