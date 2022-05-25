<template>
  <div class="measure-menu">
    <el-dropdown @command="_handleCommand">
      <span class="el-dropdown-link">
        测量菜单<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="a">距离测量</el-dropdown-item>
        <el-dropdown-item command="b">面积测量</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div class="result-panel">
      <div class="result">
        
      </div>
    </div>
  </div>
</template>

<script>
import {loadModules} from 'esri-loader'
import options from 'components/config'

export default {
  name: 'MeasureMenu',
  data() {
    return {
      sketchVM: '',
      sketchLayer: '',
      geomType: '',
      result: 0,
      unit: '',
    }
  },
  computed: {
    _currentMapView() {
      return this.$store.state._defaultMapView
    }
  },
  mounted() {
    const _self = this
    const checkView = setInterval(() => {
      if (_self._currentMapView) {
        _self._initSketch()
        clearInterval(checkView)
      }
    }, 200)
  },
  methods: {
    _handleCommand(command) {
      if (this.sketchVM) {
        if (this.sketchLayer.graphics.length > 0) {
          this.sketchLayer.removeAll()
          const polylineLabel = this._currentMapView.map.findLayerById('polylineLabel')
          if (polylineLabel) {
            this._currentMapView.map.remove(polylineLabel)
          }
          const polygonLabel = this._currentMapView.map.findLayerById('polygonLabel')
          if (polygonLabel) {
            this._currentMapView.map.remove(polygonLabel)
          }
        }
      switch (command) {
        case 'a':
          this.sketchVM.create('polyline')
          break
        case 'b':
          this.sketchVM.create('polygon')
          break
      }
      }
    },
    // 初始化Sketch
    async _initSketch() {
      const _self = this
      const [GraphicsLayer,
            FeatureLayer,
            SketchViewModel,
            GeometryService,
            LengthsParameters,
            AreasAndLengthsParameters] = await loadModules([
        'esri/layers/GraphicsLayer',
        'esri/layers/FeatureLayer',
        'esri/widgets/Sketch/SketchViewModel',
        'esri/tasks/GeometryService',
        'esri/tasks/support/LengthsParameters',
        'esri/tasks/support/AreasAndLengthsParameters'
      ], options)

      const sketchLayer = new GraphicsLayer()
      _self._currentMapView.map.add(sketchLayer)
      
      const polylineSymbol = {
        type: 'simple-line',
        color: 'red',
        style: 'solid',
        width: 3
      }

      const polygonSymbol = {
        type: 'simple-fill',
        color: [255, 0, 0, 0.4],
        outline: {
          color: 'white',
          width: 1
        }
      }

      const sketch = new SketchViewModel({
        view: _self._currentMapView,
        polylineSymbol,
        polygonSymbol,
        layer: sketchLayer,
        updateOnGraphicClick: false
      })
      _self.sketchVM = sketch
      _self.sketchLayer = sketchLayer

      const url = 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer'
      const geometryService = new GeometryService({
        url
      })
      
      sketch.on('create', (e) => {
        if (e.state === 'complete') {
          const type = e.graphic.geometry.type
          if (type === 'polyline') {
            const lengthsParameters = new LengthsParameters({
              lengthUnit: 9036,
              polylines: e.graphic.geometry
            })
            geometryService.lengths(lengthsParameters)
            .then((result) => {
              const labelClass = {
                symbol: {
                  type: 'text',
                  color: 'white',
                  font: {
                    family: "Ubuntu Mono",
                    size: 14,
                    weight: "bold"
                  }
                },
                labelPlacement: 'center-along',
                labelExpression: `${Number(result.lengths).toFixed(2)}km`,
              }
              const graphics = []
              graphics.push(e.graphic)
              const polylineLabelLayer = new FeatureLayer({
                source: graphics,
                id: 'polylineLabel',
                objectIdField: '1',
                labelingInfo: [labelClass],
                opacity: 0
              })
              _self._currentMapView.map.add(polylineLabelLayer)
              console.log(result.lengths);
            })
          }
          if (type === 'polygon') {
            const areasAndLengthsParameters = new AreasAndLengthsParameters({
              areaUnit: 'square-kilometers',
              lengthUnit: 'kilometers',
              polygons: e.graphic.geometry
            })

            geometryService.areasAndLengths(areasAndLengthsParameters)
            .then((result) => {
              const labelClass = {
                symbol: {
                  type: 'text',
                  color: 'white',
                  font: {
                    family: "Ubuntu Mono",
                    size: 14,
                    weight: "bold"
                  }
                },
                labelPlacement: 'always-horizontal',
                labelExpression: `${Number(result.areas).toFixed(2)}km2`,
              }
              const graphics = []
              graphics.push(e.graphic)
              const polygonLabelLayer = new FeatureLayer({
                source: graphics,
                id: 'polygonLabel',
                objectIdField: '1',
                labelingInfo: [labelClass],
                opacity: 0
              })
              _self._currentMapView.map.add(polygonLabelLayer)
              console.log(result.areas, result.lengths);
            })
          } 
        }
      })
    },
  }
}
</script>

<style>
  .measure-menu {
    position: absolute;
    left: 80px;
    top: 500px
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }

</style>