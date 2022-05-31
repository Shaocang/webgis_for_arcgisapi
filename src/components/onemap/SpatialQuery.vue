<template>
  <div class="spatial-query">
    <button @click="queryTask">空间查询</button>
  </div>
</template>

<script>
import { loadModules } from 'esri-loader'
import options from 'components/config'


export default {
  name: 'SpatialQuery',
  computed: {
    _currentMapView() {
      return this.$store.state._defaultMapView
    }
  },
  methods: {
    async queryTask() {
      const _self = this
      const map = _self._currentMapView.map
      if (!_self._currentMapView) {return}
      if (!map.findLayerById('3')) {
        _self.$message({
          message: '请添加火车站点图层',
          type: 'warning'
        })
        return
      }
      if (map.findLayerById('resultlayer')) {
        map.remove(map.findLayerById('resultlayer'))
      }
      if (map.findLayerById('sketchQueryLayer')) {
        map.remove(map.findLayerById('sketchQueryLayer'))
      }
      const [QueryTask, Query, SketchViewModel, GraphicsLayer, FeatureLayer] = await loadModules([
        'esri/tasks/QueryTask',
        'esri/tasks/support/Query',
        'esri/widgets/Sketch/SketchViewModel',
        'esri/layers/GraphicsLayer',
        'esri/layers/FeatureLayer'
      ], options)

      const sketchLayer = new GraphicsLayer({
        id: 'sketchQueryLayer'
      })
      map.add(sketchLayer)

      const polygonSymbol = {
        type: 'simple-fill',
        color: [255, 255, 255, 0.4],
        outline: {
          color: 'white',
          width: 1
        }
      } 

      const sketchVM = new SketchViewModel({
        view: _self._currentMapView,
        polygonSymbol,
        layer: sketchLayer,
        updateOnGraphicClick: false
      })
      
      const pointsRender = {
        type: 'simple',
        symbol: {
          type: "picture-marker",  // autocasts as new SimpleMarkerSymbol()
          url: require(`assets/image/mapwidget/train.png`),
          width: '32px',
          height: '32px'
        }
      }
      sketchVM.create('polygon')

      // 创建完成 添加新的resultlayer 并渲染
      sketchVM.on('create', (e) => {
        if (e.state === 'complete') {
          const queryTask = new QueryTask({
            url: 'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/trainpoints/FeatureServer/12'
          })
          let query = new Query()
          query.returnGeometry = true
          query.outFields = ['*']
          query.geometry = e.graphic.geometry
        
          queryTask.execute(query)
            .then((results) => {
              const resultLayer = new FeatureLayer({
                id: 'resultlayer',
                source: results.features,
                renderer: pointsRender,
                objectIdField: 'FID',
                geometryType: 'point',
                spatialReference: {wkid: 3857},
                fields: [
                  {
                    name: 'FID',
                    type: 'oid',
                  },
                  {
                    name: '站名',
                    type: 'string'
                  }
                ],
              })
              map.add(resultLayer)
            })
        }
      })


    }
  }
}
</script>

<style>
  .spatial-query {
    position: absolute;
    top: 200px;
    right: 200px;
  }
</style>