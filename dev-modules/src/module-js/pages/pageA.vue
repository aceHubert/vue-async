<template>
  <div>
    <h1>Page A</h1>
    <router-link :to="{ name: 'remote-page-b' }">to pageB</router-link>
  </div>
</template>

<script>
export default {
  name: 'js-page-a',
};
</script>
