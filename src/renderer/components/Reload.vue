<template>
  <v-layout column align-center>
    <v-progress-circular
      indeterminate
    ></v-progress-circular>
  </v-layout>
</template>


<script>
export default {
  mounted () {
    setTimeout(() => {
      this.$router.go(-1)
    }, 200)
  }
}
</script>