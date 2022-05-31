<template>
  <div class="mapView">
    <div id="mapDiv"></div>
    <basemap-toggle/>
    <menu-bar/>
    <!-- <add-layer/> -->
    <!-- <measure-menu/> -->
    <spatial-query/>
    <swipe-analyse/>
    <attribute-query/>
    <nav-menu/>
    <!-- <measure-panel/> -->
  </div>
</template>

<script>
import {loadModules} from 'esri-loader'
import options from 'components/config'

import BasemapToggle from 'components/onemap/BasemapToggle.vue'
import MenuBar from 'components/onemap/MenuBar.vue'
// import AddLayer from 'components/onemap/AddLayer.vue'
// import MeasureMenu from 'components/onemap/MeasureMenu.vue'
import SpatialQuery from 'components/onemap/SpatialQuery.vue'
import SwipeAnalyse from 'components/onemap/SwipeAnalyse.vue'
import AttributeQuery from 'components/onemap/AttributeQuery.vue'
import NavMenu from 'components/onemap/NavMenu.vue'
// import MeasurePanel from 'components/onemap/MeasurePanel.vue'


export default {
  name: "MapView",
  components: { 
    BasemapToggle,
    MenuBar,
    // AddLayer,
    // MeasureMenu,
    SpatialQuery,
    SwipeAnalyse,
    AttributeQuery,
    NavMenu,
    // MeasurePanel 
  },
  mounted: function() {
    this._createMapView()
  },
  methods: {
    async _createMapView() {
      const [Basemap, Map, MapView, TileLayer] = await loadModules([
        'esri/Basemap',
        'esri/Map',
        'esri/views/MapView',
        'esri/layers/TileLayer'
      ], options)

      const basemap = new Basemap({
        baseLayers: [
          new TileLayer({
            url: 'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
          })
        ]
      })

      const map = new Map({
        basemap
      }) 

      const view = new MapView({
        map,
        container: 'mapDiv',
        center: [121.508,31.289],
        zoom: 10
      })
      view.ui.components = []

      this.$store.commit({
        type: '_setMapView',
        view
      })

      
    }
  }
}
</script>

<style>
  .mapView,
  #mapDiv {
    width: 100%;
    height: 100%;
  }


</style>