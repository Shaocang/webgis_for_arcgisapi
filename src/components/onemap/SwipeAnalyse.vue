<template>
  <div class="swipe-analyse">
    <button @click="swipeWidget">卷帘分析</button>
  </div>
</template>

<script>
import {loadModules} from 'esri-loader'
import options from 'components/config'

export default {
  name: 'SwipeAnalyse',
  computed: {
    // 当前View 与vuex的state绑定 如果绑定到data做不到响应式
    _currentMapView() {
      return this.$store.state._defaultMapView
    }
  },
  methods: {
    async swipeWidget() {
      const _self = this
      const map = _self._currentMapView.map
      const [Swipe, TileLayer] = await loadModules([
        'esri/widgets/Swipe',
        'esri/layers/TileLayer'
      ], options)

      const layers = map.layers.filter(layer => layer.type === 'feature')
      console.log(layers.length);

      const infrared = new TileLayer({
        url: "https://tiles.arcgis.com/tiles/P3ePLMYs2RVChkJx/arcgis/rest/services/WV03_Kilauea_20180519_ShortwaveInfrared/MapServer",
        maxScale: 3000
      });
      map.add(infrared);

      const nearInfrared = new TileLayer({
        url: "https://tiles.arcgis.com/tiles/P3ePLMYs2RVChkJx/arcgis/rest/services/WV03_Kilauea_20180519_NearInfrared/MapServer",
        maxScale: 3000
      });
      map.add(nearInfrared);

      _self._currentMapView.goTo({
        zoom: 14,
        center: [-154.88, 19.46],
      })

      const swipe = new Swipe({
        leadingLayers: [infrared],
        trailingLayers: [nearInfrared],
        position: 35, // set position of widget to 35%
        view: _self._currentMapView
      });
      _self._currentMapView.ui.add(swipe)
    }
  }
}
</script>

<style>
  .swipe-analyse {
    position: absolute;
    top: 300px;
    right: 200px;
  }
</style>