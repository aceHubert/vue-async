<template>
  <div class="page-a">
    <h1 class="title">Page A</h1>
    <router-link :to="{ name: 'dymanic-page-b' }">to pageB</router-link>
  </div>
</template>

<script>
import Vue from 'vue';
import './styles/pageA.less';

export default Vue.extend({
  name: 'dymanic-page-a',
});
</script>
