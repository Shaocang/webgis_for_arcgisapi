<template>
  <div class="basemap-toggle">
    <img v-if="isShow"
          :src="basemaps[0].src" 
          :alt="basemaps[0].alt"
          :id="basemaps[0].id"  
          @click="_basemapToggle" />
    <img v-else
          :src="basemaps[1].src" 
          :alt="basemaps[1].alt"
          :id="basemaps[1].id"   
          @click="_basemapToggle" />
  </div>
</template>

<script>
import {loadModules} from 'esri-loader'
import options from 'components/config'


export default {
  name: 'BasemapToggle',
  data() {
    return {
      isShow: false,
      basemaps: [ 
        {
          id: 1,
          src: require("assets/image/mapwidget/darkbasemap.png"),
          url: 'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer',
          alt: "暗色底图"
        },
        {
          id: 2,
          src: require("assets/image/mapwidget/warmbasemap.png"),
          url: 'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetWarm/MapServer',
          alt: "暖色底图"
        }
      ]
    }
  },
  computed: {
    _currentMapView() {
      return this.$store.state._defaultMapView
    }
  },
  methods: {
    // 底图切换  
    async _basemapToggle(e) {
      const _self = this
      const [Basemap, TileLayer] = await loadModules([
        'esri/Basemap',
        'esri/layers/TileLayer'
      ], options)

      if (_self._currentMapView) {
        _self.basemaps.forEach((bm) => {
          if (e.target.id === bm.id.toString()) {
            const basemap = new Basemap({
              baseLayers: [
                new TileLayer({
                  url: bm.url
                })
              ]
            })
            _self._currentMapView.map.basemap = basemap
            _self.isShow = !_self.isShow
          }
        })
      }
    }
  }
}
</script>

<style>
  .basemap-toggle {
    position: absolute;
    left: 80px;
    bottom: 20px;
    background-color: #fff;
  }

  .basemap-toggle img {
    height: 70px;
    width: 60px;
    margin-bottom: -4px;
  }

  .basemap-toggle img:hover{
    cursor: pointer;
  }


  
</style>