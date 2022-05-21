<template>
  <div class="mapView">
    <div id="mapDiv"></div>
    <basemap-toggle/>
    <menu-bar/>

  </div>
</template>

<script>
// import {loadModules} from 'esri-loader'
// import BasemapToggle from 'components/mapwidgets/BasemapToggle.vue'
// import MenuBar from 'components/MenuBar.vue'

// const options = {
//   version: '4.23',
//   css: true
// }

// export default {
//   name: "MapView",
//   components: { 
//     BasemapToggle,
//     MenuBar,
//   },
//   mounted: function() {
//     this._createMapView()
//   },
//   methods: {
//     async _createMapView() {
//       const [Basemap, Map, MapView, TileLayer] = await loadModules([
//         'esri/Basemap',
//         'esri/Map',
//         'esri/views/MapView',
//         'esri/layers/TileLayer',
  
//       ], options)
//       const basemap = new Basemap({
//         baseLayers: [
//           new TileLayer({
//             url: 'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
//           })
//         ]
//       })

//       const map = new Map({
//         basemap
//       }) 

//       const view = new MapView({
//         map,
//         container: 'mapDiv',
//         center: [121.508,31.289],
//         zoom: 10
//       })
//       view.ui.components = []
//       this.$store.commit({
//         type: 'setMapView',
//         view,
//       })

//     }
//   }
// }
</script>

<style>
  .mapView,
  #mapDiv {
    width: 100%;
    height: 100%;
  }

  

</style>