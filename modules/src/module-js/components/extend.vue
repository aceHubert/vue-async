<template>
  <v-row justify="center">
    <v-avatar color="indigo">
      <v-icon dark>mdi-account-circle</v-icon>
    </v-avatar>

    <v-avatar>
      <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John">
    </v-avatar>

    <v-avatar color="red">
      <span class="white--text headline">CJ</span>
    </v-avatar>
  </v-row>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: "plugin-extend"
});
</script>
