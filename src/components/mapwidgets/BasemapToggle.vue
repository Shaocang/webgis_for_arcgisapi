<template>
  <div class="basemap-toggle">
    <img v-if="isShow"
          :src="imgs[0].src" 
          :alt="imgs[0].alt"  
          @click="basemapToggle" />
    <img v-else
          :src="imgs[1].src" 
          :alt="imgs[1].alt"  
          @click="basemapToggle" />
  </div>
</template>

<script>
import {loadModules} from 'esri-loader'

const options = {
  version: '4.23',
  css: true
}

export default {
  name: 'BasemapToggle',
  data() {
    return {
      darkBasemap: '',
      warmBasemap: '',
      currentBasemap: '',
      isShow: false,
      imgs: [ 
        {
          id: 1,
          src: require("assets/image/mapwidget/darkbasemap.png"),
          alt: "暗色底图"
        },
        {
          id: 2,
          src: require("assets/image/mapwidget/warmbasemap.png"),
          alt: "暖色底图"
        }
      ]
    }
  },
  // 实例一旦创建完成 开始调用创建底图
  created() {
    this._createBasemap()
  },
  methods: {
    async _createBasemap() {
      const [Basemap, TileLayer] = await loadModules([
        'esri/Basemap',
        'esri/layers/TileLayer',
      ], options)

      const warmBasemap = new Basemap({
        baseLayers: [
          new TileLayer({
            url: 'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetWarm/MapServer'
          })
        ]
      })
      this.warmBasemap = warmBasemap

      const darkBasemap = new Basemap({
        baseLayers: [
          new TileLayer({
            url: 'https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
          })
        ]
      })
      this.darkBasemap = darkBasemap
      this.currentBasemap = darkBasemap
    },
    // 地图切换  
    basemapToggle() {
      const view = this.$store.state.defaultView
      if (view && this.darkBasemap && this.warmBasemap) {
          if (this.currentBasemap === this.darkBasemap) {
            view.map.basemap = this.warmBasemap
            this.currentBasemap = this.warmBasemap
            this.isShow = true
          } else {
            view.map.basemap = this.darkBasemap
            this.currentBasemap = this.darkBasemap
            this.isShow = false
          }
      } else {
        return
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