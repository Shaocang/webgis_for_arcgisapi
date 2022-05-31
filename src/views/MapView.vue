<template>
  <div class="mapView">
    <div id="mapDiv"></div>
    <basemap-toggle/>
    <add-layer/>
    <nav-menu/>
    <attribute-query/>
  </div>
</template>

<script>
import {loadModules} from 'esri-loader'
import options from 'components/config'

import BasemapToggle from 'components/onemap/BasemapToggle.vue'
import AddLayer from 'components/onemap/AddLayer.vue'
import AttributeQuery from 'components/onemap/AttributeQuery.vue'
import NavMenu from 'components/onemap/NavMenu.vue'


export default {
  name: "MapView",
  components: { 
    BasemapToggle,
    AddLayer,
    AttributeQuery,
    NavMenu 
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