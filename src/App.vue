<template>
  <div id="app">
    <page-layout/>
  </div>
</template>

<script>
import PageLayout from 'components/common/PageLayout.vue'

export default {
  name: 'App',
  components: {
    PageLayout,
  }
}
</script>

<style>
@import 'assets/css/base.css';

#app {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}

</style>
