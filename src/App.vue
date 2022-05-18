<template>
  <div id="app">
    <page-layout/>
    <measure-menu/>
  </div>
</template>

<script>
import PageLayout from 'components/PageLayout.vue'
import MeasureMenu from 'components/MeasureMenu.vue'

export default {
  name: 'App',
  components: {
    PageLayout,
    MeasureMenu,
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
